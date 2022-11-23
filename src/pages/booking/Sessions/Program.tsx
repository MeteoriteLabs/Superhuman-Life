import { useMemo, useState, useContext, useRef } from "react";
import { Badge, TabContent, Row, Col, Card } from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import ActionButton from "../../../components/actionbutton/index";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_SESSIONS, GET_SESSION_BOOKINGS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import { useHistory } from "react-router-dom";
import CancelComponent from "./CancelComponent";

export default function Program() {
  const auth = useContext(AuthContext);
  const [sessionData, setSessionData] = useState<any>([]);
  const [activeCard, setActiveCard] = useState<number>(0);
  const currentDate = new Date();
  const cancelComponent = useRef<any>(null);

  function getDate(time: Date): string {
    let dateObj: Date = new Date(time);
    let month: number = dateObj.getMonth() + 1;
    let year: number = dateObj.getFullYear();
    let date: number = dateObj.getDate();

    return `${year}-${month}-${date}`;
  }

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Name" },
      { accessor: "sessionDate", Header: "Session Date" },
      { accessor: "sessionTime", Header: "Session Time" },
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

          const cancelHandler = () => {
            cancelComponent.current.TriggerForm({
              id: row.original.id,
              type: "cancel",
            });
          };

          const arrayAction = [
            {
              actionName: "Reschedule",
              actionClick: routeChange,
            },
            {
              actionName: "Cancel",
              actionClick: cancelHandler,
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

  useQuery(GET_SESSIONS, {
    variables: { id: Number(auth.userid), session_date: getDate(currentDate) },
    onCompleted: (data) => {
      const flattenLeadsData = flattenObj({ ...data.sessions });
      setSessionData(flattenLeadsData);
    },
  });

  // eslint-disable-next-line
  const [getSessionBookings, { data: get_session_bookings, refetch: refetch_session_bookings }] = useLazyQuery(
    GET_SESSION_BOOKINGS,
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
    const flattenBookingsData = flattenObj({ ...data });

    setDataTable(
      [...flattenBookingsData.sessionsBookings].flatMap((Detail) => {
        return {
          id: Detail.id,
          name: Detail.client.username,
          sessionDate: Detail.session_date,
          sessionTime: getTime(Detail.session_time),
          status: Detail.Session_booking_status,
        };
      })
    );
  }

  return (
    <>
      <div className="mt-3">
        <h3>Program Details</h3>

        <TabContent>
          <Row className="mt-5">
            <Col lg={3}>
              <h6>Click on cards to get session booking details</h6>
              {sessionData.map((currentValue: any) => (
                <Card
                  style={{
                    width: "18rem",
                    cursor: "pointer",
                    border: "3px solid ",
                  }}
                  className="mt-4 bg-white rounded shadow"
                  border={activeCard === currentValue.id ? "success" : "light"}
                  key={currentValue.id}
                  onClick={() => {
                    setActiveCard(currentValue.id);
                    getSessionBookings({ variables: { id: currentValue.id } });
                  }}
                >
                  <Card.Body>
                    <Card.Title>
                      {currentValue.type === "activity"
                        ? currentValue.activity.title
                        : currentValue.workout.workouttitle}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {getTime(currentValue.start_time)} to{" "}
                      {getTime(currentValue.end_time)}
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
      <CancelComponent
        ref={cancelComponent}
        callback={refetch_session_bookings}
      ></CancelComponent>
    </>
  );
}
