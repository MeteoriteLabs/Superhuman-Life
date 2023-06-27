import React, { useState } from 'react';
import { Row, Col, Toast } from 'react-bootstrap';
import Icon from '../Icons';

const Toaster: React.FC<{ type: string; msg: string; handleCallback: () => void }> = (props) => {
    const [showToaster, setShowToaster] = useState<boolean>(true);

    const toggleShowToaster = () => setShowToaster(!showToaster);

    return (
        <div aria-live="polite" aria-atomic="true" className="fixed-bottom float-right ml-auto">
            <Row>
                <Col xs={6} className="my-1 ml-auto">
                    <Toast
                        className="ml-auto"
                        onClose={() => {
                            toggleShowToaster();
                            props.handleCallback();
                        }}
                        show={showToaster}
                        animation={false}
                        delay={5000}
                        autohide
                    >
                        <Toast.Header>
                            <h6
                                className={
                                    props.type === 'success'
                                        ? 'mr-auto text-success'
                                        : 'mr-auto text-danger'
                                }
                            >
                                {props.type === 'success' ? 'Success' : 'Failed'}
                            </h6>
                        </Toast.Header>
                        <Toast.Body
                            className={props.type === 'success' ? 'text-success' : 'text-danger'}
                            style={{ display: 'flex' }}
                        >
                            {props.type === 'success' ? (
                                <Icon name="done" width={24} height={24} />
                            ) : (
                                <Icon name="cancel" width={24} height={24} />
                            )}
                            {props.msg}
                        </Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </div>
    );
};

export default Toaster;
