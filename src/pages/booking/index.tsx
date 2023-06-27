import { Card, Tab, Tabs } from 'react-bootstrap';
// import { useHistory } from "react-router-dom";
import Movement from './Movement/Movement';
import Sessions from './Sessions';

export default function BookingPage() {
    // const history = useHistory();

    // const routeChange = () => {
    //   const path = `/bookingSettings`;
    //   history.push(path);
    // };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h2>All Bookings</h2>
                {/* <div className="px-5">
          <Button onClick={routeChange} variant="outline-dark">
            Settings
          </Button>
        </div> */}
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs
                        style={{ borderBottom: '1px solid black' }}
                        className="pb-3 cards"
                        transition={false}
                        defaultActiveKey="fitness"
                        variant="pills"
                    >
                        <Tab eventKey="fitness" title="Fitness" className="mt-3">
                            <Card className="shadow-sm mt-2" border="light">
                                <Card.Body>
                                    <Tabs
                                        defaultActiveKey="offerings"
                                        variant="pills"
                                        className="cards"
                                    >
                                        <Tab eventKey="offerings" title="Offerings">
                                            <Movement />
                                        </Tab>
                                        <Tab eventKey="sessions" title="Sessions">
                                            <Sessions />
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}
