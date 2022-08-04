import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
// import Movement from "./movement";
// import Nutrition from "./nutrition";

import BasicScreen from './basicScreen';
import HealthScreen from './healthScreen';
import DocumentsScreen from './documentsScreen';
import NutritionScreen from './nutritionScreen';
import PhysicalHealthScreen from "./physicalFitnessScreen";

function Data() {
     return (
          <div>
               <Card className="shadow-sm mt-3" border="light">
                    <Card.Body>
                         <Tabs variant="pills" transition={false} defaultActiveKey="basic">
                              <Tab eventKey="basic" title="Basic">
                                   <TabContent>
                                        <hr />
                                        <BasicScreen />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="health" title="Health">
                                   <TabContent>
                                        <hr />
                                        <HealthScreen />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="physicalfitness" title="Physical Fitness">
                                   <TabContent>
                                        <hr />
                                        <PhysicalHealthScreen />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="nutrition" title="Nutrition">
                                   <TabContent>
                                        <hr />
                                        <NutritionScreen />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="documents" title="Documents">
                                   <TabContent>
                                        <hr />
                                        <DocumentsScreen />
                                   </TabContent>
                              </Tab>
                         </Tabs>
                    </Card.Body>
               </Card>
          </div>
     );
}

export default Data;
