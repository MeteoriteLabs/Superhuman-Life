import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import ClientListing from "./clientlisting";

export default function ClientPage() {
     return (
          <>
               <h3>Clients</h3>
               <Card className="shadow-sm mt-3" border="light">
                    <Card.Body>
                         <Tabs variant="pills" transition={false} defaultActiveKey="message">
                              <Tab eventKey="message" title="Client">
                                   <TabContent>
                                        <hr />
                                        <ClientListing />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="mindset" title="Insights">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                         </Tabs>
                    </Card.Body>
               </Card>
          </>
     );
}
