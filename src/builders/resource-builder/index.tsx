import { Card, Tab, Tabs, TabContent } from "react-bootstrap";

export default function ResourcePage() {
    return (
        <>
            <h3>Resources</h3>
            <Card className="mt-3">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="fitness">
                        <Tab eventKey="message" title="Messages">
                            <TabContent>
                                <hr />
                                Messages
                            </TabContent>
                        </Tab>
                        <Tab eventKey="mindset" title="Mindset">
                            <TabContent>
                                <hr />
                                Mindset
                            </TabContent>
                        </Tab>
                        <Tab eventKey="information" title="Information Bank">
                            <TabContent>
                                <hr />
                                Information Bank
                            </TabContent>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
