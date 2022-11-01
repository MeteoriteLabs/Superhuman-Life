import { useState } from 'react';
import { Row, Col, Toast } from 'react-bootstrap';

function Toaster(props: any) {
    const [showToaster, setShowToaster] = useState<boolean>(true);

    const toggleShowToaster = () => setShowToaster(!showToaster);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="fixed-bottom float-right ml-auto"
        >
            <Row>
                <Col xs={6} className="my-1 ml-auto">
                    <Toast className="ml-auto" onClose={() => {toggleShowToaster(); props.handleCallback();}} show={showToaster} animation={false} delay={5000} autohide
                    >
                        <Toast.Header>
                            <h6 className={props.type === 'success' ? 'mr-auto text-success' : 'mr-auto text-danger'}>{props.type === 'success' ? 'Success' : 'Failed'}</h6>
                        </Toast.Header>
                        <Toast.Body className={props.type === 'success' ? 'text-success' : 'text-danger'} style={{display: 'flex'}}>
                            {props.type === 'success' ? <img src="assets/toasterSuccess.svg" alt="confirmed" height="25px" width="25px" /> : <img src="assets/failed.svg" alt="failed" height="25px" width="25px" />}
                            {props.msg}
                        </Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </div>
    )
}

export default Toaster;

