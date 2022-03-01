import { useRef, useState } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";
import { Button, Col, Row, Card } from "react-bootstrap";

export default function BasicProfile({
  name,
  formUISchema,
  formSubmit,
  formSchema,
  formData,

  widgets,
}: any) {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets["FileWidget"];
  (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;

  const Form: any = withTheme(Bootstrap4Theme);
  const formRef = useRef<any>(null);
  const [step, setStep] = useState<number>(1);

  console.log(formData);

  function submitHandler(data: any) {
    formSubmit(data);
  }

  return (
    <>
      <Card>
        <Card.Title>
          <Col xs={12} md={12} lg={12}>
            <p className="lead">{name ? name : formData.name}</p>
          </Col>
        </Card.Title>

        <Card.Body className="show-grid bg-light">
          <Row>
            <Col md={12}>
              <div
                style={{
                  height: "400px",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
              >
                <Form
                  uiSchema={formUISchema}
                  schema={formSchema[step.toString()]}
                  ref={formRef}
                  onSubmit={({ formData }: any) => submitHandler(formData)}
                  formData={formData}
                  widgets={widgets}
                >
                  <div></div>
                </Form>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              md={{ offset: 0, span: 11 }}
              className="d-flex justify-content-end"
            >
              <Button
                variant="outline-success"
                size="sm"
                onClick={(event) => formRef.current.onSubmit(event)}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
