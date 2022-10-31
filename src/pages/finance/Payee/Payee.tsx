// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { Button } from 'react-bootstrap';


// function Payee() {
//     const history = useHistory();

//     const routeChange = () => {
//         let path = `add_payee`;
//         history.push(path);
//     }
//   return (
//     <div>
//         <Button variant="outline-dark" className='m-1' onClick={routeChange}><i className="fas fa-plus-circle"></i>  Add Payee</Button>
//     </div>
//   )
// }

// export default Payee;

import { useMemo, useState, useRef } from "react";
import { Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import Table from "../../../components/table";
// import { useQuery } from "@apollo/client";
// import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
// import CreateEditMessage from "./createoredit-message";
// import { GET_NOTIFICATIONS } from "./queries";
// import { flattenObj } from "../../../components/utils/responseFlatten";
import CreateEditPayee from './CreateEditPayee';

export default function Payee() {
     // const auth = useContext(AuthContext);
     // const [searchFilter, setSearchFilter] = useState("");
     const searchInput = useRef<any>();
     const createEditPayeeComponent = useRef<any>(null);

     const columns = useMemo<any>(
          () => [
               { accessor: "id", Header: "ID" },
               { accessor: "payee", Header: "Payee" },
               { accessor: "type", Header: "Type" },
               {
                    accessor: "toward",
                    Header: "Toward",
                    Cell: "Salary",
               },
               { accessor: "frequency", Header: "Frequency" },
               { accessor: "active", Header: "Active" },
               { accessor: "addedon", Header: "Added On" },
               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => {
                         const editAction = () => {
                              createEditPayeeComponent.current.TriggerForm({ id: row.original.id, type: "edit" });
                         };
                         const viewAction = () => {
                              createEditPayeeComponent.current.TriggerForm({ id: row.original.id, type: "view" });
                         };
                         const pauseAction = () => {
                              createEditPayeeComponent.current.TriggerForm({
                                   id: row.original.id,
                                   type: "pause",
                                   
                              });
                         };
                         const closeAccountAction = () => {
                              createEditPayeeComponent.current.TriggerForm({ id: row.original.id, type: "close account" });
                         };
                         const allTransactionsAction = () => {
                              createEditPayeeComponent.current.TriggerForm({ id: row.original.id, type: "all transactions" });
                         };

                         const arrayAction = [
                              { actionName: "Edit", actionClick: editAction },
                              { actionName: "View", actionClick: viewAction },
                              { actionName: "Pause", actionClick: pauseAction },
                              { actionName: "Close", actionClick: closeAccountAction },
                              { actionName: "All transactions", actionClick: allTransactionsAction }
                         ];

                         return <ActionButton arrayAction={arrayAction}></ActionButton>;
                    },
               },
          ],
          []
     );

     
     const [datatable, setDataTable] = useState<{}[]>([]);

     // setDataTable([
     //      {
     //           id: 123,
     //           payee: 'Nikita',
     //           type: 'Individual',
     //           toward: 'Salary',
     //           frequency: 'Monthly',
     //           active: 'Active',
     //           addedon: '23-09-2022'
     //      }
     // ])
    //  const fetch = useQuery(GET_NOTIFICATIONS, { variables: { filter: searchFilter, id: auth.userid }, onCompleted: loadData });

     // function loadData(data: any) {
     //      const flattenData = flattenObj({ ...data });
     //      setDataTable(
     //           [...flattenData.notifications].map((Detail) => {
     //                return {
     //                     id: Detail.id,
     //                     title: Detail.title,
     //                     trigger: Detail.prerecordedtrigger.name,
     //                     minidesc: Detail.minidescription,
     //                     status: Detail.status ? "Active" : "Inactive",
     //                     updatedon: getDate(Date.parse(Detail.updatedAt)),
     //                };
     //           })
     //      );
     // }

    //  function refetchQueryCallback() {
    //       fetch.refetch();
    //  }

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
                                                  // setSearchFilter(searchInput.current.value);
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
                                             createEditPayeeComponent.current.TriggerForm({
                                                  // id: null,
                                                  type: "create",
                                                  modal_status: true,
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> Add Payee
                                   </Button>
                                   <CreateEditPayee ref={createEditPayeeComponent} ></CreateEditPayee>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={datatable} />
          </TabContent>
     );
}

