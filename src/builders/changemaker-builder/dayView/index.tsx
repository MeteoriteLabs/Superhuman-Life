import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import {
  GET_ALL_CLIENT_PACKAGE_BY_TYPE,
  GET_ALL_DAILY_SESSIONS,
} from "../graphql/queries";
import { useQuery } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import "react-vertical-timeline-component/style.min.css";
import { flattenObj } from "../../../components/utils/responseFlatten";

const DayView = (props: any) => {
  const auth = useContext(AuthContext);
  const [todaysEvents, setTodaysEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [immutableDays, setImmutableDays] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [scheduleDay, setScheduleDay] = useState(1);
  const [scheduleDate, setScheduleDate] = useState(
    moment()
      .add(scheduleDay - 1, "days")
      .format("YYYY-MM-DD")
  );

  useQuery(GET_ALL_DAILY_SESSIONS, {
    variables: {
      id: auth.userid,
      Date: scheduleDate,
    },
    onCompleted: (data: any) => {
      const flattenData = flattenObj({ ...data });
      setTodaysEvents(flattenData.sessions);
    },
  });

  useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
    variables: {
      id: auth.userid,
      type_in: ["One-On-One", "Group Class", "Custom"],
    },
    onCompleted: (data) => {
      // loadData(data);
    },
  });

  /* eslint-disable */
  function loadData(data: any) {
    const flattenData = flattenObj({ ...data });
    var sortedPrograms: any = [];
    var Values: any = {};
    for (var i = 0; i < flattenData.clientPackages.length; i++) {
      if (flattenData.clientPackages[i].program_managers.length !== 0) {
        if (
          flattenData.clientPackages[i].fitnesspackages[0].fitness_package_type
            .type === "Group Class"
        ) {
          for (
            var j = 0;
            j <
            flattenData.clientPackages[i].program_managers[0].fitnessprograms
              .length;
            j++
          ) {
            Values.effectiveDate =
              flattenData.clientPackages[i].program_managers[0].fitnessprograms[
                j
              ].start_dt;
            Values.program =
              flattenData.clientPackages[i].program_managers[0].fitnessprograms[
                j
              ];
            sortedPrograms.push(Values);
            Values = {};
          }
        } else {
          for (
            var k = 0;
            k <
            flattenData.clientPackages[i].program_managers[0].fitnessprograms
              .length;
            k++
          ) {
            Values.effectiveDate = flattenData.clientPackages[
              i
            ].effective_date.substring(
              0,
              flattenData.clientPackages[i].effective_date.indexOf("T")
            );
            Values.program =
              flattenData.clientPackages[i].program_managers[0].fitnessprograms[
                k
              ];
            sortedPrograms.push(Values);
            Values = {};
          }
        }
      }
    }
    handleDuplicates(sortedPrograms);
  }

  function handleDuplicates(sortedPrograms: any) {
    if (sortedPrograms.length > 0) {
      const values = [...sortedPrograms];
      for (var i = 0; i < values.length; i++) {
        for (var j = i + 1; j < values.length - 1; j++) {
          if (values[i].program.id === values[j].program.id) {
            values.splice(j, 1);
          }
        }
      }
      handleCurrentDate(values);
    }
  }

  function handleCurrentDate(data: any) {
    const currentDay: any = [];
    for (var i = 0; i < data?.length; i++) {
      var date1 = moment();
      var date2 = moment(data[i].effectiveDate);
      var diff = date1.diff(date2, "days");
      currentDay.push(diff);
    }
    setEvents(data);
    setDays(currentDay);
    setImmutableDays(currentDay);
    handleTodaysEvents(data, currentDay);
  }

  function handleTodaysEvents(data: any, currentDay: any) {
    const todaysPrograms: any = [];
    for (var i = 0; i < data?.length; i++) {
      for (var j = 0; j < data[i]?.program.events?.length; j++) {
        if (
          currentDay[i] === parseInt(data[i].program.events[j].day) &&
          data[i].program.events[j].type === "workout"
        ) {
          todaysPrograms.push(data[i].program.events[j]);
        }
      }
    }
    setTodaysEvents(todaysPrograms);
  }

  if (todaysEvents.length > 1) {
    todaysEvents.sort((a: any, b: any) => {
      var btime1: any = moment(a.start_time, "HH:mm a");
      var btime2: any = moment(b.start_time, "HH:mm a");
      return btime1 - btime2;
    });
  }

  function handleAddChangeDay(currentDay: any) {
    const newDay: any = [];
    for (var i = 0; i < currentDay.length; i++) {
      newDay.push(currentDay[i] + 1);
    }
    setDays(newDay);
    handleTodaysEvents(events, newDay);
  }

  function handleSubChangeDay(currentDay: any) {
    const newDay: any = [];
    for (var i = 0; i < currentDay.length; i++) {
      newDay.push(currentDay[i] - 1);
    }
    setDays(newDay);
    handleTodaysEvents(events, newDay);
  }

  function handleDatePicked(date: any) {
    if (
      moment().format("YYYY, DD, MM") === moment(date).format("YYYY, DD, MM")
    ) {
      setDays(immutableDays);
      setScheduleDay(1);
      setScheduleDate(moment().format("YYYY-MM-DD"));
      handleTodaysEvents(events, immutableDays);
    } else {
      var date1 = moment();
      var date2 = moment(date);
      var diff = date2.diff(date1, "days");
      if (diff < 0) {
        const newDay: any = [];
        for (var j = 0; j < immutableDays.length; j++) {
          newDay.push(immutableDays[j] + diff);
        }
        setDays(newDay);
        setScheduleDay(diff + 1);
        setScheduleDate(
          moment().subtract(Math.abs(diff), "days").format("YYYY-MM-DD")
        );
        handleTodaysEvents(events, newDay);
      } else {
        const newDay: any = [];
        for (var k = 0; k < immutableDays.length; k++) {
          newDay.push(immutableDays[k] + diff + 1);
        }
        setDays(newDay);
        setScheduleDay(diff + 2);
        setScheduleDate(
          moment()
            .add(Math.abs(diff + 1), "days")
            .format("YYYY-MM-DD")
        );
        handleTodaysEvents(events, newDay);
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
  }, [show]);

  function handleTimeLine(id: any, event: any) {
    function handleIcon(tag: any) {
      if (tag === "Group Class") {
        return "group";
      } else if (tag === "One-On-One") {
        return "pt";
      } else {
        return "classic";
      }
    }
    return (
      <VerticalTimelineElement
        key={id}
        className="vertical-timeline-element--work"
        contentStyle={{
          padding: "5px 24px 5px 24px",
          color: "black",
          borderTop: "4px solid #1e90ff",
          backgroundColor: "rgba(211,211,211, 0.8)",
        }}
        contentArrowStyle={{ borderRight: "7px solid  rgba(211,211,211,0.8)" }}
        date={`${moment(event.start_time, "hh:mm a").format(
          "hh:mm a"
        )} - ${moment(event.end_time, "hh:mm a").format("hh:mm a")}`}
        iconStyle={{
          background: "rgba(33, 150, 243)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        icon={
          <img
            src={`/assets/${handleIcon(event.tag)}-schedule.svg`}
            alt="classical"
          />
        }
      >
        <div className="text-center">
          <Row>
            <Col lg={12} xs={12}>
              <h5>
                {event.activity === null
                  ? event.workout.workouttitle
                  : event.activity.title}
              </h5>
              <Badge variant="info">{event.tag}</Badge>{" "}
              {event.tag !== "Classic" && (
                <Badge
                  variant={event.mode === "Offline" ? "danger" : "success"}
                >
                  {event.mode}
                </Badge>
              )}
            </Col>
          </Row>
          <Row>
            <Col lg={6} xs={6} className="mt-2">
              <Button variant="success">
                {event.mode === "Offline" ? "Navigate" : "Join Now"}
              </Button>
            </Col>
            <Col lg={6} xs={6} className="mt-2">
              <Button
                style={{
                  backgroundColor: "purple",
                  border: "1px solid purple",
                }}
                onClick={() => {
                  window.location.href = `/roster/${event.id}`;
                }}
              >
                Roster
              </Button>
            </Col>
          </Row>
        </div>
      </VerticalTimelineElement>
    );
  }

  function handleTimeUpdate(val: any) {
    setScheduleDay(val);
    setScheduleDate(
      moment()
        .add(val - 1, "days")
        .format("YYYY-MM-DD")
    );
  }

  if (!show)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="secondary" />
        <h5 className="mt-5">
          <b>Please wait while we load your Schedule for the day...</b>
        </h5>
      </div>
    );
  else
    return (
      <>
        <div>
          <Row className="mb-3 mt-3">
            <Col>
              <div className="text-center">
                <input
                  min={moment().subtract(3, "months").format("YYYY-MM-DD")}
                  max={moment().add(3, "months").format("YYYY-MM-DD")}
                  className="p-1 rounded shadow-sm mb-3"
                  type="date"
                  style={{
                    border: "none",
                    backgroundColor: "rgba(211,211,211,0.8)",
                  }}
                  value={scheduleDate}
                  onChange={(e) => handleDatePicked(e.target.value)}
                />{" "}
                <br />
                <span
                  onClick={() => {
                    handleTimeUpdate(scheduleDay - 1);
                    handleSubChangeDay(days);
                  }}
                  className="rounded-circle"
                >
                  <i className="fa fa-chevron-left mr-5"></i>
                </span>
                <span>
                  <b>
                    {moment().format("YYYY-MM-DD") === scheduleDate
                      ? "Today"
                      : moment(scheduleDate).format("DD MMM, YY")}
                  </b>
                </span>
                <span
                  onClick={() => {
                    handleTimeUpdate(scheduleDay + 1);
                    handleAddChangeDay(days);
                  }}
                >
                  <i className="fa fa-chevron-right ml-5"></i>
                </span>
              </div>
            </Col>
          </Row>
          {todaysEvents.length === 0 ? (
            <div className="text-center mt-5">
              <h5>No Schedule For Today</h5>
            </div>
          ) : (
            <Row>
              <VerticalTimeline lineColor={"rgb(128,128,128)"}>
                {todaysEvents.map((event, index) => {
                  return handleTimeLine(index, event);
                })}
                <VerticalTimelineElement
                  iconStyle={{
                    background: "rgb(16, 204, 82)",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  icon={<i className="fa fa-star" />}
                />
              </VerticalTimeline>
            </Row>
          )}
        </div>
      </>
    );
};

export default DayView;
