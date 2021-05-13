import { Card, Tab, Tabs, TabContent } from "react-bootstrap";

export default function ResourcePage() {
    return (
        <>
            <h3>Resources</h3>
            <Card className="mt-3">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="fitness">
                        <Tab eventKey="fitness" title="Fitness">
                            <TabContent>
                                <hr />
                                Fitness Tab
                            </TabContent>
                        </Tab>
                        <Tab eventKey="knowledge" title="Knowledge">
                            <TabContent>
                                <hr />
                                Knowledge Tab
                            </TabContent>
                        </Tab>
                        <Tab eventKey="mindset" title="Mindset">
                            <TabContent>
                                <hr />
                                Mindset Tab
                            </TabContent>
                        </Tab>
                        <Tab eventKey="message" title="Message">
                            <TabContent>
                                <hr />
                                Message Tab
                            </TabContent>
                        </Tab>
                        <Tab eventKey="nutrition" title="Nutrition">
                            <TabContent>
                                <hr />
                                Nutrition Tab
                            </TabContent>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
