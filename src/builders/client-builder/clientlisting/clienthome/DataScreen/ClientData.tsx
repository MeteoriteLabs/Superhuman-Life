import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
// import Movement from "./movement";
// import Nutrition from "./nutrition";
function Data() {
     return (
          <div>
               <Card className="shadow-sm mt-3" border="light">
                    <Card.Body>
                         <Tabs variant="pills" transition={false} defaultActiveKey="basic">
                              <Tab eventKey="basic" title="Basic">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="health" title="Health">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="physicalfitness" title="Physical Fitness">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="nutrition" title="Nutrition">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="documents" title="Documents">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                         </Tabs>
                    </Card.Body>
               </Card>
          </div>
     );
}

export default Data;
