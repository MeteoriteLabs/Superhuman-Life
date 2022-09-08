import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ChangePasswordPage from '../../changePassword';
import Modules from '../../Modules';
import DeleteAccountConfirmation from '../../DeleteAccountConfirmation';

function ChangemakersSettings() {
    const [showPasswordSetting, setShowPasswordSetting] = useState(false);
    const [showModuleSetting, setShowModuleSetting] = useState(false);
    const [showDeleteAccountSetting, setShowDeleteAccountSetting] = useState(false);

    const handleClosePassword = () => setShowPasswordSetting(false);
    const handleShowPassword = () => setShowPasswordSetting(true);

    const handleCloseModule = () => setShowModuleSetting(false);
    const handleShowModule = () => setShowModuleSetting(true);

    const handleCloseDeleteAccount = () => setShowDeleteAccountSetting(false);
    const handleShowDeleteAccount = () => setShowDeleteAccountSetting(true);
    
    return (
        <>
            <Container>
                <h3>Changemaker Settings</h3>
                <hr style={{ height: '12px' }} />
                {showPasswordSetting && <ChangePasswordPage show={showPasswordSetting} onHide={handleClosePassword}/>}
                {showModuleSetting && <Modules show={showModuleSetting} onHide={handleCloseModule}/>}
                {showDeleteAccountSetting && <DeleteAccountConfirmation show={showDeleteAccountSetting} onHide={handleCloseDeleteAccount}/>}
                <Row>

                   {/* Reset Password */}
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 2 }} sm={12} onClick={handleShowPassword} style={{cursor: 'pointer'}}>
                        <Card className="shadow-lg bg-white rounded p-3" >

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/password.svg" alt="password" height="24px" />
                                <Card.Title className='pt-1'>Change Password</Card.Title>
                                <Card.Text>
                                    <small>Last updated: 29 Aug 2022</small>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Notification settings */}
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12}>
                        <Card className="shadow-lg bg-white rounded p-3">

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/notification.svg" alt="notification" height="24px" />
                                <Card.Title className='pt-1'>Notifications Settings</Card.Title>
                                <Card.Text>
                                    <small>Last updated: 29 Aug 2022</small>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Modules */}
                <Row>
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 2 }} sm={12} onClick={handleShowModule} style={{cursor: 'pointer'}}>
                        <Card className="shadow-lg bg-white rounded p-3">

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/modules.svg" alt="modules" height="24px" />
                                <Card.Title className='pt-1'>Modules</Card.Title>
                                <Card.Text>
                                    <small>Last updated: 29 Aug 2022</small>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Delete Account */}
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12} onClick={handleShowDeleteAccount} style={{cursor: 'pointer'}}>
                        <Card className="shadow-lg bg-white rounded p-3">

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/delete.svg" alt="delete account" height="24px" />
                                <Card.Title className='pt-1'>Delete Account</Card.Title>
                                <Card.Text>
                                    <small>You will have to setup a new account</small>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>

        </>
    )
}

export default ChangemakersSettings;
