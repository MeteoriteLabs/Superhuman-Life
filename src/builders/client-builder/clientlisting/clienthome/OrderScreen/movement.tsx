import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo, useContext, useState, useRef } from "react";
import { Badge } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import Table from "../../../../../components/table";
import { Row, Button, Col } from "react-bootstrap";
import AuthContext from "../../../../../context/auth-context";
import { GET_BOOKINGS } from "./queries";
import CreateSuggestion from "./addSuggestion";

function Movement() {
     const last = window.location.pathname.split("/").pop();
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
                    accessor: "packagetype",
                    Cell: (row: any) => {
                         return (
                              <>
                                   {row.value === "Personal Training" ? <img src="/assets/PTtype.svg" alt="PT" /> : ""}
                                   {row.value === "Group Class" ? <img src="/assets/Grouptype.svg" alt="Group" /> : ""}
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
                    Header: "Details",
                    accessor: "details",
                    Cell: (row: any) => {
                         return (
                              <Row>
                                   {row.value[0] ? (
                                        <div className="d-flex flex-row ">
                                             <Col>
                                                  <img src="/assets/PTonline.svg" alt="PT" />
                                                  <p className="ml-4">{row.value[0]}</p>
                                             </Col>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                                   {row.value[1] ? (
                                        <div className="d-flex flex-row ">
                                             <Col>
                                                  <img src="/assets/PToffline.svg" alt="PT" />
                                                  <p className="ml-4">{row.value[1]}</p>
                                             </Col>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                                   {row.value[2] ? (
                                        <div className="d-flex flex-row ">
                                             <Col>
                                                  <img src="/assets/Grouponline.svg" alt="PT" />
                                                  <p className="ml-4">{row.value[2]}</p>
                                             </Col>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                                   {row.value[3] ? (
                                        <div className="d-flex flex-row ">
                                             <Col>
                                                  <img src="/assets/Groupoffline.svg" alt="PT" />
                                                  <p className="ml-4">{row.value[3]}</p>
                                             </Col>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                                   {row.value[4] ? (
                                        <div className="d-flex flex-row ">
                                             <Col>
                                                  <img src="/assets/RecordedClass.svg" alt="PT" />
                                                  <p className="ml-4">{row.value[4]}</p>
                                             </Col>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                              </Row>
                         );
                    },
               },
               { accessor: "duration", Header: "Duration" },

               { accessor: "effectivedate", Header: "Effective Date" },
               { accessor: "enddate", Header: "End Date" },

               { accessor: "cost", Header: "Cost" },

               {
                    accessor: "bookingstatus",
                    Header: "Booking Status",
                    Cell: (row: any) => {
                         return (
                              <>
                                   {row.value === "accepted" ? (
                                        <Badge className="p-2" variant="success">
                                             {row.value}
                                        </Badge>
                                   ) : (
                                        ""
                                   )}
                                   {row.value === "rejected" ? (
                                        <Badge className="p-2" variant="danger">
                                             {row.value}
                                        </Badge>
                                   ) : (
                                        ""
                                   )}
                                   {row.value === "pending" ? (
                                        <Badge className="p-2" variant="warning">
                                             {row.value}
                                        </Badge>
                                   ) : (
                                        ""
                                   )}
                              </>
                         );
                    },
               },
               {
                    accessor: "payment",
                    Header: "Payment Status",
                    Cell: (v: any) => (
                         <Badge className="p-2" variant="success">
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

     function FetchData(_variables: {} = { id: auth.userid, clientid: last }) {
          useQuery(GET_BOOKINGS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setHistoryDataTable(
               [...data.clientBookings].flatMap((Detail) =>
                    compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                packagetype: Detail.fitnesspackages[0].fitness_package_type.type,
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                details: [
                                     Detail.fitnesspackages[0].ptonline,
                                     Detail.fitnesspackages[0].ptoffline,
                                     Detail.fitnesspackages[0].grouponline,
                                     Detail.fitnesspackages[0].groupoffline,
                                     Detail.fitnesspackages[0].recordedclasses,
                                ],
                                duration: Detail.package_duration,
                                effectivedate: getDate(Date.parse(Detail.effective_date)),
                                enddate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                cost: Detail.fitnesspackages[0].fitnesspackagepricing[0].packagepricing[0].mrp,
                                bookingstatus: Detail.booking_status,
                                payment: "",
                           }
                         : []
               )
          );

          setActiveDataTable(
               [...data.clientBookings].flatMap((Detail) =>
                    !compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                         ? {
                                packagetype: Detail.fitnesspackages[0].fitness_package_type.type,
                                packagename: Detail.program_managers[0]
                                     ? Detail.program_managers[0].fitnesspackages[0].packagename
                                     : Detail.fitnesspackages[0].packagename,
                                details: [
                                     Detail.fitnesspackages[0].ptonline,
                                     Detail.fitnesspackages[0].ptoffline,
                                     Detail.fitnesspackages[0].grouponline,
                                     Detail.fitnesspackages[0].groupoffline,
                                     Detail.fitnesspackages[0].recordedclasses,
                                ],
                                duration: Detail.package_duration,
                                effectivedate: getDate(Date.parse(Detail.effective_date)),
                                enddate: getRenewalDate(Detail.effective_date, Detail.package_duration),
                                cost: Detail.fitnesspackages[0].fitnesspackagepricing[0].packagepricing[0].mrp,
                                bookingstatus: Detail.booking_status,
                                payment: "",
                           }
                         : []
               )
          );
     }

     FetchData({ id: auth.userid, clientid: last });

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
