import { Card, Tab, Tabs, TabContent, Button } from 'react-bootstrap';
import Programs from './clienthome/ProgramScreens/clientprograms';
import Goals from './clienthome/Goalscreen/clientGoals';
import Orders from './clienthome/OrderScreen/clientOrders';
import Wall from './clienthome/TeamWallScreen/index';
import Data from './clienthome/DataScreen/ClientData';
import ClientSchedular from './clienthome/SchedularScreen';
import { useQuery } from '@apollo/client';
import { GET_CLIENT_DATA_NEW } from './queries';
import { useState, useContext } from 'react';
import AuthContext from '../../../context/auth-context';
import { flattenObj } from '../../../components/utils/responseFlatten';

function Client() {
    const last = window.location.pathname.split('/').pop();
    const auth = useContext(AuthContext);
    const [clientName, setClientName] = useState<any>(' ');
    const [clientSex, setClientSex] = useState<any>(' ');
    const [clientPhoto, setClientPhoto] = useState<any>(' ');
    const [showScheduler, setShowScheduler] = useState(false);
    const [effectiveDate, setEffectiveDate] = useState<any>(' ');

    function handleRedirect() {
        window.location.href = `/clients`;
    }

    function FetchData() {
        const _variables = { id: auth.userid, clientid: last };
        useQuery(GET_CLIENT_DATA_NEW, { variables: _variables, onCompleted: loadData });
    }

    FetchData();

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });
        [...flattenData.clientPackages].map((Detail) => {
            setClientName(Detail.users_permissions_user?.username);
            setClientSex(Detail.users_permissions_user?.email);
            setClientPhoto(Detail.users_permissions_user?.Photo_ID);
            setEffectiveDate(Detail.effective_date);
            return {};
        });
    }

    function handleSchedulerButtonClick() {
        setShowScheduler(true);
    }

    return (
        <div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <i
                        className="fas fa-arrow-circle-left fa-2x d-inline"
                        onClick={() => {
                            handleRedirect();
                        }}
                        style={{ cursor: 'pointer' }}
                    ></i>

                    <h3 className="d-inline ml-3 font-weight-bold">{clientName}</h3>
                </div>
                <div className="px-5">
                    {showScheduler ? null : (
                        <Button variant="dark" onClick={handleSchedulerButtonClick}>
                            Scheduler
                        </Button>
                    )}
                </div>
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    {showScheduler ? (
                        <ClientSchedular
                            clientName={clientName}
                            clientPhoto={clientPhoto}
                            effectiveDate={effectiveDate}
                        />
                    ) : (
                        <>
                            <Tabs
                                variant="pills"
                                defaultActiveKey="insights"
                                id="uncontrolled-tab-example"
                                className="mb-2"
                            >
                                <Tab eventKey="insights" title="Profile">
                                    <hr />
                                    <TabContent>
                                        <div className="d-flex justify-content-center">
                                            <div
                                                className="d-flex flex-column align-items-center justify-content-center shadow p-5 mb-3 bg-white rounded"
                                                style={{
                                                    maxWidth: '90%',
                                                    padding: '25px'
                                                }}
                                            >
                                                <img
                                                    src={
                                                        clientPhoto
                                                            ? clientPhoto
                                                            : '/assets/image_placeholder.svg'
                                                    }
                                                    height="130"
                                                    className="rounded-circle"
                                                    width="130"
                                                    alt="avatar"
                                                    style={{ backgroundColor: 'gray' }}
                                                />
                                                <div className="text-center mt-3">
                                                    <h2>{clientName}</h2>
                                                    <p className="text-muted">{clientSex}</p>
                                                </div>
                                                <div style={{ marginTop: '30px' }}>
                                                    <img
                                                        src="/assets/videocall.svg"
                                                        height="50"
                                                        className="rounded-circle ml-2"
                                                        alt="avatar"
                                                    />
                                                    <img
                                                        src="/assets/phonecall.svg"
                                                        height="50"
                                                        className="rounded-circle ml-2"
                                                        alt="avatar"
                                                    />
                                                    <img
                                                        src="/assets/message.svg"
                                                        height="50"
                                                        className="rounded-circle ml-2"
                                                        alt="avatar"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabContent>
                                </Tab>

                                <Tab eventKey="programs" title="Bookings">
                                    <TabContent>
                                        <hr />
                                        <Programs />
                                    </TabContent>
                                </Tab>
                                <Tab eventKey="data" title="Data">
                                    <TabContent>
                                        <hr />
                                        <Data />
                                    </TabContent>
                                </Tab>
                                <Tab eventKey="teamwall" title="Team Wall">
                                    <TabContent>
                                        <hr />
                                        {/* <Wall /> */}
                                    </TabContent>
                                </Tab>
                                <Tab eventKey="goal" title="Goals">
                                    <TabContent>
                                        <hr />
                                        <Goals />
                                    </TabContent>
                                </Tab>
                            </Tabs>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default Client;
