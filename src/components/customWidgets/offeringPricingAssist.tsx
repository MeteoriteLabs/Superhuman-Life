import { Modal, Button, Row, Col, Form } from 'react-bootstrap'

const OfferingPricingAssist = (props: any) => {
    return (
        <Modal {...props} centered size="lg" aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Price Assist</Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <h5>
                    The base price you set up here will help you calculate pricing for your
                    offerings
                </h5>
                <hr />
                <Row className="mb-4">
                    <Col xs={6} md={4} lg={2}>
                        <span>Type: </span>
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <img src={props.imageURL} alt={props.type} />
                    </Col>
                </Row>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>MRP</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">Please set price for one class</Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'center' }}>
                <Button onClick={props.onHide} className="pr-5 pl-5" variant="success">
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OfferingPricingAssist
