import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Button, Spinner, Alert } from "react-bootstrap";
import moment from "moment";
import RosterTabs from "./tabs";
import {
  GET_SESSION_AND_SESSION_BOOKINGS,
  GET_TAG_BASED_ON_SESSION,
  GET_PARTICULAR_CLIENT,
} from "./graphql/queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import Calendar from "react-calendar";
import AttendanceModal from "./attendance_modal";
import "react-calendar/dist/Calendar.css";
import "./styles.css";

const Roster = () => {
  const auth = useContext(AuthContext);
  const [scheduleDate] = useState(moment().format("YYYY-MM-DD"));
  const [currentDateSessions, setCurrentDateSessions] = useState<any>([]);
  const [restDays, setRestDays] = useState<any>([]);
  const [tags, setTags] = useState<any>([]);
  const [sessionData, setSessionData] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [anotherDate, setAnotherDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [attendanceModalShow, setAttendanceModalShow] = useState(false);
  const [choosenDate, setChoosenDate] = useState("");
  const [bookingStatusDetails, setBookingStatusDetails] = useState<any>([]);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);

  useQuery(GET_PARTICULAR_CLIENT, {
    variables: {
      id: window.location.pathname.split("/").pop(),
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setBookingStatusDetails(flattenData.sessionsBookings);
    },
  });

  function tileContent({ date, view }) {
    for (var i = 0; i < currentDateSessions?.length; i++) {
      if (
        moment(currentDateSessions[i]?.session_date).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD") &&
        currentDateSessions[i].type === "restday"
      ) {
        return "sessionRestDay";
      }
      if (
        moment(currentDateSessions[i]?.session_date).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD") &&
        currentDateSessions[i].type !== "restday"
      ) {
        return "sessionPresent";
      }
    }
  }

  function handleDateChange(date) {
    const checkingIfSessionExists = currentDateSessions?.filter(
      (session) =>
        session.session_date === moment(date).format("YYYY-MM-DD") &&
        session.type !== "restday"
    );

    if (
      checkingIfSessionExists?.length > 0 &&
      checkingIfSessionExists !== undefined
    ) {
      window.location.href = `/roster/${checkingIfSessionExists[0].id}`;
    } else {
      setShowAlert(true);
      setChoosenDate(moment(date).format("Do MMM, YY"));
    }
  }

  function handleSorting(data: any) {
    data?.sort((a: any, b: any) => {
      var btime1: any = moment(a.start_time, "HH:mm a");
      var btime2: any = moment(b.start_time, "HH:mm a");
      return btime1 - btime2;
    });
    data?.sort(function (a: any, b: any) {
      const date1: any = new Date(a.session_date);
      const date2: any = new Date(b.session_date);

      return date1 - date2;
    });
    data?.filter((sess: any) => sess.Is_Holiday === true);
    if (scheduleDate === moment().format("YYYY-MM-DD")) {
      setCurrentDateSessions(data);
    }
  }

  useEffect(() => {
    const restDaysSorted = currentDateSessions?.filter(
      (session) =>
        session.Is_restday === true && session.session_date === anotherDate
    );
    setRestDays(restDaysSorted);
  }, [anotherDate, currentDateSessions]);

  useQuery(GET_TAG_BASED_ON_SESSION, {
    variables: {
      userid: auth.userid,
      id: window.location.pathname.split("/").pop(),
      lowerDate: moment().subtract(1, "month").format("YYYY-MM-DD"),
      upperDate: moment().add(1, "month").format("YYYY-MM-DD"),
    },
    onCompleted: (data: any) => {
      const flattenData = flattenObj({ ...data });
      setTags(flattenData?.tags);
      handleSorting(flattenData?.tags[0]?.sessions);
    },
  });

  useQuery(GET_SESSION_AND_SESSION_BOOKINGS, {
    variables: {
      id: window.location.pathname.split("/").pop(),
    },
    onCompleted: (data) => {
      const flattenedData = flattenObj({ ...data });
      setAnotherDate(
        moment(flattenedData.sessionsBookings[0]?.session?.session_date).format(
          "YYYY-MM-DD"
        )
      );
      setSessionData(flattenedData.sessionsBookings);
      setShow(true);
    },
  });

  function handleIconRender(tag: any, mode: any) {
    if (tag === "One-On-One") {
      if (mode === "Online") {
        return <img src="/assets/PTonline.svg" alt="pt_online" />;
      } else {
        return <img src="/assets/PToffline.svg" alt="pt_offline" />;
      }
    } else if (tag === "Group Class") {
      if (mode === "Online") {
        return <img src="/assets/Grouponline.svg" alt="group_online" />;
      } else {
        return <img src="/assets/Groupoffline.svg" alt="group_offline" />;
      }
    }
  }

  function toHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function handleClassTimeDisplay(time: any) {
    const value = moment(time, "hh:mm a").isBefore(moment());

    if (value) {
      return <span className="text-danger">Class Has Ended</span>;
    } else {
      const leftTime = moment(time, "hh:mm a").diff(moment(), "minutes");
      const timeLeft = toHoursAndMinutes(leftTime);
      const timeLeftHours = timeLeft.split(":")[0];
      const timeLeftMinutes = timeLeft.split(":")[1];
      return (
        <span className="text-success">
          Class Starts in {timeLeftHours}h {timeLeftMinutes}m
        </span>
      );
    }
  }

  function handlePrevSessionLoad(currentId: any) {
    const location = currentDateSessions.findIndex(
      (session) => session.id === currentId
    );
    if (location === 0 || currentDateSessions.length === 1) {
      console.log("no previous sessions available");
    } else if (currentDateSessions[location - 1].Is_restday === true) {
      console.log("no previous sessions available");
    } else {
      window.location.href = `/roster/${currentDateSessions[location - 1].id}`;
    }
  }

  function handleNextSessionLoad(currentId: any) {
    const location = currentDateSessions.findIndex(
      (session) => session.id === currentId
    );
    if (location === currentDateSessions.length - 1) {
      console.log("no next sessions available");
    } else if (currentDateSessions[location + 1].Is_restday === true) {
      console.log("no next sessions available");
    } else {
      window.location.href = `/roster/${currentDateSessions[location + 1].id}`;
    }
  }

  function handleBookingStatusCalculations(data: any[], statusToCheck: string) {
    const filteredData = data.filter(
      (session: any) => session.Session_booking_status === statusToCheck
    );
    return padTo2Digits(filteredData.length);
  }

  return (
    <>
      <div className="mb-3">
        <span style={{ fontSize: "30px" }}>
          <Link to="/schedule">
            <i
              className="fa fa-arrow-circle-left"
              style={{ color: "black" }}
            ></i>
          </Link>
          <b> Back</b>
        </span>
        {showAlert && (
          <Alert key={2} variant={"warning"}>
            There are no available Session on {choosenDate}
          </Alert>
        )}
      </div>
      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Row>
            <Col lg={5} style={{ borderRight: "2px dashed gray" }}>
              <div className="text-center mb-2">
                <span
                  onClick={() => {
                    handlePrevSessionLoad(
                      window.location.pathname.split("/").pop()
                    );
                  }}
                  className="rounded-circle"
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  <i className="fa fa-chevron-left mr-5"></i>
                </span>
                <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                  {sessionData[0]?.session?.activity === null
                    ? sessionData[0]?.session?.workout?.workouttitle
                    : sessionData[0]?.session?.activity?.title}
                </span>
                <span
                  onClick={() => {
                    handleNextSessionLoad(
                      window.location.pathname.split("/").pop()
                    );
                  }}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  <i className="fa fa-chevron-right ml-5"></i>
                </span>
              </div>
              <div
                className="text-center"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div
                  className="pl-3 pr-3"
                  style={{ border: "1px solid black", borderRadius: "20px" }}
                >
                  <span>
                    {moment(
                      sessionData[0]?.session?.start_time,
                      "hh:mm a"
                    ).format("hh:mm a")}
                  </span>
                </div>
                <div className="pl-3 pr-3">to</div>
                <div
                  className="pl-3 pr-3"
                  style={{ border: "1px solid black", borderRadius: "20px" }}
                >
                  <span>
                    {moment(
                      sessionData[0]?.session?.end_time,
                      "hh:mm a"
                    ).format("hh:mm a")}
                  </span>
                </div>
              </div>
              <div
                className="mt-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ maxWidth: "300px" }}>
                  <img
                    src="/assets/navigation_icon.svg"
                    alt="navigation-icon"
                  />
                  <span className="pl-2">
                    {tags[0]?.fitnesspackage?.address === null
                      ? "Class will be on google meet"
                      : tags[0]?.fitnesspackage?.address?.address1}
                  </span>
                </div>
                <div>
                  <span>
                    {handleIconRender(
                      sessionData[0]?.session?.tag,
                      sessionData[0]?.session?.mode
                    )}
                  </span>
                  <span className="pl-2">{sessionData[0]?.session?.tag}</span>
                </div>
              </div>
            </Col>
            <Col lg={4} style={{ borderRight: "2px dashed gray" }}>
              <div className="text-center">
                <span>
                  <b>
                    {moment(sessionData[0]?.session?.session_date).isAfter(
                      moment()
                    ) ? (
                      <span className="text-success">Class Is Tomorrow</span>
                    ) : (
                      handleClassTimeDisplay(
                        sessionData[0]?.session?.start_time
                      )
                    )}
                  </b>
                </span>
              </div>
              <div className="text-center">
                <Button
                  variant="success"
                  disabled={moment(
                    sessionData[0]?.session?.start_time,
                    "hh:mm a"
                  ).isBefore(moment())}
                >
                  Join Session
                </Button>
              </div>
              <div className="text-center mt-4">
                <Button
                  className="pl-3 pr-3"
                  onClick={() => {
                    setAttendanceModalShow(true);
                  }}
                  variant="outline-dark"
                >
                  Mark Attendance
                </Button>
                <AttendanceModal
                  show={attendanceModalShow}
                  onHide={() => setAttendanceModalShow(false)}
                />
              </div>
              <Row className="mt-5">
                <Col className="pl-1 pr-1 text-center">
                  <span className="small">
                    {handleBookingStatusCalculations(
                      bookingStatusDetails,
                      "Booked"
                    )}
                  </span>
                  <br />
                  <span className="small">Booked</span>
                </Col>
                <Col className="pl-1 pr-1 text-center">
                  <span className="small">
                    {handleBookingStatusCalculations(
                      bookingStatusDetails,
                      "Attended"
                    )}
                  </span>
                  <br />
                  <span className="small">Present</span>
                </Col>
                <Col className="pl-1 pr-1 text-center">
                  <span className="small">
                    {handleBookingStatusCalculations(
                      bookingStatusDetails,
                      "Absent"
                    )}
                  </span>
                  <br />
                  <span className="small">Absent</span>
                </Col>
                <Col className="pl-1 pr-1 text-center">
                  <span className="small">
                    {handleBookingStatusCalculations(
                      bookingStatusDetails,
                      "Canceled"
                    )}
                  </span>
                  <br />
                  <span className="small">Cancelled</span>
                </Col>
                <Col className="pl-1 pr-1 text-center">
                  <span className="small">
                    {handleBookingStatusCalculations(
                      bookingStatusDetails,
                      "Rescheduled"
                    )}
                  </span>
                  <br />
                  <span className="small">Rescheduled</span>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <div className="text-center">
                <span>
                  <b>
                    {tags
                      ?.map((item: any) => {
                        return item.tag_name;
                      })
                      .join(", ")}
                  </b>
                </span>
              </div>
              <div className="text-center">
                <Calendar
                  className="disabled mt-3"
                  tileClassName={tileContent}
                  onChange={handleDateChange}
                  maxDate={moment().add(2, "months").toDate()}
                  maxDetail="month"
                  minDetail="month"
                  next2Label={null}
                  prev2Label={null}
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {restDays?.length > 0 && (
        <div
          className="mt-4 mb-4 p-3 text-center"
          style={{ backgroundColor: "#F5A947", borderRadius: "10px" }}
        >
          <b>Rest Day</b>
        </div>
      )}
      {sessionData.length > 0 && (
        <div className="mt-4">
          {!show ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="secondary" />
              <h5 className="mt-5">
                <b>Please wait while we load your Schedule for the day...</b>
              </h5>
            </div>
          ) : (
            <RosterTabs data={sessionData} />
          )}
        </div>
      )}
    </>
  );
};

export default Roster;
