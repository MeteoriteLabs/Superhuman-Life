import { useMemo, useState, useRef, useContext, useEffect } from "react";
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import { useQuery } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
import CreateEditMessage from "./createoredit-leads";
import { GET_LEADS } from "./queries";

export default function Leads() {
     const auth = useContext(AuthContext);
     const [searchFilter, setSearchFilter] = useState<any>(null);
     const [data, setData] = useState<any>([]);
     const [nameArr, setNameArr] = useState<any>([]);
     const searchInput = useRef<any>();
     const createEditMessageComponent = useRef<any>(null);

     const columns = useMemo<any>(
          () => [
               { accessor: "leadsdate", Header: "Leads Date" },
               { accessor: "name", Header: "Name" },
               { accessor: "number", Header: "Number" },
               { accessor: "email", Header: "Email" },
               { accessor: "isseen" },
               {
                    accessor: "source",
                    Header: "Source",
                    Cell: (v: any) => (
                         <Badge className="p-2" variant="light">
                              {v.value}
                         </Badge>
                    ),
               },
               { accessor: "lastupdated", Header: "Last Updated" },
               {
                    accessor: "status",
                    Header: "Status",
                    Cell: (v: any) => (
                         <Badge className="p-2" variant="light">
                              {v.value}
                         </Badge>
                    ),
               },

               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => (
                         <ActionButton
                              action1="Edit"
                              actionClick1={() => {
                                   createEditMessageComponent.current.TriggerForm({
                                        id: row.original.id,
                                        type: "edit",
                                   });
                              }}
                              action2="View"
                              actionClick2={() => {
                                   createEditMessageComponent.current.TriggerForm({
                                        id: row.original.id,
                                        type: "view",
                                   });
                              }}
                              action3="Delete"
                              actionClick3={() => {
                                   createEditMessageComponent.current.TriggerForm({
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

     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}/${month}/${year}`;
     }

     const [datatable, setDataTable] = useState<{}[]>([]);

     function FetchData(_variables: {} = { id: auth.userid }) {
          useQuery(GET_LEADS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          let namearr: any = [];
          setData([...data.websiteContactForms]);
          setDataTable(
               [...data.websiteContactForms].flatMap((Detail) => {
                    if (!namearr.includes(Detail.details.leadsdetails.name)) {
                         namearr.push(Detail.details.leadsdetails.name);
                         namearr.push(Detail.details.leadsdetails.name.toLowerCase());
                    }
                    if (!namearr.includes(Detail.details.status)) {
                         namearr.push(Detail.details.status.toLowerCase());
                    }

                    return {
                         id: Detail.id,
                         leadsdate: getDate(Date.parse(Detail.createdAt)),
                         name: Detail.details.leadsdetails.name,
                         number: Detail.details.leadsdetails.phonenumber,
                         email: Detail.details.leadsdetails.email,
                         source: Detail.details.source,
                         status: Detail.details.status,
                         isseen: Detail.isSeen,
                         lastupdated: getDate(Date.parse(Detail.updatedAt)),
                    };
               })
          );
          setNameArr(namearr);
     }
     useEffect(() => {
          if (searchFilter) {
               console.log("changed");
               //    console.log(searchFilter);
               setDataTable(
                    data.flatMap((Detail: any) => {
                         //  console.log(Detail.details.username.toLowerCase());
                         //  console.log(searchFilter.toLowerCase());
                         console.log(nameArr);
                         if (
                              (nameArr.includes(searchFilter) &&
                                   Detail.details.leadsdetails.name.toLowerCase() === searchFilter.toLowerCase()) ||
                              (nameArr.includes(searchFilter) &&
                                   Detail.details.status.toLowerCase() === searchFilter.toLowerCase())
                         ) {
                              return {
                                   id: Detail.id,
                                   leadsdate: getDate(Date.parse(Detail.createdAt)),
                                   name: Detail.details.leadsdetails.name,
                                   number: Detail.details.leadsdetails.phonenumber,
                                   email: Detail.details.leadsdetails.email,
                                   source: Detail.details.source,
                                   status: Detail.details.status,
                                   lastupdated: getDate(Date.parse(Detail.updatedAt)),
                              };
                         } else {
                              return [];
                         }
                    })
               );
          }
          if (searchFilter === "") {
               setDataTable(
                    data.flatMap((Detail: any) => {
                         return {
                              id: Detail.id,
                              leadsdate: getDate(Date.parse(Detail.createdAt)),
                              name: Detail.details.leadsdetails.name,
                              number: Detail.details.leadsdetails.phonenumber,
                              email: Detail.details.leadsdetails.email,
                              source: Detail.details.source,
                              status: Detail.details.status,
                              lastupdated: getDate(Date.parse(Detail.updatedAt)),
                         };
                    })
               );
          }
     }, [searchFilter, data, nameArr]);

     FetchData({ id: auth.userid });
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
                                             createEditMessageComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                                  modal_status: true,
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> Add Lead
                                   </Button>
                                   <CreateEditMessage ref={createEditMessageComponent}></CreateEditMessage>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={datatable} />
          </TabContent>
     );
}
