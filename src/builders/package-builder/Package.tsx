import { Card, Tab, Tabs } from "react-bootstrap";
import EventsTab from "./events";
import FitnessTab from "./fitness/Fitness";
import JourneyTab from "./journey";
import NutritionTab from "./nutrition";

export default function PackagePage() {
    return (
        <>
            <h3>Packages</h3>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="events">
                        <Tab eventKey="fitness" title="Fitness">
                            <FitnessTab />
                        </Tab>
                        {/* <Tab eventKey="events" title="Events">
                            <EventsTab />
                        </Tab>
                        <Tab eventKey="journey" title="Journey">
                            <JourneyTab />
                        </Tab>
                        <Tab eventKey="nutrition" title="Nutrition">
                            <NutritionTab />
                        </Tab> */}
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
