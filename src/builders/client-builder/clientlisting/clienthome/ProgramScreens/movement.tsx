import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Badge } from "react-bootstrap";
import ClientTable from "../../../../../components/table/client-table";
import { GET_CLIENT_DATA } from "../../queries";

function Movement() {
     const last = window.location.pathname.split("/").pop();
     console.log(last);
     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}/${month}/${year}`;
     }
     function getRenewalDate(time: any, duration: any) {
          var date = new Date(time);
          date.setDate(date.getDate() + duration);
          return getDate(date);
     }

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
                              accessor: "programstatus",
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

     const [datatable, setDataTable] = useState<{}[]>([]);

     function FetchData(_variables: {} = { id: last }) {
          useQuery(GET_CLIENT_DATA, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setDataTable(
               [...data.userPackages].map((Detail) => {
                    return {
                         id: Detail.id,
                         packagetype: "/assets/avatar-1.jpg",
                         packagename: Detail.program_managers[0]
                              ? Detail.program_managers[0].fitnesspackages[0].packagename
                              : Detail.fitnesspackages[0].packagename,
                         packagedate: getDate(Date.parse(Detail.effective_date)),
                         packagerenewdate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                         programname: Detail.program_managers[0]
                              ? Detail.program_managers[0].fitnessprograms[0].title
                              : "N/A",
                         programrenewal: Detail.program_managers[0] ? "2/04/22" : "N/A",
                         programstatus: Detail.program_managers[0] ? "Assigned" : "Not Assigned",
                    };
               })
          );
     }

     FetchData({ id: last });
     return (
          <div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">Active</h5>
                    </div>
                    <ClientTable columns={columns} data={datatable} />
               </div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                    </div>
                    <ClientTable columns={columns} data={datatable} />
               </div>
          </div>
     );
}

export default Movement;
