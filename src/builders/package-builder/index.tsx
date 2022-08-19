import { Card, Tab, Tabs } from "react-bootstrap";
import FitnessTab from "./fitness/Fitness";


export default function PackagePage() {
    return (
        <>
            <h3>Offerings</h3>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="fitness">
                    
                        <Tab eventKey="fitness" title="Fitness">
                            <FitnessTab />
                        </Tab>
            
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
