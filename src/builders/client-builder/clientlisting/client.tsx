import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import Programs from "./clienthome/clientprograms";

function Client() {
     const last = window.location.pathname.split("/").pop();
     console.log(last);
     function handleRedirect() {
          window.location.href = `/clients`;
     }

     return (
          <div>
               <div className="mb-3">
                    <i
                         className="fas fa-arrow-circle-left fa-2x d-inline"
                         onClick={() => {
                              handleRedirect();
                         }}
                         style={{ cursor: "pointer" }}
                    ></i>

                    <h3 className="d-inline ml-3 font-weight-bold">Clients</h3>
               </div>
               <div className="border rounded shadow-lg bg-white border-dark p-4 ">
                    <div className="container ml-1">
                         <div className="row">
                              <img src="/assets/avatar-1.jpg" height="90" className="rounded-circle" alt="avatar" />
                              <div className="col">
                                   <h2 className="ml-2">Arjun Nair</h2>
                                   <p className="ml-2 mt-3 text-muted">Male 30 yrs 170cm 80kg </p>
                              </div>
                              <div className="row mt-5">
                                   <img
                                        src="/assets/videocall.svg"
                                        height="50"
                                        className="rounded-circle  ml-2"
                                        alt="avatar"
                                   />
                                   <img
                                        src="/assets/phonecall.svg"
                                        height="50"
                                        className="rounded-circle ml-2"
                                        alt="avatar"
                                   />
                                   <img
                                        src="/assets/message.svg"
                                        height="50"
                                        className="rounded-circle ml-2"
                                        alt="avatar"
                                   />
                                   <img
                                        src="/assets/share.svg"
                                        height="50"
                                        className="rounded-circle ml-2 mr-1"
                                        alt="avatar"
                                   />
                              </div>
                         </div>
                    </div>
               </div>
               <Card className="shadow-sm mt-3" border="light">
                    <Card.Body>
                         <Tabs defaultActiveKey="insights" id="uncontrolled-tab-example" className="mb-2">
                              <Tab eventKey="insights" title="Insights">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="scheduler" title="Scheduler">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="programs" title="Programs">
                                   <TabContent>
                                        <hr />
                                        <Programs />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="data" title="Data">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="teamwall" title="Team Wall">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="goal" title="Goals">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="Orders" title="Orders">
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

export default Client;
