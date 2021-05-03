import { Card, Tab, Tabs } from "react-bootstrap";
import EventsTab from "./events";
import FitnessTab from "./fitness";
import JourneyTab from "./journey";
import NutritionTab from "./nutrition";

export default function PackagePage() {
    return (
        <Card>
            <Card.Header as="h4">Packages</Card.Header>
            <Card.Body>
                <Tabs variant="pills" transition={false} defaultActiveKey="events">
                    <Tab eventKey="events" title="Events">
                        <EventsTab />
                    </Tab>
                    <Tab eventKey="fitness" title="Fitness">
                        <FitnessTab />
                    </Tab>
                    <Tab eventKey="journey" title="Journey">
                        <JourneyTab />
                    </Tab>
                    <Tab eventKey="nutrition" title="Nutrition">
                        <NutritionTab />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}
