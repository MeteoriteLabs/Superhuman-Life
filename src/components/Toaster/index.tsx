import { useEffect, useState } from 'react';
import { Row, Col, Toast } from 'react-bootstrap';

function Toaster(props: any) {
    const [showToaster, setShowToaster] = useState<boolean>(true);
    const [headingCSS, setHeadingCSS] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('');
    const [heading, setHeading] = useState<string>('');

    const toggleShowToaster = () => setShowToaster(!showToaster);

    useEffect(() => {
        if(props.type === 'error') {
            setHeadingCSS('mr-auto text-danger');
            setTextColor('text-danger');
            setHeading('Failed');
         } else if (props.type === 'success') {
             setHeadingCSS('mr-auto text-success');
             setTextColor('text-success');
             setHeading('Success');
         }
    },[props.type])

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
                            <h6 className={headingCSS}>{heading}</h6>
                        </Toast.Header>
                        <Toast.Body className={textColor} style={{display: 'flex'}}>
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
