import { Accordion, Card } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo } from "react";
import { Badge } from "react-bootstrap";
import Table from "../../../../../components/table";

function Nutrition() {
     //  function getDate(time: any) {
     //       let dateObj = new Date(time);
     //       let month = dateObj.getMonth() + 1;
     //       let year = dateObj.getFullYear();
     //       let date = dateObj.getDate();

     //       return `${date}/${month}/${year}`;
     //  }
     //  function getRenewalDate(time: any, duration: any) {
     //       var date = new Date(time);
     //       date.setDate(date.getDate() + duration);
     //       return getDate(date);
     //  }

     const columns = useMemo<any>(
          () => [
               {
                    Header: "Type",
                    accessor: "type",
                    Cell: (v: any) => <img src={v.value} height="42" className="rounded-circle" alt="avatar" />,
               },
               { accessor: "name", Header: "Name" },
               { accessor: "startdate", Header: "Start Date" },
               { accessor: "renewaldate", Header: "Renewal Date" },
               {
                    Header: "Details",
                    accessor: "details",
                    Cell: (v: any) => <img src={v.value} height="42" className="rounded-circle" alt="avatar" />,
               },
               { accessor: "poc", Header: "POC" },
               { accessor: "renewal", Header: "Renewal" },

               {
                    accessor: "status",
                    Header: "Status",
                    Cell: (v: any) => <Badge variant={v.value === "Assigned" ? "success" : "danger"}>{v.value}</Badge>,
               },
               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => <ActionButton action1="Edit" actionClick1={() => {}} />,
               },
          ],
          []
     );

     const data = [
          {
               type: "/assets/avatar-1.jpg",
               name: "Package Name",
               startdate: "25/06/20",
               renewaldate: "05/07/20",
               details: "",
               poc: "Group Program",
               renewal: "25/07/20",
               status: "Assigned",
          },
     ];
     return (
          <div>
               <Accordion defaultActiveKey="0">
                    <Card>
                         <Accordion.Toggle as={Card.Header} eventKey="0">
                              <h5>Active</h5>
                         </Accordion.Toggle>

                         <Accordion.Collapse eventKey="0">
                              <Card.Body>
                                   <Table columns={columns} data={data} />
                              </Card.Body>
                         </Accordion.Collapse>
                    </Card>

                    <Card>
                         <Accordion.Toggle as={Card.Header} eventKey="1">
                              <h5>History</h5>
                         </Accordion.Toggle>

                         <Accordion.Collapse eventKey="1">
                              <Card.Body>
                                   <Table columns={columns} data={data} />
                              </Card.Body>
                         </Accordion.Collapse>
                    </Card>
               </Accordion>
          </div>
     );
}

export default Nutrition;
