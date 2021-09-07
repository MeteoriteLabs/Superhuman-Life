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
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">Active</h5>
                    </div>
                    <Table columns={columns} data={data} />
               </div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                    </div>
                    <Table columns={columns} data={data} />
               </div>
          </div>
     );
}

export default Nutrition;
