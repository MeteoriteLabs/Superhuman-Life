import { useEffect, useRef, useState } from 'react';
import { withTheme, utils } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Col, Modal, Row } from 'react-bootstrap';

const FinanceModal = (props: any) => {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets['FileWidget'];
  (Bootstrap4Theme as any).widgets['FileWidget'] = defaultFileWidget;

  const Form: any = withTheme(Bootstrap4Theme);
  const formRef = useRef<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>('');

  useEffect(() => {
    props.actionType === 'view' ||
    props.actionType === 'viewUPIDetails' ||
    props.actionType === 'viewBankDetails' ||
    props.actionType === 'edit' ||
    props.actionType === 'editBankDetails' ||
    props.actionType === 'editUPI'
      ? setFormValues(props.formData)
      : setFormValues('');
  }, [props.formData, props.actionType]);

  props.modalTrigger.subscribe((res: boolean) => {
    setShow(res);
  });

  function submitHandler(formData: any) {
    setFormValues({ ...formValues, ...formData });
    props.formSubmit(formData);
  }

  return (
    <div>
      <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title as={Row}>
            <Col xs={12} md={12} lg={12}>
              <p className="lead">{props.name}</p>
            </Col>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="show-grid bg-light">
          <Row>
            <Col lg={12}>
              <div style={{ height: '400px', overflowX: 'hidden', overflowY: 'auto' }}>
                <Form
                  uiSchema={props.formUISchema}
                  disabled={
                    props.actionType === 'view' ||
                    props.actionType === 'viewUPIDetails' ||
                    props.actionType === 'viewBankDetails'
                      ? true
                      : false
                  }
                  schema={props.formSchema}
                  ref={formRef}
                  onSubmit={({ formData }: any) => submitHandler(formData)}
                  formData={formValues}
                  widgets={props.widgets}>
                  <div></div>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            style={{ padding: '5px 40px' }}
            variant={props.actionType === 'view' ? 'danger' : 'success'}
            size="sm"
            onClick={(event) => {
              props.actionType === 'view'
                ? props.modalTrigger.next(false)
                : formRef.current.onSubmit(event);
            }}>
            {props.actionType === 'view' ? 'Close' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FinanceModal;
