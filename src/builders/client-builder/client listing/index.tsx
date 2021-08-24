import React from "react";
import { useMemo } from "react";
import ActionButton from "../../../components/actionbutton/index";
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col } from "react-bootstrap";
import Table from "../../../components/client-table";

function ClientListingPage() {
     const columns = useMemo<any>(
          () => [
               {
                    Header: "Client",
                    columns: [
                         {
                              Header: "",
                              accessor: "clientpic",
                              Cell: (v: any) => (
                                   <img src={v.value} height="42" className="rounded-circle" alt="avatar" />
                              ),
                         },
                         {
                              Header: "Name",
                              accessor: "clientname",
                         },
                         {
                              Header: "Details",
                              accessor: "clientdetails",
                         },
                         {
                              Header: "Location",
                              accessor: "clientlocation",
                         },
                    ],
               },
               {
                    Header: "Package",
                    columns: [
                         {
                              Header: "Package Name",
                              accessor: "packagename",
                         },
                         {
                              Header: "Renewal",
                              accessor: "packagerenewal",
                         },
                         {
                              Header: "Status",
                              accessor: "packagestatus",
                              Cell: (v: any) => (
                                   <Badge variant={v.value === "Purchased" ? "success" : "danger"}>{v.value}</Badge>
                              ),
                         },
                    ],
               },
               {
                    Header: "Program",
                    columns: [
                         {
                              Header: "Status",
                              accessor: "programstatus",
                              Cell: (v: any) => (
                                   <Badge variant={v.value === "Assigned" ? "success" : "danger"}>{v.value}</Badge>
                              ),
                         },
                         {
                              Header: "Renewal",
                              accessor: "programrenewal",
                         },
                         {
                              Header: "Action",
                              accessor: "action",
                              Cell: ({ row }: any) => (
                                   <ActionButton
                                        action1="Go to client"
                                        action2="Build Program"
                                        action3="Chat"
                                        action4="Build Package"
                                        action5="Remove Client"
                                   />
                              ),
                         },
                    ],
               },
          ],
          []
     );
     const data = [
          {
               clientpic: "/assets/avatar-1.jpg",
               clientname: "Name",
               clientdetails: " +91 9013829110 dummy@gmail.com ",
               clientlocation: "Delhi",
               packagename: " Package Name",
               packagerenewal: "2.03.2022",
               packagestatus: "Purchased",
               programstatus: "Not Assigned",
               programrenewal: "2.03.2022",
          },
     ];

     return (
          <TabContent>
               <Container>
                    <Row>
                         <Col>
                              <InputGroup className="mb-3">
                                   <FormControl aria-describedby="basic-addon1" placeholder="Search" />
                                   <InputGroup.Prepend>
                                        <Button variant="outline-secondary" onClick={() => {}}>
                                             <i className="fas fa-search"></i>
                                        </Button>
                                   </InputGroup.Prepend>
                              </InputGroup>
                         </Col>
                         <Col>
                              <Card.Title className="text-center">
                                   <Button variant={true ? "outline-secondary" : "light"} size="sm" onClick={() => {}}>
                                        <i className="fas fa-plus-circle"></i> Add Client
                                   </Button>
                              </Card.Title>
                         </Col>
                    </Row>
               </Container>
               <Table columns={columns} data={data} />
          </TabContent>
     );
}

export default ClientListingPage;
