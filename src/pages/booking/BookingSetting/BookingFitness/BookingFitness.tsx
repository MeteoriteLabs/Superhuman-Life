import { useContext, useMemo, useRef, useState } from "react";
import { Row, Col, Badge } from "react-bootstrap";
import authContext from "../../../../context/auth-context";
import Table from "../../../../components/table/index";
import ActionButton from "../../../../components/actionbutton";
import ConfirmRequestAction from "./ConfirmRequestAction";
import { BOOKING_CONFIG } from "../../GraphQL/queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";

export default function BookingFitness() {
  const auth = useContext(authContext);
  const [bookingPackage, setBookingPackage] = useState<any>([]);
  const bookingFitnessActionRef = useRef<any>(null);

  const FetchData = () => {
    useQuery(BOOKING_CONFIG, {
      variables: {
        id: auth.userid,
      },
      onCompleted: (data) => loadData(data),
    });
  };

  const loadData = (data) => {
    const flattenData = flattenObj({ ...data });
    setBookingPackage([
      ...flattenData.bookingConfigs.map((fitnessPackage) => {
        return {
          id: fitnessPackage.id,
          packageName: fitnessPackage.fitnesspackage.packagename,
          fitness_package_type:
            fitnessPackage.fitnesspackage.fitness_package_type.type,
          bookingPerMonth: fitnessPackage.BookingsPerMonth,
          bookingPerDay: fitnessPackage.bookingsPerDay,
          confirmations: fitnessPackage.isAuto
            ? "Auto Accept"
            : "Manual Accept",
          requests: "Configured",
        };
      }),
    ]);
  };

  FetchData();

  const columns = useMemo(
    () => [
      { accessor: "packageName", Header: "Name" },
      {
        accessor: "fitness_package_type",
        Header: "Type",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "One-On-One" ? (
                <img src="./assets/PTType.svg" alt="PT" />
              ) : (
                ""
              )}
              {row.value === "Group Class" ? (
                <img src="./assets/GroupType.svg" alt="group" />
              ) : (
                ""
              )}
              {row.value === "Custom Fitness" ? (
                <img src="./assets/CustomType.svg" alt="custom" />
              ) : (
                ""
              )}
              {row.value === "Classic Class" ? (
                <img src="./assets/ClassicType.svg" alt="classic" />
              ) : (
                ""
              )}
            </>
          );
        },
      },
      {
        accessor: "confirmations",
        Header: "Booking Confirmations",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "Auto Accept" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="success"
                >
                  {row.value}
                </Badge>
              ) : (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="danger"
                >
                  {row.value}
                </Badge>
              )}
            </>
          );
        },
      },
      {
        accessor: "requests",
        Header: "Date Requests",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "Configured" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="success"
                >
                  {row.value}
                </Badge>
              ) : (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="danger"
                >
                  {row.value}
                </Badge>
              )}
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const bookingConfirmationHandler = () => {
            bookingFitnessActionRef.current.TriggerForm({
              actionType: "confirmation",
              formData: row.original,
            });
          };

          const dataRequestHandler = () => {
            bookingFitnessActionRef.current.TriggerForm({
              actionType: "request",
            });
          };
          let arrayAction;

          row.original.fitness_package_type !== "Group Class" &&
          row.original.fitness_package_type !== "Cohort" &&
          row.original.fitness_package_type !== "Live Stream Channel" &&
          row.original.fitness_package_type !== "Classic Class"
            ? (arrayAction = [
                {
                  actionName: "Booking confirmation",
                  actionClick: bookingConfirmationHandler,
                },
                {
                  actionName: "Data requests",
                  actionClick: dataRequestHandler,
                },
              ])
            : (arrayAction = [
                {
                  actionName: "Data requests",
                  actionClick: dataRequestHandler,
                },
              ]);

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    []
  );

  return (
    <div className="mt-5">
      <Row>
        <Col>
          <Table columns={columns} data={bookingPackage} />
          <ConfirmRequestAction ref={bookingFitnessActionRef} />
        </Col>
      </Row>
    </div>
  );
}
