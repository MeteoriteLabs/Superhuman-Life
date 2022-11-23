import { useMemo, useState, useContext } from "react";
import { Badge, TabContent, Row, Col, Card } from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import ActionButton from "../../../components/actionbutton/index";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_CLIENTS, GET_SESSION_BOOKINGS_FOR_CLIENTS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function Clients() {
  const auth = useContext(AuthContext);
  const [clientsData, setClientsData] = useState<any>([]);
  const [activeCard, setActiveCard] = useState<number>(0);

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Session Name" },
      { accessor: "sessionDate", Header: "Session Date" },
      { accessor: "sessionTime", Header: "Session Time" },
      { accessor: "bookingTime", Header: "Booking Time" },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.status) {
            case "Booked":
              statusColor = "success";
              break;

            case "Attended":
              statusColor = "primary";
              break;

            case "Rescheduled":
              statusColor = "info";
              break;

            case "Canceled":
              statusColor = "secondary";
              break;

            case "Rejected":
              statusColor = "danger";
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: "1rem", borderRadius: "10px" }}
                variant={statusColor}
              >
                {row.values.status}
              </Badge>
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const history = useHistory();
          const routeChange = () => {
            let path = `clients`;
            history.push(path);
          };

          const arrayAction = [
            {
              actionName: "Reschedule",
              actionClick: routeChange,
            },
            {
              actionName: "Cancel",
              actionClick: routeChange,
            },
            {
              actionName: "Manage Program",
              actionClick: routeChange,
            },
            {
              actionName: "Go to client",
              actionClick: routeChange,
            },
          ];

          const arrayActionForCancelledAndAttended = [
            {
              actionName: "Manage Program",
              actionClick: routeChange,
            },
            {
              actionName: "Go to client",
              actionClick: routeChange,
            },
          ];

          return (
            <ActionButton
              arrayAction={
                row.values.status === "Canceled" ||
                row.values.status === "Attended"
                  ? arrayActionForCancelledAndAttended
                  : arrayAction
              }
            ></ActionButton>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [datatable, setDataTable] = useState<{}[]>([]);

  useQuery(GET_ALL_CLIENTS, {
    variables: { id: Number(auth.userid) },
    onCompleted: (data) => {
      const flattenClientsData = flattenObj({ ...data.clientPackages });
      setClientsData(flattenClientsData);
    },
  });

  // eslint-disable-next-line
  const [getSessionBookings, { data: get_session_bookings }] = useLazyQuery(
    GET_SESSION_BOOKINGS_FOR_CLIENTS,
    {
      onCompleted: (data) => {
        loadData(data);
      },
    }
  );

  function getTime(startTime: string): string {
    let splitTime: string[] = startTime.split(":");
    let date: moment.Moment = moment().set({
      hour: Number(splitTime[0]),
      minute: Number(splitTime[1]),
    });
    let time: string = moment(date).format("h:mm A");
    return time;
  }

  function loadData(data: any) {
    const flattenBookingsData = flattenObj({ ...data.sessionsBookings });
    setDataTable(
      [...flattenBookingsData].flatMap((Detail) => {
        return {
          id: Detail.id,
          name: Detail.session.type === "activity" ? Detail.session.activity.title : Detail.session.workout.workouttitle ,
          sessionDate: Detail.session.session_date,
          bookingTime: moment(Detail.createdAt).format("DD/MM/YYYY, hh:mm"),
          sessionTime: `${getTime(Detail.session.start_time)} - ${getTime(
            Detail.session.end_time
          )}`,
          status: Detail.Session_booking_status,
        };
      })
    );
  }

  return (
    <div className="mt-3">
      <h3>Clients</h3>

      <TabContent>
        <Row className="mt-5">
          <Col lg={3}>
            <h6>Click on cards to get session details</h6>
            {clientsData.map((currentValue: any) => (
              <Card
                style={{
                  width: "18rem",
                  cursor: "pointer",
                  border: "3px solid ",
                }}
                className="mt-4 bg-white rounded shadow"
                key={currentValue.id}
                border={activeCard === currentValue.id ? "success" : "light"}
                onClick={() => {
                  setActiveCard(currentValue.id);
                  getSessionBookings({
                    variables: { id: currentValue.users_permissions_user.id },
                  });
                }}
              >
                <Card.Body>
                  <Card.Title>
                    {currentValue.users_permissions_user.First_Name}{" "}
                    {currentValue.users_permissions_user.Last_Name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    @{currentValue.users_permissions_user.username}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <div style={{ border: "1px solid black" }} />

          <Col lg={8}>
            <Table columns={columns} data={datatable} />
          </Col>
        </Row>
      </TabContent>
    </div>
  );
}
