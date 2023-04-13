import { useState, useEffect, useContext } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import SchedulerPage from "./weekScheduler";
import moment from "moment";
import { GET_ALL_WEEKLY_SESSIONOS } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { flattenObj } from "../../../components/utils/responseFlatten";

const WeekView = (props: any) => {
  const auth = useContext(AuthContext);
  const [todaysEvents, setTodaysEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState<any[]>([]);
  const [immutableDays, setSetImmutableDays] = useState<any[]>([]);
  const [immutableTimePeriod, setSetImmutableTimePeriod] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [scheduleDay, setScheduleDay] = useState(1);
  const [scheduleDate, setScheduleDate] = useState(
    moment().startOf("week").format("YYYY-MM-DD")
  );

  useQuery(GET_ALL_WEEKLY_SESSIONOS, {
    variables: {
      id: auth.userid,
      startDate: scheduleDate,
      endDate: moment(scheduleDate).add(6, "days").format("YYYY-MM-DD"),
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setTodaysEvents(flattenData.sessions);
    },
  });

  /* eslint-disable */
  function LoadData(data: any) {
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
    const timePeriod: any = [];
    for (var i = 0; i < data?.length; i++) {
      var date1 = moment();
      var date2 = moment(data[i].effectiveDate);
      var diff = date1.diff(date2, "days");
      var numberOfDaysPassed = moment()
        .clone()
        .startOf("week")
        .diff(moment(), "days");
      currentDay.push(diff - Math.abs(numberOfDaysPassed));
    }
    for (var j = 0; j < currentDay.length; j++) {
      if (currentDay[j] + 7 <= 30) {
        timePeriod.push(currentDay[j] + 6);
      } else {
        timePeriod.push(30);
      }
    }
    setEvents(data);
    setDays(currentDay);
    setSetImmutableDays(currentDay);
    setTimePeriod(timePeriod);
    setSetImmutableTimePeriod(timePeriod);
    handleDayChange(data, currentDay, timePeriod);
  }

  function handleDayChange(data: any, currentDay: any, timePeriod: any) {
    const values: any = [...data];
    var newEvent: any = {};
    var newArrayEvents: any = [];
    var newData: any = [];
    for (var i = 0; i < values?.length; i++) {
      for (var j = 0; j < values[i]?.program.events.length; j++) {
        if (
          parseInt(values[i].program.events[j].day) >= currentDay[i] &&
          parseInt(values[i].program.events[j].day) <= timePeriod[i]
        ) {
          newEvent.day =
            values[i].program.events[j].day - Math.abs(currentDay[i]) <= 0
              ? Math.abs(
                  parseInt(values[i].program.events[j].day) - currentDay[i] + 1
                )
              : Math.abs(
                  parseInt(values[i].program.events[j].day) -
                    Math.abs(currentDay[i]) +
                    1
                );
          newEvent.endTime = values[i].program.events[j].endTime;
          newEvent.startTime = values[i].program.events[j].startTime;
          newEvent.name = values[i].program.events[j].name;
          newEvent.id = values[i].program.events[j].id;
          newEvent.mode = values[i].program.events[j].mode;
          newEvent.type = values[i].program.events[j].type;
          newEvent.tag = values[i].program.events[j].tag;
          newArrayEvents.push(newEvent);
          newEvent = {};
        }
      }
      newData.push({
        effectiveDate: values[i].effectiveDate,
        events: newArrayEvents,
      });
      newArrayEvents = [];
    }
    handleTodaysEvents(newData);
    setEvents(data);
  }

  function handleTodaysEvents(data: any) {
    const todaysPrograms: any = [];
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].events?.length; j++) {
        if (
          parseInt(data[i].events[j].day) >= 1 &&
          parseInt(data[i].events[j].day) <= 7 &&
          data[i].events[j].type === "workout"
        ) {
          todaysPrograms.push(data[i].events[j]);
        }
      }
    }
    setTodaysEvents(todaysPrograms);
  }

  if (todaysEvents.length > 1) {
    todaysEvents.sort((a: any, b: any) => {
      var btime1: any = moment(a.startTime, "HH:mm a");
      var btime2: any = moment(b.startTime, "HH:mm a");
      return btime1 - btime2;
    });
  }

  function handleAddChangeDay(currentDay: any, timePeriod: any) {
    const newDay: any = [];
    const newTimePeriod: any = [];
    for (var i = 0; i < currentDay.length; i++) {
      newDay.push(currentDay[i] + 7);
    }
    for (var j = 0; j < timePeriod.length; j++) {
      newTimePeriod.push(timePeriod[j] + 7);
    }
    setDays(newDay);
    setTimePeriod(newTimePeriod);
    setScheduleDate(
      moment(scheduleDate).add(7, "days").startOf("week").format("YYYY-MM-DD")
    );
    handleDayChange(events, newDay, newTimePeriod);
  }

  function handleSubChangeDay(currentDay: any, timePeriod: any) {
    const newDay: any = [];
    const newTimePeriod: any = [];
    for (var i = 0; i < currentDay.length; i++) {
      newDay.push(currentDay[i] - 7);
    }
    for (var j = 0; j < timePeriod.length; j++) {
      newTimePeriod.push(timePeriod[j] - 7);
    }
    setDays(newDay);
    setTimePeriod(newTimePeriod);
    setScheduleDate(
      moment(scheduleDate)
        .subtract(7, "days")
        .startOf("week")
        .format("YYYY-MM-DD")
    );
    handleDayChange(events, newDay, newTimePeriod);
  }

  function handleDatePicked(date: any) {
    if (
      moment().startOf("week").format("YYYY-MM-DD") ===
      moment(date).startOf("week").format("YYYY-MM-DD")
    ) {
      setDays(immutableDays);
      setScheduleDay(1);
      setScheduleDate(moment().startOf("week").format("YYYY-MM-DD"));
      setTimePeriod(immutableTimePeriod);
      handleDayChange(events, immutableDays, immutableTimePeriod);
    } else {
      var date1 = moment().startOf("week");
      var date2 = moment(date).startOf("week");
      var diff = date2.diff(date1, "days");
      if (diff < 0) {
        const newDay: any = [];
        const newTimePeriod: any = [];
        for (var i = 0; i < immutableDays.length; i++) {
          newDay.push(immutableDays[i] + diff);
        }
        for (var j = 0; j < immutableTimePeriod.length; j++) {
          newTimePeriod.push(immutableTimePeriod[j] + diff);
        }
        setDays(newDay);
        setTimePeriod(newTimePeriod);
        setScheduleDate(moment(date).startOf("week").format("YYYY-MM-DD"));
        handleDayChange(events, newDay, newTimePeriod);
      } else {
        const newDay: any = [];
        const newTimePeriod: any = [];
        for (var k = 0; k < immutableDays.length; k++) {
          newDay.push(immutableDays[k] + diff);
        }
        for (var l = 0; l < immutableTimePeriod.length; l++) {
          newTimePeriod.push(immutableTimePeriod[l] + diff);
        }
        setDays(newDay);
        setTimePeriod(newTimePeriod);
        setScheduleDate(moment(date).startOf("week").format("YYYY-MM-DD"));
        handleDayChange(events, newDay, newTimePeriod);
      }
    }
  }

  function handleTimeUpdate(val: any) {
    setScheduleDay(val);
    setScheduleDate(
      moment()
        .add(val - 1, "days")
        .startOf("week")
        .format("YYYY-MM-DD")
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
  }, [show, todaysEvents]);

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
                    handleTimeUpdate(scheduleDay - 7);
                    handleSubChangeDay(days, timePeriod);
                  }}
                  className="rounded-circle"
                >
                  <i className="fa fa-chevron-left mr-5"></i>
                </span>
                <span>
                  <b>
                    {moment(scheduleDate).startOf("week").format("Do, MMM")} -{" "}
                    {moment(scheduleDate).endOf("week").format("Do, MMM")}
                  </b>
                </span>
                <span
                  onClick={() => {
                    handleTimeUpdate(scheduleDay + 7);
                    handleAddChangeDay(days, timePeriod);
                  }}
                >
                  <i className="fa fa-chevron-right ml-5"></i>
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <SchedulerPage
              days={7}
              assignedEvents={todaysEvents}
              startDate={scheduleDate}
            />
          </Row>
        </div>
      </>
    );
};

export default WeekView;
