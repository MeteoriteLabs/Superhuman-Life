//import { Accordion, Card } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo } from "react";
import { Badge } from "react-bootstrap";
import ClientTable from "../../../../../components/table/client-table";

function Movement() {
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
                    Header: "Package",
                    columns: [
                         {
                              Header: "Type",
                              accessor: "packagetype",
                              Cell: (v: any) => (
                                   <img src={v.value} height="42" className="rounded-circle" alt="avatar" />
                              ),
                         },
                         {
                              Header: "Name",
                              accessor: "packagename",
                         },
                         {
                              Header: "Effective Date",
                              accessor: "packagedate",
                         },
                         {
                              Header: "Renewal Date",
                              accessor: "packagerenewdate",
                         },
                    ],
               },
               {
                    Header: "Program",
                    columns: [
                         {
                              Header: "Name",
                              accessor: "programname",
                         },
                         {
                              Header: "Renewal",
                              accessor: "programrenewal",
                         },
                         {
                              Header: "Status",
                              accessor: "packagestatus",
                              Cell: (v: any) => (
                                   <Badge variant={v.value === "Assigned" ? "success" : "danger"}>{v.value}</Badge>
                              ),
                         },
                         {
                              id: "edit",
                              Header: "Action",
                              accessor: "action",
                              Cell: ({ row }: any) => <ActionButton action1="Manage" actionClick1={() => {}} />,
                         },
                    ],
               },
          ],
          []
     );

     const data = [
          {
               packagetype: "/assets/avatar-1.jpg",
               packagename: "Package Name",
               packagedate: "25/06/20",
               packagerenewdate: "05/07/20",
               programname: "Group Program",
               programrenewal: "25/07/20",
               packagestatus: "Assigned",
          },
     ];
     return (
          <div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">Active</h5>
                    </div>
                    <ClientTable columns={columns} data={data} />
               </div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                    </div>
                    <ClientTable columns={columns} data={data} />
               </div>
          </div>
     );
}

export default Movement;
