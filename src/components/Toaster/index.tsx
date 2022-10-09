import { useState } from 'react';
import { Row, Col, Toast } from 'react-bootstrap';

function Toaster(props: any) {
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="fixed-bottom float-right ml-auto"
        >
            <Row>
                <Col xs={6} className="my-1 ml-auto">
                    <Toast className="ml-auto" onClose={() => {toggleShowA(); props.handleCallback();}} show={showA} animation={false} delay={5000} autohide
                    >
                        <Toast.Header>
                            <h6 className={props.headingCSS}>{props.heading}</h6>
                        </Toast.Header>
                        <Toast.Body className={props.textColor}>{props.msg}</Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </div>
    )
}

export default Toaster;
