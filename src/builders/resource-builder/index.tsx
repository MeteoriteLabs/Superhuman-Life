
import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import MessagePage from "./message";
import MindsetPage from "./mindset";
import InformationPage from "./information bank";


export default function ResourcePage() {
   
    return (
        <>
            <h3>Resources</h3>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs variant="pills" transition={false} defaultActiveKey="message">
                        <Tab eventKey="message" title="Messages">
                            <TabContent>
                                <hr/>
                                
                                    
                                        <MessagePage/>

                                    
                                
                            </TabContent>
                        </Tab>
                        <Tab eventKey="mindset" title="Mindset">
                            <TabContent>
                                <hr/>
                                <MindsetPage/>
                            </TabContent>
                        </Tab>
                        <Tab eventKey="informationbank" title="Information Bank">
                            <TabContent>
                                <hr/>
                                <InformationPage/>
                            </TabContent>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
