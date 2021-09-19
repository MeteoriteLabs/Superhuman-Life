import ActionButton from "../../../../../components/actionbutton/index";
import { useMemo } from "react";
import { Badge } from "react-bootstrap";
import Table from "../../../../../components/table";
import { Row, Button } from "react-bootstrap";

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

     const data = [
          {
               type: "/assets/avatar-1.jpg",
               packagename: "Package Name",
               details: "",
               duration: "4 months",
               effectivedate: "25/06/20",
               enddate: "05/07/20",
               cost: "Rs 4000",
               payment: "Paid",
          },
     ];

     return (
          <div>
               <Row className="d-flex flex-row-reverse mr-4 ml-1">
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              Suggest Package
                         </Button>
                         {/* <CreateHealth ref={CreateHealthComponent}></CreateHealth> */}
                    </div>
                    <div className="m-1">
                         <Button variant="btn btn-light" size="sm" onClick={() => {}}>
                              <i className="fas fa-plus-circle"></i> Create Package
                         </Button>
                         {/* <CreateMovement ref={CreateMovementComponent}></CreateMovement> */}
                    </div>
               </Row>
               <div className="mt-4">
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Fitness</h5>
                         </Row>
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

export default Movement;
