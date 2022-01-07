import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { Badge } from "react-bootstrap";
import ClientTable from "../../../../../components/table/client-table";
import { GET_CLIENT_DATA } from "../../queries";
import AuthContext from "../../../../../context/auth-context";

function Movement() {
     const last = window.location.pathname.split("/").pop();
     //console.log(last);
     const auth = useContext(AuthContext);
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
     function compareDates(time: any) {
          var date = new Date(time);
          var currentdate = new Date();
          if (date.getTime() < currentdate.getTime()) {
               return true;
          }
          return false;
     }
     const columns = useMemo<any>(
          () => [
               {
                    Header: "Package",
                    columns: [
                         {
                              Header: "Type",
                              accessor: "packagetype",
                              Cell: (row: any) => {
                                   return (
                                        <>
                                             {row.value === "Personal Training" ? (
                                                  <img src="/assets/PTtype.svg" alt="PT" />
                                             ) : (
                                                  ""
                                             )}
                                             {row.value === "Group Class" ? (
                                                  <img src="/assets/Grouptype.svg" alt="Group" />
                                             ) : (
                                                  ""
                                             )}
                                             {row.value === "Custom Fitness" ? (
                                                  <img src="/assets/Customtype.svg" alt="Custom" />
                                             ) : (
                                                  ""
                                             )}
                                             {row.value === "Classic Class" ? (
                                                  <img src="/assets/Classictype.svg" alt="Classic" />
                                             ) : (
                                                  ""
                                             )}
                                        </>
                                   );
                              },
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
                                   <Badge className="p-2" variant={v.value === "Assigned" ? "success" : "danger"}>
                                        {v.value}
                                   </Badge>
                              ),
                         },
                         // {
                         //      id: "edit",
                         //      Header: "Action",
                         //      accessor: "action",
                         //      Cell: ({ row }: any) => <ActionButton action1="Manage" actionClick1={() => {}} />,
                         // },
                         {
                              id: "edit",
                              Header: "Actions",
                              Cell: ({ row }: any) => {
                                   const actionClick1 = () => {
                                        //handleRedirect(row.original.id);
                                   };
                                   const arrayAction = [{ actionName: "Manage", actionClick: actionClick1 }];

                                   return <ActionButton arrayAction={arrayAction}></ActionButton>;
                              },
                         },
                    ],
               },
          ],
          []
     );

     const [dataActivetable, setActiveDataTable] = useState<{}[]>([]);
     const [dataHistorytable, setHistoryDataTable] = useState<{}[]>([]);

     function FetchData(_variables: {} = { id: auth.userid, clientid: last }) {
          useQuery(GET_CLIENT_DATA, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setHistoryDataTable(
               [...data.userPackages].flatMap((Detail) =>
                    compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                id: Detail.users_permissions_user.id,
                                packagetype: Detail.fitnesspackages[0].fitness_package_type.type,
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                packagedate: getDate(Date.parse(Detail.effective_date)),
                                packagerenewdate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                programname: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnessprograms[0].title
                                     : "N/A",
                                programrenewal: Detail.program_managers[0]
                                     ? getRenewalDate(Detail.effective_date, Detail.package_duration)
                                     : "N/A",
                                programstatus: Detail.program_managers[0] ? "Assigned" : "Not Assigned",
                           }
                         : []
               )
          );
          setActiveDataTable(
               [...data.userPackages].flatMap((Detail) =>
                    !compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                id: Detail.fitnesspackages[0].users_permissions_user.id,
                                packagetype: Detail.fitnesspackages[0].fitness_package_type.type,
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                packagedate: getDate(Date.parse(Detail.effective_date)),
                                packagerenewdate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                programname: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnessprograms[0].title
                                     : "N/A",
                                programrenewal: Detail.program_managers[0]
                                     ? getRenewalDate(Detail.effective_date, Detail.package_duration)
                                     : "N/A",
                                programstatus: Detail.program_managers[0] ? "Assigned" : "Not Assigned",
                           }
                         : []
               )
          );
     }

     FetchData({ id: auth.userid, clientid: last });
     return (
          <div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">Active</h5>
                    </div>
                    <ClientTable columns={columns} data={dataActivetable} />
               </div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                    </div>
                    <ClientTable columns={columns} data={dataHistorytable} />
               </div>
          </div>
     );
}

export default Movement;
