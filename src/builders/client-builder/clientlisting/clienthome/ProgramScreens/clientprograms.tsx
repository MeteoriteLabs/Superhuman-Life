import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import Movement from "./movement";
import Nutrition from "./nutrition";
function Programs() {
     return (
          <div>
               <Card className="shadow-sm mt-3" border="light">
                    <Card.Body>
                         <Tabs variant="pills" transition={false} defaultActiveKey="movement">
                              <Tab eventKey="movement" title="Movement">
                                   <TabContent>
                                        <hr />
                                        <Movement />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="nutrition" title="Nutrition">
                                   <TabContent>
                                        <hr />
                                        <Nutrition />
                                   </TabContent>
                              </Tab>
                         </Tabs>
                    </Card.Body>
               </Card>
          </div>
     );
}

export default Programs;
