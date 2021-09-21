import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo, useContext, useState, useRef } from "react";
import { Badge } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import Table from "../../../../../components/table";
import { Row, Button } from "react-bootstrap";
import AuthContext from "../../../../../context/auth-context";
import { GET_BOOKINGS } from "./queries";
import CreateSuggestion from "./addSuggestion";

function Movement() {
     const CreateSuggestionComponent = useRef<any>(null);
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
     const auth = useContext(AuthContext);

     const columns = useMemo<any>(
          () => [
               { accessor: "packagename", Header: "Package Name" },
               {
                    Header: "Type",
                    accessor: "type",
                    Cell: (v: any) => <img src={v.value} height="42" className="rounded-circle" alt="avatar" />,
               },
               {
                    Header: "Details",
                    accessor: "details",
                    Cell: (v: any) => <img src={v.value} height="42" className="rounded-circle" alt="avatar" />,
               },
               { accessor: "duration", Header: "Duration" },

               { accessor: "effectivedate", Header: "Effective Date" },
               { accessor: "enddate", Header: "End Date" },

               { accessor: "cost", Header: "Cost" },

               {
                    accessor: "payment",
                    Header: "Payment",
                    Cell: (v: any) => (
                         <Badge className="p-2" variant={v.value === "Paid" ? "success" : "danger"}>
                              {v.value}
                         </Badge>
                    ),
               },
               {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => (
                         <ActionButton action1="View Invoice" action2="Renew Package" actionClick1={() => {}} />
                    ),
               },
          ],
          []
     );

     const [dataActivetable, setActiveDataTable] = useState<{}[]>([]);
     const [dataHistorytable, setHistoryDataTable] = useState<{}[]>([]);

     function FetchData(_variables: {} = { id: auth.userid }) {
          useQuery(GET_BOOKINGS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setHistoryDataTable(
               [...data.clientBookings].flatMap((Detail) =>
                    compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                type: "/assets/avatar-1.jpg",
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                details: "",
                                duration: Detail.package_duration,
                                effectivedate: getDate(Date.parse(Detail.effective_date)),
                                enddate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                cost: "",
                                payment: Detail.booking_status ? "Paid" : "Pending",
                           }
                         : []
               )
          );
          setActiveDataTable(
               [...data.clientBookings].flatMap((Detail) =>
                    !compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                type: "/assets/avatar-1.jpg",
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                details: "",
                                duration: Detail.package_duration,
                                effectivedate: getDate(Date.parse(Detail.effective_date)),
                                enddate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                cost: "",
                                payment: Detail.booking_status ? "Paid" : "Pending",
                           }
                         : []
               )
          );
     }

     FetchData({ id: auth.userid });

     return (
          <div>
               <Row className="d-flex flex-row-reverse mr-4 ml-1">
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              <i className="fas fa-plus-circle"></i> PT
                         </Button>
                         {/* <CreateMovement ref={CreateMovementComponent}></CreateMovement> */}
                    </div>
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              <i className="fas fa-plus-circle"></i> Classic
                         </Button>
                         {/* <CreateMovement ref={CreateMovementComponent}></CreateMovement> */}
                    </div>
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              <i className="fas fa-plus-circle"></i> Custom
                         </Button>
                         {/* <CreateMovement ref={CreateMovementComponent}></CreateMovement> */}
                    </div>
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              <i className="fas fa-plus-circle"></i> Group
                         </Button>
                         {/* <CreateMovement ref={CreateMovementComponent}></CreateMovement> */}
                    </div>
                    <div className="m-1">
                         <Button
                              variant="btn btn-light"
                              size="sm"
                              onClick={() => {
                                   CreateSuggestionComponent.current.TriggerForm({
                                        id: null,
                                        type: "create",
                                   });
                              }}
                         >
                              Suggest Package
                         </Button>
                         <CreateSuggestion ref={CreateSuggestionComponent}></CreateSuggestion>
                    </div>
               </Row>
               <div className="mt-4">
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Fitness</h5>
                         </Row>
                    </div>
                    <Table columns={columns} data={dataActivetable} />
               </div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1">
                         <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                    </div>
                    <Table columns={columns} data={dataHistorytable} />
               </div>
          </div>
     );
}

export default Movement;
