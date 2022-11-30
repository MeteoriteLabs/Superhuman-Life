import { useMemo, useState, useContext, useRef } from "react";
import {
  Badge,
  TabContent,
  Row,
  Col,
  Card,
  Container,
  InputGroup,
  Button,
  FormControl,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import TimePicker from "rc-time-picker";
import Table from "../../../components/table/leads-table";
import ActionButton from "../../../components/actionbutton/index";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_CLIENTS, GET_SESSION_BOOKINGS_FOR_CLIENTS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import { useHistory } from "react-router-dom";
import CancelComponent from "./CancelComponent";
import TimeFieldInput from "../../../components/customWidgets/timeField";

export default function Clients() {
  const [searchFilter, setSearchFilter] = useState("");
  const searchInput = useRef<any>();
  const auth = useContext(AuthContext);
  const [clientsData, setClientsData] = useState<any>([]);
  const [activeCard, setActiveCard] = useState<number>(0);
  const cancelComponent = useRef<any>(null);

  const columns = useMemo<any>(
    () => [
      // { accessor: "id", Header: "Booking ID" },
      // { accessor: "sessionId", Header: "Session ID" },
      { accessor: "name", Header: "Session Name" },
      { accessor: "sessionDate", Header: "Session Date" },
      { accessor: "sessionTime", Header: "Session Time" },
      { accessor: "bookingTime", Header: "Booking Time" },
      { accessor: "mode", Header: "Mode" },
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

  const [datatable, setDataTable] = useState<{}[]>([]);

  useQuery(GET_ALL_CLIENTS, {
    variables: { filter: searchFilter, id: Number(auth.userid) },
    onCompleted: (data) => {
      const flattenClientsData = flattenObj({ ...data.clientPackages });
      setClientsData(flattenClientsData);
    },
  });

  const [
    getSessionBookings,
    // eslint-disable-next-line
    { data: get_session_bookings, refetch: refetch_session_bookings },
  ] = useLazyQuery(GET_SESSION_BOOKINGS_FOR_CLIENTS, {
    onCompleted: (data) => {
      loadData(data);
    },
  });

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
    console.log(flattenBookingsData);

    setDataTable(
      [...flattenBookingsData].flatMap((Detail) => {
        return {
          id: Detail.id,
          sessionId:
            Detail.session && Detail.session.id ? Detail.session.id : null,
          name:
            Detail.session &&
            Detail.session.type &&
            Detail.session.type === "activity"
              ? Detail.session.activity.title
              : Detail.session &&
                Detail.session.workout &&
                Detail.session.workout.workouttitle,
          tag: Detail.session && Detail.session.tag,
          mode: Detail.session && Detail.session.mode,
          sessionDate: Detail.session && Detail.session.session_date,
          bookingTime: moment(Detail.createdAt).format("DD/MM/YYYY, hh:mm"),
          sessionTime: Detail.session
            ? `${getTime(Detail.session.start_time)} - ${getTime(
                Detail.session.end_time
              )}`
            : null,
          status: Detail.Session_booking_status,
        };
      })
    );
  }

  return (
    <>
      <div className="mt-3">
        <h3>Clients</h3>

        <Container className="mt-3">
          <Row>
            <Col lg={6}>
              <InputGroup className="mb-3 mt-3">
                <FormControl
                  aria-describedby="basic-addon1"
                  placeholder="Search for user name"
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
                title={` Start time `}
                style={{ marginRight: "25px" }}
              >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>

              <DropdownButton
                as={ButtonGroup}
                key={"endtime"}
                id={`dropdown-button-drop-down`}
                drop={"down"}
                variant="secondary"
                title={` End time `}
              >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
            </Col>
             {/* <TimePicker showHour={true} showMinute use12Hours defaultOpenValue={moment()}/> */}
            {/* <TimePicker
              // value={convertToMoment(fromTime)}
              showSecond={false}
              minuteStep={15}
              onChange={(e) => {
                // handleFromTimeInput(moment(e).format("HH:mm"));
              }}
            />  */}
            {/* <TimeFieldInput onChange={props.onChange} value={props.value}/> */}
          </Row>
        </Container>

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
      <CancelComponent
        ref={cancelComponent}
        callback={refetch_session_bookings}
      ></CancelComponent>
    </>
  );
}
