import { useMemo, useContext, useRef, useState } from "react";
import ActionButton from "../../../components/actionbutton/index";
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import AuthContext from "../../../context/auth-context";
import { useQuery } from "@apollo/client";
import { GET_CLIENTS } from "./queries";
import CreateClient from "./addclientcomponent";
import Table from "../../../components/table";
//import client from "./client";

function ClientListingPage() {
     const auth = useContext(AuthContext);
     const [searchFilter, setSearchFilter] = useState("");
     const searchInput = useRef<any>();
     const CreateClientComponent = useRef<any>(null);

     function handleRedirect(id: any) {
          window.location.href = `/client/home/${id}`;
     }

     const columns = useMemo<any>(
          () => [
               {
                    Header: "",
                    accessor: "clientpic",
                    Cell: (v: any) => <img src={v.value} height="42" className="rounded-circle" alt="avatar" />,
               },
               { accessor: "clientname", Header: "Name" },
               { accessor: "clientdetails", Header: "Details" },
               { accessor: "clientlocation", Header: "Location" },
               {
                    Header: "No of Bookings",
                    accessor: "bookings",
               },
               {
                    accessor: "status",
                    Header: "Status",
                    Cell: (v: any) => <Badge variant={v.value === "Assigned" ? "success" : "danger"}>{v.value}</Badge>,
               },
               {
                    id: "edit",
                    Header: "Action",
                    accessor: "action",
                    Cell: ({ row }: any) => (
                         <ActionButton
                              action1="Go to client"
                              actionClick1={() => {
                                   handleRedirect(row.original.id);
                              }}
                              action2="Build Program"
                              action3="Chat"
                              action4="Build Package"
                              action5="Remove Client"
                              actionClick5={() => {
                                   CreateClientComponent.current.TriggerForm({
                                        id: row.original.id,
                                        type: "delete",
                                   });
                              }}
                         />
                    ),
               },
          ],
          []
     );

     // function getDate(time: any) {
     //      let dateObj = new Date(time);
     //      let month = dateObj.getMonth() + 1;
     //      let year = dateObj.getFullYear();
     //      let date = dateObj.getDate();

     //      return `${date}/${month}/${year}`;
     // }
     // function getRenewalDate(time: any, duration: any) {
     //      var date = new Date(time);
     //      date.setDate(date.getDate() + duration);
     //      return getDate(date);
     // }

     const [datatable, setDataTable] = useState<{}[]>([]);

     function FetchData(_variables: {} = { filter: " ", id: auth.userid }) {
          useQuery(GET_CLIENTS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setDataTable(
               [...data.userPackages].map((Detail) => {
                    return {
                         id: Detail.fitnesspackages[0].users_permissions_user.id,
                         clientpic: "/assets/avatar-1.jpg",
                         clientname: Detail.users_permissions_user.username,
                         clientdetails: Detail.users_permissions_user.email,
                         clientlocation: Detail.users_permissions_user.addresses[0].city,
                         bookings: "2",
                         status: "Assigned",
                    };
               })
          );
     }

     FetchData({ filter: searchFilter, id: auth.userid });
     return (
          <TabContent>
               <Container>
                    <Row>
                         <Col>
                              <InputGroup className="mb-3">
                                   <FormControl
                                        aria-describedby="basic-addon1"
                                        placeholder="Search"
                                        ref={searchInput}
                                   />
                                   <InputGroup.Prepend>
                                        <Button
                                             variant="outline-secondary"
                                             onClick={(e: any) => {
                                                  e.preventDefault();
                                                  setSearchFilter(searchInput.current.value);
                                             }}
                                        >
                                             <i className="fas fa-search"></i>
                                        </Button>
                                   </InputGroup.Prepend>
                              </InputGroup>
                         </Col>
                         <Col>
                              <Card.Title className="text-center">
                                   <Button
                                        variant={true ? "outline-secondary" : "light"}
                                        size="sm"
                                        onClick={() => {
                                             CreateClientComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                                  modal_status: true,
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> Add Client
                                   </Button>
                                   <CreateClient ref={CreateClientComponent}></CreateClient>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={datatable} />
          </TabContent>
     );
}

export default ClientListingPage;
