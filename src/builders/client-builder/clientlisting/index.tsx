import { useMemo, useContext, useRef, useState } from "react";
import ActionButton from "../../../components/actionbutton/index";
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import AuthContext from "../../../context/auth-context";
import { useQuery } from "@apollo/client";
import { GET_CLIENT_NEW } from "./queries";
import CreateClient from "./addclientcomponent";
import Table from "../../../components/table";
import { flattenObj } from '../../../components/utils/responseFlatten';
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
               { accessor: "clientemail", Header: "Email" },
               { accessor: "clientphone", Header: "Phone" },
               { accessor: "clientlocation", Header: "Location" },
               {
                    Header: "No of Bookings",
                    accessor: "bookings",
                    Cell: (row: any) => {
                         return (
                              <>
                                   <p className="ml-5 pl-4">{row.value[0][row.value[1]]}</p>
                              </>
                         );
                    },
               },
               {
                    accessor: "status",
                    Header: "Status",
                    Cell: (v: any) => (
                         <Badge className="p-2" variant={v.value === "Assigned" ? "success" : "danger"}>
                              {v.value}
                         </Badge>
                    ),
               },
               // {
               //      id: "edit",
               //      Header: "Action",
               //      accessor: "action",
               //      Cell: ({ row }: any) => (
               //           <ActionButton
               //                action1="Go to client"
               //                actionClick1={() => {
               //                     handleRedirect(row.original.id);
               //                }}
               //                action2="Build Program"
               //                action3="Chat"
               //                action4="Build Package"
               //                action5="Remove Client"
               //                actionClick5={() => {
               //                     CreateClientComponent.current.TriggerForm({
               //                          id: row.original.id,
               //                          type: "delete",
               //                     });
               //                }}
               //           />
               //      ),
               // },
               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => {
                         const actionClick1 = () => {
                              handleRedirect(row.original.id);
                         };
                         const actionClick2 = () => {
                              //CreateClientComponent.current.TriggerForm({id: row.original.id, type: 'view'})
                         };
                         const actionClick3 = () => {
                              //CreateClientComponent.current.TriggerForm({ id: row.original.id, type: 'toggle-status', current_status: (row.original.status === "Active") })
                         };
                         const actionClick4 = () => {
                              //CreateClientComponent.current.TriggerForm({id: row.original.id, type: 'delete'})
                         };
                         const actionClick5 = () => {
                              CreateClientComponent.current.TriggerForm({
                                   id: row.original.id,
                                   type: "delete",
                              });
                         };

                         const arrayAction = [
                              { actionName: "Go to client", actionClick: actionClick1 },
                              { actionName: "Build Program", actionClick: actionClick2 },
                              { actionName: "Chat", actionClick: actionClick3 },
                              { actionName: "Build Package", actionClick: actionClick4 },
                              { actionName: "Remove Client", actionClick: actionClick5 },
                         ];

                         return <ActionButton arrayAction={arrayAction}></ActionButton>;
                    },
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

     // function FetchData(_variables: {} = { filter: " ", id: auth.userid }) {
     const fetch = useQuery(GET_CLIENT_NEW, { variables: { filter: searchFilter, id: auth.userid }, onCompleted: loadData });
     // }

     function refetchQueryCallback() {
          fetch.refetch();
     }

     function loadData(data: any) {
          let clientnamecount = {};
          let flag: any;
          let namearr: any = [];

          const flattenData = flattenObj({ ...data });

          setDataTable(
               [...flattenData.clientPackages].flatMap((Detail) => {
                    let clientname: any = Detail.users_permissions_user.username;
                    let clientemail: any = Detail.users_permissions_user.email;

                    if (!clientnamecount[clientname]) {
                         clientnamecount[clientname] = 1;
                    } else {
                         clientnamecount[clientname] += 1;
                    }
                    if (!namearr.includes(clientemail)) {
                         flag = true;
                         namearr.push(clientemail);
                    }
                    if (flag) {
                         flag = false;
                         return {
                              id: Detail.users_permissions_user.id,
                              clientpic: "/assets/avatar-1.jpg",
                              clientname: Detail.users_permissions_user.username,
                              clientemail: Detail.users_permissions_user.email,
                              clientphone: Detail.users_permissions_user.Phone,
                              clientlocation: Detail.users_permissions_user?.addresses[0]?.city,
                              bookings: [clientnamecount, Detail.users_permissions_user.username],
                              status: "Assigned",
                         };
                    } else {
                         return [];
                    }
               })
          );
     }

     // FetchData({ filter: searchFilter, id: auth.userid });
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
                                   <CreateClient ref={CreateClientComponent} callback={refetchQueryCallback}></CreateClient>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={datatable} />
          </TabContent>
     );
}

export default ClientListingPage;
