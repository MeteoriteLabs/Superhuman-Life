import { Card, Tab, Tabs } from 'react-bootstrap'
// import Event from "./Event/Event";
import Fitness from './Fitness/Fitness'
// import Journey from "./Journey/Journey";
// import Nutrition from "./Nutrition/Nutrition";

export default function Invoice() {
    return (
        <div>
            <Card className="shadow-sm mt-2" border="light">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="fitness">
                        <Tab eventKey="fitness" title="Fitness">
                            <Fitness />
                        </Tab>
                        {/* <Tab eventKey="nutrition" title="Nutrition">
                            <Nutrition/>
                        </Tab>
                        <Tab eventKey="journey" title="Journey">
                            <Journey/>
                        </Tab>
                        <Tab eventKey="event" title="Event">
                            <Event/>
                        </Tab>
                        */}
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
