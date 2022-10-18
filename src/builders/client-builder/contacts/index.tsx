import { useMemo, useState, useRef, useContext, useEffect } from "react";
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
import CreateEditContact from "./createEditContact";
import { GET_CONTACTS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { useHistory } from "react-router-dom";

export default function Contacts() {
     const auth = useContext(AuthContext);
     const [searchFilter, setSearchFilter] = useState<any>(null);
     const [data, setData] = useState<any>([]);
     const [nameArr, setNameArr] = useState<any>([]);
     const searchInput = useRef<any>();
     const createEditContactComponent = useRef<any>(null);

     const columns = useMemo<any>(
          () => [
               { accessor: "contactsdate", Header: "Contacts Date" },
               { accessor: "name", Header: "Name" },
               { accessor: "number", Header: "Number" },
               { accessor: "email", Header: "Email" },
               { accessor: "type", Header: "Type" },
               {
                    accessor: "appStatus", Header: "App Status", Cell: ({ row }: any) => {
                         let statusColor = ""
                         switch (row.values.appStatus) {
                              case "Invited":
                                   statusColor = "success";
                                   break;

                              case "NotInvited":
                                   statusColor = "danger";
                                   break;

                         }
                         return <>
                              <Badge className='px-3 py-1' style={{ fontSize: '1rem', borderRadius: '10px' }} variant={statusColor}>{row.values.appStatus === "NotInvited" ? "Not Invited" : "Invited"}</Badge>
                         </>
                    }
               },
               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => {
                         const editHandler = () => {
                              createEditContactComponent.current.TriggerForm({
                                   id: row.original.id,
                                   type: "edit",
                              });
                         };
                         const viewHandler = () => {
                              createEditContactComponent.current.TriggerForm({
                                   id: row.original.id,
                                   type: "view",
                              });
                         };
                         const deleteHandler = () => {
                              createEditContactComponent.current.TriggerForm({
                                   id: row.original.id,
                                   type: "delete",
                              });
                         };

                         const history = useHistory();
                         const routeChange = () =>{ 
                              let path = `payment_settings/?id=${row.original.id}`; 
                              history.push(path);
                            }

                         const arrayAction = [
                              { actionName: "Edit", actionClick: editHandler },
                              { actionName: "View", actionClick: viewHandler },
                              { actionName: "Delete", actionClick: deleteHandler },
                              { actionName: "Payment Settings", actionClick: routeChange },
                         ];

                         return <ActionButton arrayAction={arrayAction}></ActionButton>;
                    },
               },
          ],
          // eslint-disable-next-line react-hooks/exhaustive-deps
          []
     );

     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}/${month}/${year}`;
     }

     const [datatable, setDataTable] = useState<{}[]>([]);

     const fetch = useQuery(GET_CONTACTS, { onCompleted: loadData });

     function refetchQueryCallback() {
          fetch.refetch();
     }

     function loadData(data: any) {
          let namearr: any = [];
          const flattenData = flattenObj({ ...data });

          setData([...flattenData.contacts]);
          setDataTable(
               [...flattenData.contacts].flatMap((Detail) => {

                    return {
                         id: Detail.id,
                         contactsdate: getDate(Date.parse(Detail.createdAt)),
                         name: Detail.firstname + " " + Detail.lastname,
                         number: Detail.phone,
                         email: Detail.email,
                         type: Detail.type,
                         appStatus: Detail.appDownloadStatus
                    };
               })
          );
          setNameArr(namearr);
     }
     //  useEffect(() => {
     //       if (searchFilter) {
     //            setDataTable(
     //                 data.flatMap((Detail: any) => {
     //                      if (
     //                           (nameArr.includes(searchFilter) &&
     //                                Detail.Details?.leadsdetails?.name.toLowerCase() === searchFilter.toLowerCase()) ||
     //                           (nameArr.includes(searchFilter) &&
     //                                Detail.Details?.status.toLowerCase() === searchFilter.toLowerCase())
     //                      ) {
     //                           return {
     //                                id: Detail.id,
     //                                leadsdate: getDate(Date.parse(Detail.createdAt)),
     //                                name: Detail.Details?.leadsdetails.name,
     //                                number: Detail.Details?.leadsdetails.phonenumber,
     //                                email: Detail.Details?.leadsdetails.email,
     //                                source: Detail.Details.source,
     //                                status: Detail.Details.status,
     //                                lastupdated: getDate(Date.parse(Detail.updatedAt)),
     //                           };
     //                      } else {
     //                           return [];
     //                      }
     //                 })
     //            );
     //       }
     //       if (searchFilter === "") {
     //            setDataTable(
     //                 data.flatMap((Detail: any) => {
     //                      return {
     //                           id: Detail.id,
     //                           leadsdate: getDate(Date.parse(Detail.createdAt)),
     //                           name: Detail.Details?.leadsdetails?.name,
     //                           number: Detail.Details?.leadsdetails?.phonenumber,
     //                           email: Detail.Details?.leadsdetails?.email,
     //                           source: Detail.Details.source,
     //                           status: Detail.Details.status,
     //                           lastupdated: getDate(Date.parse(Detail.updatedAt)),
     //                      };
     //                 })
     //            );
     //       }
     //  }, [searchFilter, data, nameArr]);


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
                                             createEditContactComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                                  modal_status: true,
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> Add Contact
                                   </Button>

                                   <CreateEditContact ref={createEditContactComponent} callback={refetchQueryCallback}></CreateEditContact>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={datatable} />
          </TabContent>
     );
}

