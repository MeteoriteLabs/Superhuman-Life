import { useContext, useState } from 'react';
import AuthContext from "../../../context/auth-context";
import { Container, Row, Col, Card } from 'react-bootstrap';
import ChangePasswordPage from '../../changePassword';
import Modules from '../../Modules';
import DeleteAccountConfirmation from '../../DeleteAccountConfirmation';
import { FETCH_USER_PROFILE_DATA  } from "../queries/queries";
import { useQuery } from "@apollo/client";
import moment from 'moment';

function ChangemakersSettings() {
    const [showPasswordSetting, setShowPasswordSetting] = useState(false);
    const [showModuleSetting, setShowModuleSetting] = useState(false);
    const [showDeleteAccountSetting, setShowDeleteAccountSetting] = useState(false);
    const auth = useContext(AuthContext);
    const [profileData, setProfileData] = useState<any>({});

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            setProfileData(r.usersPermissionsUser.data.attributes);
        },
    });

    return (
        <>
            <Container>
                <h3>Changemaker Settings</h3>
                <hr style={{ height: '12px' }} />
                {showPasswordSetting && <ChangePasswordPage show={showPasswordSetting} onHide={() => setShowPasswordSetting(false)} />}
                {showModuleSetting && <Modules show={showModuleSetting} onHide={() => setShowModuleSetting(false)} />}
                {showDeleteAccountSetting && <DeleteAccountConfirmation show={showDeleteAccountSetting} onHide={() => setShowDeleteAccountSetting(false)} />}
                <Row>

                    {/* Reset Password */}
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12} onClick={() => setShowPasswordSetting(true)} style={{ cursor: 'pointer' }}>
                        <Card className="shadow-lg bg-white rounded p-3" >

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/password.svg" alt="password" height="24px" />
                                <Card.Title className='pt-1'>Change Password</Card.Title>
                                <Card.Text>
                                    <small>Last updated: {profileData ? moment(profileData.updatedAt).format('MMMM DD,YYYY') : null}</small>
                                </Card.Text>
                                
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Notification settings */}
                    {/* <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12}>
                        <Card className="shadow-lg bg-white rounded p-3">

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/notification.svg" alt="notification" height="24px" />
                                <Card.Title className='pt-1'>Notifications Settings</Card.Title>
                                <Card.Text>
                                    <small>Last updated: 29 Aug 2022</small>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col> */}


                    {/* Modules */}
                    {/* <Col className="pb-1 pt-2" md={{ span: 4 }} sm={12} onClick={() => setShowModuleSetting(true)} style={{ cursor: 'pointer' }}>
                        <Card className="shadow-lg bg-white rounded p-3">

                            <Card.Body className='text-center'>
                                <img src="/assets/profile_icons/modules.svg" alt="modules" height="24px" />
                                <Card.Title className='pt-1'>Modules</Card.Title>
                                <Card.Text>
                                    <small>Last updated: 29 Aug 2022</small>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col> */}

                    {/* Delete Account */}
                    <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12} onClick={() => setShowDeleteAccountSetting(true)} style={{ cursor: 'pointer' }}>
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
