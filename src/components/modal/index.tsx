import { useEffect, useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";
import { Button, Col, Modal, ProgressBar, Row } from "react-bootstrap";
import './modal.css';

export default function ModalView({
  name,
  formUISchema,
  formSubmit,
  formSchema,
  formData,
  isStepper,
  showErrorList,
  widgets,
  modalTrigger,
  stepperValues,
}: any) {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets["FileWidget"];
  (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

  const Form: any = withTheme(Bootstrap4Theme);
  const formRef = useRef<any>(null);
  const [step, setStep] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>(formData);
  const stepper: string[] = stepperValues;

  modalTrigger.subscribe((res: boolean) => {
    setShow(res);
  });

  useEffect(() => {
    setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show === false]);

  useEffect(() => {
    setFormValues(formData);
  }, [formData]);

  function submitHandler(data: any) {
    formData = { ...formData, ...data };

    if (isStepper && step < stepper.length) {
      console.log("Data submitted: ", data);
      setStep(step + 1);
      setFormValues({ ...formValues, ...data });
    } else {
      formSubmit({ ...formValues, ...data });
    }
  }

  // function submitHandler(data: any) {
  //   formData = { ...data };
  //   if (isStepper && step < stepper.length) {
  //     console.log("Data submitted: ", data);

  //     setStep(step + 1);
  //     setFormValues({ ...formValues, ...data });
  //   } else {
  //     // formSubmit({ ...formValues, ...data });
  //     formSubmit({ ...formValues, ...data });
  //   }
  //   console.log(data);
  //   // console.log(finalValues);
  // }

  return (
      <Modal show={show} onHide={() => setShow(false)} dialogClassName="custom-large-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title as={Row} className="w-100">
            <Col xs={12} md={12} lg={12}>
              <p className="lead">{name}</p>
            </Col>
            {isStepper &&
              stepper.map((item: string, id: number) => (
                <Col xs={2} md={2} lg={2} key={id}>
                  <ProgressBar
                    max={1}
                    now={step - (id + 1)}
                    style={{ height: "5px" }}
                    variant="danger"
                  />
                  <small className="text-muted">{`${id + 1}. ${item}`}</small>
                </Col>
              ))}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid bg-light">
          <Row>
            <Col lg={12}>
              <div
                style={{
                  height: "60vh",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
              >
                <Form
                  uiSchema={formUISchema}
                  schema={formSchema[step.toString()]}
                  ref={formRef}
                  showErrorList={showErrorList}
                  onSubmit={({ formData }: any) => submitHandler(formData)}
                  formData={formValues}
                  widgets={widgets}
                  formContext={formValues}
                >
                  <div></div>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {isStepper ? (
            <>
              <Button
                variant="light"
                size="sm"
                onClick={() => setStep((step) => step - 1)}
                disabled={step === 1 ? true : false}
              >
                <i className="mr-2 fas fa-arrow-left"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(event) => formRef.current.onSubmit(event)}
              >
                {step < stepper.length ? (
                  <>
                    Next<i className="ml-4 fas fa-arrow-right"></i>
                  </>
                ) : (
                  <>
                    Create<i className="ml-4 fas fa-check"></i>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setShow(false);
                }}
                className={name === "View" ? "d-none" : ""}
              >
                Close
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={(event) => {
                  formRef.current.onSubmit(event);
                }}
              >
                {name === "View" ? "Close" : "Submit"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
  );
}