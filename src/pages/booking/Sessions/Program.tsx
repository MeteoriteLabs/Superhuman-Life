import { useMemo, useState, useContext, useRef } from "react";
import {
  Badge,
  TabContent,
  Row,
  Col,
  Card,
  Container,
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from "react-bootstrap";
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
  const [searchFilter, setSearchFilter] = useState("");
  const [startTimeFilter, setStartTimeFilter] = useState("");
  const [endTimeFilter, setEndTimeFilter] = useState("");
  const searchInput = useRef<any>();
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
      // { accessor: "id", Header: "ID" },
      // { accessor: "sessionId", Header: "Session ID" },
      { accessor: "name", Header: "Name" },
      { accessor: "bookingTime", Header: "Booking Time" },
      { accessor: "tag", Header: "Type" },
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

          const rescheduleHandler = () => {
            cancelComponent.current.TriggerForm({
              id: row.original.sessionId,
              type: "reschedule",
              tag: row.original.tag,
            });
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
              actionClick: rescheduleHandler,
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

          const arrayActionForGroup = [
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

          return (
            <ActionButton
              arrayAction={
                row.values.tag === "Live Stream Channel" ||
                row.values.tag === "Group Class" ||
                row.values.tag === "Cohort"
                  ? arrayActionForGroup
                  : row.values.status === "Canceled" ||
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

  function getTime(startTime: string): string {
    let splitTime: string[] = startTime.split(":");
    let date: moment.Moment = moment().set({
      hour: Number(splitTime[0]),
      minute: Number(splitTime[1]),
    });
    let time: string = moment(date).format("h:mm A");
    return time;
  }

  const [datatable, setDataTable] = useState<{}[]>([]);

  useQuery(GET_SESSIONS, {
    variables: {
      filter: searchFilter,
      id: Number(auth.userid),
      session_date: getDate(currentDate),
      start_time_filter: startTimeFilter,
      end_time_filter: endTimeFilter,
    },
    onCompleted: (data) => {
      const flattenSessionData = flattenObj({ ...data.sessions });

      let currentTime = new Date();

      const nextUpcomingSessions = flattenSessionData.filter((currentValue) => {
        const [hours, minutes] = currentValue.start_time.split(":");
        const date = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          +hours,
          +minutes,
          0
        );

        return date >= currentTime;
      });
      setSessionData(nextUpcomingSessions);
    },
  });

  const [
    getSessionBookings,
    // eslint-disable-next-line
    { data: get_session_bookings, refetch: refetch_session_bookings },
  ] = useLazyQuery(GET_SESSION_BOOKINGS, {
    onCompleted: (data) => {
      loadData(data);
    },
  });

  function loadData(data: any) {
    const flattenBookingsData = flattenObj({ ...data });

    setDataTable(
      [...flattenBookingsData.sessionsBookings].flatMap((Detail) => {
        return {
          id: Detail.id,
          sessionId: Detail.session && Detail.session.id,
          name: Detail.client.username,
          bookingTime: moment(Detail.createdAt).format("DD/MM/YY, hh:mm A"),
          status: Detail.Session_booking_status,
          tag: Detail.session.tag,
        };
      })
    );
  }

  return (
    <>
      <div className="mt-3">
        <h3>Program Details</h3>

        <Container className="mt-3">
          <Row>
            <Col lg={6}>
              <InputGroup className="mb-3 mt-3">
                <FormControl
                  aria-describedby="basic-addon1"
                  placeholder="Search for session type name"
                  ref={searchInput}
                />
                <InputGroup.Prepend>
                  <Button
                    variant="outline-secondary"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSearchFilter(searchInput.current.value);
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup.Prepend>
              </InputGroup>
            </Col>

            <Col className="mt-3 mb-3 ">
              <DropdownButton
                as={ButtonGroup}
                key={"starttime"}
                id={`dropdown-button-drop-down`}
                drop={"down"}
                variant="secondary"
                title={startTimeFilter === "" ? ` Start time ` : startTimeFilter}
                style={{ marginRight: "25px" }}
              >
                {sessionData.map((currentValue) => (
                  <Dropdown.Item
                    key={currentValue.id}
                    eventKey={currentValue.id}
                    onSelect={() => setStartTimeFilter(currentValue.start_time)}
                  >
                    {currentValue.start_time}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton
                as={ButtonGroup}
                key={"endtime"}
                id={`dropdown-button-drop-down`}
                drop={"down"}
                variant="secondary"
                title={ endTimeFilter === "" ? ` End time ` : endTimeFilter}
              >
                {sessionData.map((currentValue) => (
                  <Dropdown.Item
                    key={currentValue.id}
                    eventKey={currentValue.id}
                    onSelect={() => setEndTimeFilter(currentValue.end_time)}
                  >
                    {currentValue.end_time}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
        </Container>

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
                      <br />
                      Mode: {currentValue.mode}
                      <br />
                      Type: {currentValue.tag}
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
