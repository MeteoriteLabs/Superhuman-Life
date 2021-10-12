import { Card, Tab, Tabs } from "react-bootstrap";
import Fitness from "./Fitness/Fitness";
import './pricingAssist.css'

export default function PricingAssist() {
    return (
        <div>
             <Card className="shadow-sm mt-2" border="light">
                <Card.Body>
                    <Tabs  variant="pills" transition={false} defaultActiveKey="pt">
                        <Tab eventKey="fitness" title="Fitness">
                            <Fitness/>
                        </Tab>
                        <Tab eventKey="nutrition" title="Nutrition">
                            {/* <Nutrition/> */}
                        </Tab>
                        <Tab eventKey="event" title="Event">
                            {/* <Event/> */}
                        </Tab>
                       
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
