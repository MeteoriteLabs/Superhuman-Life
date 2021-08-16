import { Card, Tab, Tabs } from "react-bootstrap";
import Fitness from "./Fitness/Fitness";


export default function SessionPage() {
    return (
        <div>
            <h3>Session Manager</h3>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="fiteness">
                        <Tab eventKey="fiteness" title="Fiteness">
                            <Fitness/>
                        </Tab>
                        <Tab eventKey="nutrition" title="Nutrition">
                            {/* <Fitness/> */}
                        </Tab>
                        <Tab eventKey="journey" title="Fiteness">
                            {/* <Fitness/> */}
                        </Tab>
                      
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
