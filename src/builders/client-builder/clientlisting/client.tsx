import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import Programs from "./clienthome/ProgramScreens/clientprograms";
import Goals from "./clienthome/Goalscreen/clientGoals";
import Orders from "./clienthome/OrderScreen/clientOrders";
import Wall from "./clienthome/TeamWallScreen/index";
import Data from "./clienthome/DataScreen/ClientData";
import ClientSchedular from './clienthome/SchedularScreen'
import { useQuery } from "@apollo/client";
import { GET_CLIENT_DATA_NEW } from "./queries";
import { useState, useContext } from "react";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";

function Client() {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);
     const [clientName, setClientName] = useState<any>(" ");
     const [clientSex, setClientSex] = useState<any>(" ");
     function handleRedirect() {
          window.location.href = `/clients`;
     }
     function FetchData(_variables: {} = { id: auth.userid, clientid: last }) {
          useQuery(GET_CLIENT_DATA_NEW, { variables: _variables, onCompleted: loadData });
     }
     function loadData(data: any) {
          const flattenData = flattenObj({...data});
          [...flattenData.clientPackages].map((Detail) => {
               setClientName(Detail.users_permissions_user?.username);
               setClientSex(Detail.users_permissions_user?.Gender);
               return {};
          });
     }
     FetchData({ id: auth.userid, clientid: last });
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
                                   <h2 className="ml-2">{clientName}</h2>
                                   <p className="ml-2 mt-3 text-muted">{clientSex} </p>
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
                         <Tabs defaultActiveKey="scheduler" id="uncontrolled-tab-example" className="mb-2">
                              <Tab eventKey="insights" title="Insights">
                                   <TabContent>
                                        <hr />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="scheduler" title="Scheduler">
                                   <TabContent className="mr-5">
                                        <hr />
                                        <ClientSchedular />
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
                                        <Data />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="teamwall" title="Team Wall">
                                   <TabContent>
                                        <hr />
                                        <Wall />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="goal" title="Goals">
                                   <TabContent>
                                        <hr />
                                        <Goals />
                                   </TabContent>
                              </Tab>
                              <Tab eventKey="Orders" title="Bookings">
                                   <TabContent>
                                        <hr />
                                        <Orders />
                                   </TabContent>
                              </Tab>
                         </Tabs>
                    </Card.Body>
               </Card>
          </div>
     );
}

export default Client;
