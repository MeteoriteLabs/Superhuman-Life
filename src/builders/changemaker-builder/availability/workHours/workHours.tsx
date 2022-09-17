import React, { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  Form,
  Alert,
  FormControl,
  InputGroup,
  Spinner
} from "react-bootstrap";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  GET_USER_WEEKLY_CONFIG,
  GET_ALL_CHANGEMAKER_AVAILABILITY_WORKHOURS,
  GET_ALL_CHANGEMAKER_AVAILABILITY,
  GET_CHANGEMAKER_AVAILABILITY_AND_TAGS
} from "../../graphql/queries";
import {
  UPDATE_USER_BOOKING_TIME,
  UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS,
  CREATE_CHANGEMAKER_AVAILABILITY_WORKHOURS,
  CREATE_CHANGEMAKER_AVAILABILITY_HOLIDAY,
  UPDATE_CHANGEMAKER_AVAILABILITY_HOLIDAY,
  DELETE_CHANGEMAKER_AVAILABILITY_HOLIDAY
} from "../../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import './styles.css';

import { flattenObj } from "../../../../components/utils/responseFlatten";

const configTemplate: any = {
  "Sunday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Monday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Tuesday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Wednesday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Thursday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Friday": {
    isHoliday: false,
    slots: [],
    desc: ""
  },
  "Saturday": {
    isHoliday: false,
    slots: [],
    desc: ""
  }
};

const WorkHours = () => {
  const auth = useContext(AuthContext);
  const [value, onChange] = useState(new Date());
  const [holidays, setHolidays] = useState<any>([]);
  const [month, setMonth] = useState(0);
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showDatesRangeModal, setShowDatesRangeModal] = useState(false);
  const [masterSettings, setMasterSettings] = useState<any>([]);
  const [slots, setSlots] = useState<any>([]);
  const [toast, setToast] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [allChangeMakerHolidays, setAllChangeMakerHolidays] = useState<any>([]);
  const [errModal, setErrModal] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().add(1, 'months').format("YYYY-MM-DD"));
  const [userConfig, setUserConfig] = useState<any>(configTemplate);
  const [checkState, setCheckState] = useState(false);
  const [holidayCheckState, setHolidayCheckState] = useState(false);
  const [dayHoliday, setDayHoliday] = useState(false);
  const [desc, setDesc] = useState("");
  const [rangeValue, rangeOnChange] = useState([new Date(), new Date()]);
  const [slotsValidation] = useState<any>([]);
  const [conflictSlots, setConflictSlots] = useState<any>([]);
  // const [sessions, setSessions] = useState<any>([]);
  const [availability, setAvailability] = useState<any>([]);
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("00:00");
  const [disableAdd, setDisableAdd] = useState(false);
  const [classMode, setClassMode] = useState("");

  useEffect(() => {
    setDate(moment(value).format("YYYY-MM-DD"));
  }, [value]);

  useEffect(() => {
    if (holidays.length > 0) {
      setHolidayCheckState(holidays[0]?.Is_Holiday);
      setCheckState(holidays[0]?.Is_Holiday);
      setDesc(holidays[0]?.holiday_title);
    } else {
      setCheckState(false);
      setHolidayCheckState(false);
      setDesc("");
    }
  }, [holidays]);

  const mainQuery = useQuery(GET_CHANGEMAKER_AVAILABILITY_AND_TAGS, {
    variables: {
      date: date,
      id: auth.userid,
      changemakerDate: date
    },
    onCompleted: (data: any) => {
      const flattenData = flattenObj({ ...data });
      setAvailability(flattenData.changemakerAvailabilties);
      // setSessions(flattenData.sessions);
      const changemakerSlots = flattenData.changemakerAvailabilties.length > 0 ? flattenData.changemakerAvailabilties[0]?.booking_slots : [];
      const sessionSlots = flattenData?.sessions;
      const mergedSlots = sessionSlots?.concat(changemakerSlots);
      // debugger;
      // console.log(mergedSlots);
      // setAllChangeMakerHolidays(mergedSlots.filter((item: any) => item?.Is_Holiday === true));
      setSlots(mergedSlots);
    }
  })

  // useQuery(GET_SLOTS_TO_CHECK, {
  //   skip: (!showDaysModal),
  //   variables: {
  //     id: auth.userid,
  //     dateUpperLimit: startDate,
  //     dateLowerLimit: endDate
  //   },
  //   onCompleted: (data) => {
  //     const flattenData = flattenObj({...data});
  //     setSlotsValidation(flattenData);
  //   }
  // });

  // useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
  //   variables: {
  //     id: auth.userid,
  //     type_in: ["One-On-One", "Group Class", "Custom", "Live Stream Channel", "Cohort"],
  //     date: moment(value).format("YYYY-MM-DD"),
  //   },
  //   onCompleted: (data) => {
  //     LoadProgramEvents(data);
  //   },
  // });

  useQuery(GET_ALL_CHANGEMAKER_AVAILABILITY_WORKHOURS, {
    variables: {
      date: moment(value).format("YYYY-MM-DD"),
      id: auth.userid,
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setHolidays(flattenData.changemakerAvailabilties);
    },
  });

  useQuery(GET_ALL_CHANGEMAKER_AVAILABILITY, {
    variables: {
      id: auth.userid,
      limit: moment(endDate).diff(moment(startDate), 'days') + 1,
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setAllChangeMakerHolidays(flattenData.changemakerAvailabilties);
    },
  });

  function handleTodaysSlots(todaysEvents: any, changeMakerAvailability: any) {
    const currentDateWorkHours = changeMakerAvailability[0]?.booking_slots?.length > 0 ? [...changeMakerAvailability[0]?.booking_slots] : [];

    const values = todaysEvents.concat(currentDateWorkHours);
    values.sort((a: any, b: any) => {
      var btime1: any = moment(a.start_time, "HH:mm a");
      var btime2: any = moment(b.start_time, "HH:mm a");
      return btime1 - btime2;
    });
    setSlots(values);
  }

  // function LoadProgramEvents(data: any) {
  //   const flattenData = flattenObj({ ...data });
  //   setAvailability(flattenData.changemakerAvailabilties);
  //   var sortedPrograms: any = [];
  //   var Values: any = {};
  //   for (var i = 0; i < flattenData.clientPackages.length; i++) {
  //       if (flattenData.clientPackages[i].program_managers.length !== 0) {
  //       if (flattenData.clientPackages[i].fitnesspackages[0].fitness_package_type.type === "Group Class") {
  //           for (var j = 0; j < flattenData.clientPackages[i].program_managers[0].fitnessprograms.length; j++) {
  //           Values.effectiveDate = flattenData.clientPackages[i].program_managers[0].fitnessprograms[j].start_dt;
  //           Values.program = flattenData.clientPackages[i].program_managers[0].fitnessprograms[j];
  //           sortedPrograms.push(Values);
  //           Values = {};
  //           }
  //       } else {
  //           for (var k = 0; k < flattenData.clientPackages[i].program_managers[0].fitnessprograms.length; k++) {
  //           Values.effectiveDate = flattenData.clientPackages[i].effective_date.substring(0,flattenData.clientPackages[i].effective_date.indexOf("T"));
  //           Values.program = flattenData.clientPackages[i].program_managers[0].fitnessprograms[k];
  //           sortedPrograms.push(Values);
  //           Values = {};
  //           }
  //       }
  //       }
  //   }
  //   handleDuplicates(sortedPrograms, flattenData.changemakerAvailabilties);
  //   }

  /* eslint-disable */
  function handleDuplicates(sortedPrograms: any, changeMakerAvailability: any) {
    if (sortedPrograms.length > 0) {
      const values = [...sortedPrograms];
      for (var i = 0; i < values.length; i++) {
        for (var j = i + 1; j < values.length - 1; j++) {
          if (values[i].program.id === values[j].program.id) {
            values.splice(j, 1);
          }
        }
      }
      handleCurrentDate(values, changeMakerAvailability);
    }
  }

  function handleCurrentDate(data: any, changeMakerAvailability: any) {
    const currentDay: any = [];
    for (var i = 0; i < data?.length; i++) {
      var date1 = moment();
      var date2 = moment(data[i].effectiveDate);
      var diff = date1.diff(date2, "days");
      currentDay.push(diff);
    }
    handleTodaysEvents(data, currentDay, changeMakerAvailability);
  }

  function handleTodaysEvents(data: any, currentDay: any, changeMakerAvailability: any) {
    const todaysPrograms: any = [];
    for (var i = 0; i < data?.length; i++) {
      for (var j = 0; j < data[i]?.program.events?.length; j++) {
        if (currentDay[i] === parseInt(data[i].program.events[j].day) && data[i].program.events[j].type === "workout") {
          todaysPrograms.push(data[i].program.events[j]);
        }
      }
    }
    handleTodaysSlots(todaysPrograms, changeMakerAvailability);
  }

  useQuery(GET_USER_WEEKLY_CONFIG, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setMasterSettings(flattenData.usersPermissionsUsers);
    },
  });

  const [updateUserBookingTime] = useMutation(UPDATE_USER_BOOKING_TIME);
  const [updateChangemakerAvailabilityWorkHour] = useMutation(UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS, { onCompleted: () => { mainQuery.refetch(); setFromTime("00:00"); setToTime("00:00"); setClassMode("none") } });
  const [createChangemakerAvailabilityWorkHour] = useMutation(CREATE_CHANGEMAKER_AVAILABILITY_WORKHOURS, { onCompleted: () => { mainQuery.refetch(); setFromTime("00:00"); setToTime("00:00"); setClassMode("none") } });
  const [createChangeMakerHoliday] = useMutation(CREATE_CHANGEMAKER_AVAILABILITY_HOLIDAY);
  const [updateChangemakerAvailabilityHoliday] = useMutation(UPDATE_CHANGEMAKER_AVAILABILITY_HOLIDAY);
  const [deleteChangemakerAvailabilityHoliday] = useMutation(DELETE_CHANGEMAKER_AVAILABILITY_HOLIDAY, {
    onCompleted: () => {
      setDeleteToast(true);
    }
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function tileDisabled({ date, view }) {
    const values = allChangeMakerHolidays.filter((item: any) => item.Is_Holiday === true);
    if (view === "month") {
      return values?.find(
        (dDate) => moment(dDate.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
      );
    }
  }

  function tileContent({ date, view }) {
    const values = allChangeMakerHolidays.filter((item: any) => item.Is_Holiday === true);
    for (var i = 0; i < values.length; i++) {
      if (moment(values[i].date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
        return 'HolidayMark';
      };
    };
  }

  function handleBookingTimeUpdate(newOnline: number, newOffline: number) {
    updateUserBookingTime({
      variables: {
        id: auth.userid,
        booking_Online_time: newOnline,
        booking_Offline_time: newOffline,
      }
    });
  }

  function handleToast() {
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }

  function handleDeleteToast() {
    setTimeout(() => {
      setDeleteToast(false);
    }, 3000);
  }

  function convertToMoment(time: string) {
    var timeSplit = time.split(":").map(Number);
    return moment().set({ "hour": timeSplit[0], "minute": timeSplit[1] });
  }

  function handleTimeConversion(time: number) {
    var val = 60 / (1 / (time / 60));
    return val;
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, []);

  function handleFromTimeInput(val: any) {
    var m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60;
    setFromTime(val.slice(0, 2) + ':' + (m === 0 ? '00' : m));
  }

  function handleToTimeInput(val: any) {
    var m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60;
    setToTime(val.slice(0, 2) + ':' + (m === 0 ? '00' : m));
  }

  function handleTimeValidation() {
    var sh = fromTime.split(":")[0];
    var sm = fromTime.split(":")[1];
    var eh = toTime.split(":")[0];
    var em = toTime.split(":")[1];

    if (fromTime !== "00:00" || toTime !== "00:00") {
      if (parseInt(sh) > parseInt(eh)) {
        return <span id="timeErr" style={{ color: 'red' }}>End Time should be greater than Start Time</span>
      } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
        return <span id="timeErr" style={{ color: 'red' }}>End Time and start Time cannot be the same</span>
      } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
        return <span id="timeErr" style={{ color: 'red' }}>End Time Cannot be lesser than Start Time</span>
      } else {
        return <span style={{ color: 'green' }}>Valid Time</span>
      }
    }
  }

  function getRandomId(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  const [slotErr, setSlotErr] = useState(false);

  function handleWorkTime(fromTime: any, toTime: any, mode: any, date: any, holidays: any) {

    const values = availability.find((item: any) => item.date === date);
    var obj: any = {};

    if (slots.length !== 0) {
      for (var i = 0; i < slots.length; i++) {
        if (moment(fromTime, 'hh:mm:ss').isSameOrAfter(moment(slots[i].start_time, 'hh:mm:ss')) && moment(fromTime, 'hh:mm:ss').isBefore(moment(slots[i].end_time, 'hh:mm:ss'))) {
          setConflictSlots([slots[i]]);
          setSlotErr(true);
          return;
        }
      }
    }

    if (values?.Is_Holiday === true) {
      setErrModal(true);
    }

    if (values) {
      if (values.Is_Holiday === false) {
        obj.id = getRandomId(10);
        obj.start_time = fromTime;
        obj.end_time = toTime;
        obj.mode = mode;
        const userData = values.booking_slots !== null ? [...values.booking_slots] : [];
        userData.push(obj);
        updateChangemakerAvailabilityWorkHour({
          variables: { id: values.id, slots: userData }
        });
        setToast(true);
      }
    } else if (values === undefined) {
      obj.id = getRandomId(10);
      obj.start_time = fromTime;
      obj.end_time = toTime;
      obj.mode = mode;
      const userData: any = [];
      userData.push(obj);
      createChangemakerAvailabilityWorkHour({
        variables: { id: auth.userid, slots: userData, date: date }
      });
      mainQuery.refetch();
      setToast(true);
    }
  }

  useEffect(() => {
    var element = document.getElementById("timeErr");
    if (element !== null) {
      setDisableAdd(true);
    } else {
      setDisableAdd(false);
    }
  }, [fromTime, toTime]);

  const [userOfflineTime, setUserOfflineTime]: any = useState(45);
  const [userOnlineTime, setUserOnlineTime]: any = useState(45);
  const [dayIndex, setDayIndex]: any = useState(moment().weekday());
  const [confirmModal, setConfirmModal]: any = useState(false);
  const [slotId, setSlotId]: any = useState('');

  function handleDeleteWorkHour(id: any) {
    const objIndex = availability[0]?.booking_slots.findIndex((item: any) => item.id === id);

    const values = [...availability[0].booking_slots];
    values.splice(objIndex, 1);

    updateChangemakerAvailabilityWorkHour({
      variables: { id: availability[0].id, slots: values }
    });
  }

  interface NamedParameters {
    fromTime?: any,
    toTime?: any,
    classMode?: any,
    date?: any,
    dayIndex?: any,
    isHoliday?: boolean
    desc?: string,
    config: any
  }

  function handleDeleteUserConfig(dayIndex, id) {

    const objIndex = userConfig[daysOfWeek[dayIndex]].slots.findIndex((item: any) => item.id === id);
    const values = [...userConfig[daysOfWeek[dayIndex]].slots];
    values.splice(objIndex, 1);

    userConfig[daysOfWeek[dayIndex]].slots = values;

    setUserConfig(userConfig);
  }

  const [holidayErr, setHolidayErr] = useState(false);
  const [holidayConflics, setHolidayConflicts] = useState<any>([]);

  function handleUserConfigHoliday({ dayIndex, isHoliday = false, config }: NamedParameters): any {
    const val = config;
    const values = slotsValidation.changemakerAvailabilties;
    const isExisting = values.filter((item: any) => moment(item.date).format("dddd") === daysOfWeek[dayIndex]);

    if (isExisting?.length !== 0) {
      setHolidayConflicts(isExisting);
      setHolidayErr(true);
    } else {
      val[daysOfWeek[dayIndex]].isHoliday = isHoliday;
      setUserConfig(val);
    }
  }

  function handleUserConfigHolidayDesc({ dayIndex, desc = "", config }: NamedParameters): any {
    const val = config;
    if (val[daysOfWeek[dayIndex]].isHoliday === true) {
      val[daysOfWeek[dayIndex]].desc = desc;
    }
    setUserConfig(val);
    setDesc("");
  }

  const [workHourErr, setWorkHourErr] = useState(false);
  const [workHourConflict, setWorkHourConflict] = useState<any>();

  function handleUserConfig({ fromTime, toTime, classMode, date, dayIndex, isHoliday = false, desc = "", config }: NamedParameters): any {

    const val = config;
    const values = slotsValidation.changemakerAvailabilties;
    const conflict = [...conflictSlots];

    const holidayExists = values.find((item: any) => moment(item.date).format("dddd") === daysOfWeek[dayIndex] && item.Is_Holiday === true);
    if (holidayExists) {
      setWorkHourErr(true);
      setWorkHourConflict(holidayExists);
      return;
    }

    for (var i = 0; i < values.length; i++) {
      const obj = values[i]?.booking_slots !== null ? [...values[i]?.booking_slots] : [];
      if (moment(values[i].date).format('dddd') === daysOfWeek[dayIndex] && values[i].Is_Holiday === false) {
        for (var j = 0; j < obj.length; j++) {
          if (moment(fromTime, 'hh:mm:ss').isSameOrAfter(moment(obj[j].start_time, 'hh:mm:ss')) && moment(fromTime, 'hh:mm:ss').isBefore(moment(obj[j].end_time, 'hh:mm:ss'))) {
            const slotDate = { date: values[i].date };
            const obj1: any = { ...slotDate, ...obj[j] };
            conflict.push(obj1);
          } else if (val[daysOfWeek[dayIndex]]?.slots?.length !== 0) {
            for (var k = 0; k < val[daysOfWeek[dayIndex]].slots?.length; k++) {
              if (moment(fromTime, 'hh:mm:ss').isSameOrAfter(moment(val[daysOfWeek[dayIndex]]?.slots[k]?.start_time, 'hh:mm:ss')) && moment(fromTime, 'hh:mm:ss').isBefore(moment(val[daysOfWeek[dayIndex]].slots[k].end_time, 'hh:mm:ss'))) {
                const slotDate = { date: moment().format("YYYY-MM-DD") };
                const obj1: any = { ...slotDate, ...val[daysOfWeek[dayIndex]].slots[k] };
                conflict.push(obj1);
              }
            }
          }
        }
      } else {
        for (var x = 0; x < val[daysOfWeek[dayIndex]].slots?.length; x++) {
          if (moment(fromTime, 'hh:mm:ss').isSameOrAfter(moment(val[daysOfWeek[dayIndex]]?.slots[x]?.start_time, 'hh:mm:ss')) && moment(fromTime, 'hh:mm:ss').isBefore(moment(val[daysOfWeek[dayIndex]].slots[x].end_time, 'hh:mm:ss'))) {
            const slotDate = { date: moment().format("YYYY-MM-DD") };
            const obj1: any = { ...slotDate, ...val[daysOfWeek[dayIndex]].slots[x] };
            conflict.push(obj1);
          }
        }
      }
    }
    if (conflict.length !== 0) {
      setSlotErr(true);
      setConflictSlots(conflict);
      return;
    }
    var obj1: any = {};
    obj1 = {
      id: getRandomId(10),
      start_time: fromTime,
      end_time: toTime,
      mode: classMode,
    };
    val[daysOfWeek[dayIndex]].slots.push(obj1);
    setUserConfig(val);
    setDayIndex(dayIndex);
    setFromTime("00:00");
    setToTime("00:00");
    return;
  }

  function handleAddHoliday(date: any, event: any) {
    const values = availability.find((item: any) => item.date === date);
    if (values) {
      if (values.booking_slots.length > 0) {
        // set a modal to display the error
        setHolidayConflicts([values]);
        setHolidayErr(true);
      }
    } else {
      if (values.Is_holiday === false) {
        updateChangemakerAvailabilityHoliday({
          variables: {
            id: values.id,
            holiday_title: desc
          }
        })
      }
      createChangeMakerHoliday({
        variables: {
          date: `${moment(date).format("YYYY-MM-DD")}`,
          description: desc,
          users_permissions_user: auth.userid,
        },
      });
      setToast(true);
    }

    setDesc("");
    setDate(moment().format("YYYY-MM-DD"));
  }

  function handleDeleteHoliday(event: any) {
    deleteChangemakerAvailabilityHoliday({
      variables: {
        id: event[0].id
      }
    });
  }

  function handleCustomDates(data: any, date: any) {
    const diff = moment(date[1]).diff(moment(date[0]), "days") + 1;
    for (var i = 0; i < diff; i++) {
      createChangeMakerHoliday({
        variables: {
          date: `${moment(date[0]).add(i, "days").format("YYYY-MM-DD")}`,
          description: data,
          users_permissions_user: auth.userid,
        },
      });
    }
    setDesc("");
    setDate(moment().format("YYYY-MM-DD"));
  }

  function handleUserConfigSubmit(newConfig: any) {

    const range = moment(endDate).diff(moment(startDate), "days");

    for (var i = 0; i < daysOfWeek.length; i++) {
      if (newConfig[daysOfWeek[i]].isHoliday === false && newConfig[daysOfWeek[i]].slots.length === 0) {
        continue;
      } else if (newConfig[daysOfWeek[i]].isHoliday === true) {
        for (var j = 0; j < range; j++) {
          if (moment(startDate).add(j, "days").format('dddd') === daysOfWeek[i]) {
            /* eslint-disable */
            const obj = slotsValidation.changemakerAvailabilties.filter((item: any) => moment(item.date).format('dddd') === moment(startDate).add(j, "days").format('dddd'));
            if (obj.length > 0) {
              for (var x = 0; x < obj.length; x++) {
                updateChangemakerAvailabilityHoliday({
                  variables: {
                    id: obj[x].id,
                    title: newConfig[daysOfWeek[i]].desc
                  }
                });
              }
            } else {
              createChangeMakerHoliday({
                variables: {
                  date: `${moment(startDate).add(j, "days").format("YYYY-MM-DD")}`,
                  description: newConfig[daysOfWeek[i]].desc,
                  users_permissions_user: auth.userid,
                },
              });
            }
          }
        }
      } else {
        for (var k = 0; k < range; k++) {
          if (moment(startDate).add(k, "days").format('dddd') === daysOfWeek[i]) {
            /* eslint-disable */
            const obj = slotsValidation.changemakerAvailabilties.filter((item: any) => moment(item.date).format('dddd') === moment(startDate).add(j, "days").format('dddd'));
            if (obj.length > 0) {
              for (var y = 0; y < obj.length; y++) {
                const oldSlots = [...obj[y].booking_slots];
                const newSlots = [...oldSlots, ...newConfig[daysOfWeek[i]].slots];
                updateChangemakerAvailabilityWorkHour({
                  variables: { id: obj[y].id, slots: newSlots }
                });
              }
            } else {
              createChangemakerAvailabilityWorkHour({
                variables: {
                  date: `${moment(startDate).add(k, "days").format("YYYY-MM-DD")}`,
                  slots: newConfig[daysOfWeek[i]].slots,
                  id: auth.userid,
                }
              });
            }
          }
        }
      }
    }
    setShowDaysModal(false);
  }

  function findHolidayIndex(id: any){
    const obj = allChangeMakerHolidays.findIndex((item: any) => moment(item.date).format("YYYY-MM-DD") === moment(id).format("YYYY-MM-DD"));
    return obj;
  }

  console.log(holidays);

  if (!show)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <h5 className="mt-5">
          <b>Please wait while we load your Schedule...</b>
        </h5>
      </div>
    );
  else
    return (
      <>
        <Row className="mt-3">
          <Col lg={6}>
            <div style={{ textAlign: "start" }}>
              <span style={{ fontSize: "30px" }}>
                <b>{moment().format("dddd")}</b>
              </span>
              <br />
              <span style={{ fontSize: "20px" }}>
                {moment().format("MMM DD, YYYY")}
              </span>
            </div>
          </Col>
          <Col lg={6}>
            <div style={{ textAlign: "end" }}>
              <DropdownButton
                variant="info"
                title="Master Settings"
                drop="left"
              >
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => {
                    setShowDaysModal(true);
                  }}
                >
                  Work Hours
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => {
                    setShowDatesModal(true);
                  }}
                >
                  Booking Time
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => {
                    setShowDatesRangeModal(true);
                  }}
                >
                  Dates
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </Col>
        </Row>
        <div
          style={{ borderRadius: "20px" }}
          className="text-center mt-3 p-5 shadow-lg"
        >
          <Row style={{ borderBottom: "3px solid gray" }}>
            <Col lg={4}>
              <h5>Calendar</h5>
            </Col>
            <Col lg={5}>
              <h5>Slots</h5>
            </Col>
            <Col lg={2}>
              <h5>Mode</h5>
            </Col>
            <Col lg={1}>
              <h5>Edit</h5>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={4}>
              <Row style={{ justifyContent: "center" }}>
                <Calendar
                  className="disabled"
                  tileClassName={tileContent}
                  onChange={onChange}
                  onActiveStartDateChange={({ action }) => {
                    action === "next"
                      ? setMonth(month + 1)
                      : setMonth(month - 1);
                  }}
                  value={value}
                  minDate={moment().startOf('month').toDate()}
                  maxDate={moment().add(2, 'months').toDate()}
                  maxDetail="month"
                  minDetail="month"
                  next2Label={null}
                  prev2Label={null}
                />
              </Row>
            </Col>
            <Col lg={8}>
              {slots?.length === 0 && <div>You have nothing assigned for {moment(value).format("Do MMM, YYYY")}</div>}
              {holidays[0]?.date === moment().format("YYYY-MM-DD") && holidays[0]?.Is_Holiday === true && <div>You have marked today as a holiday</div>}
              {holidays[0]?.Is_Holiday === true && holidays[0]?.date !== moment().format("YYYY-MM-DD") && <div>You have marked {moment(value).format("Do MMM, YYYY")}  as a holiday</div>}
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  overflowX: "hidden",
                }}
              >
                {slots[0] !== null && slots?.map((item, index) => {
                  return (
                    <Row id={item.id} key={index} className="mt-3 pt-1 pb-1 items-center">
                      <Col lg={8}>
                        <Row>
                          <Col lg={5}>
                            <div
                              className="shadow-sm"
                              style={{
                                border: "1px solid gray",
                                backgroundColor: "whitesmoke",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              <span>{moment(item.start_time, "HH:mm").format("HH:mm")}</span>
                            </div>
                          </Col>
                          <Col lg={2}>To</Col>
                          <Col lg={5}>
                            <div
                              className="shadow-sm"
                              style={{
                                border: "1px solid gray",
                                backgroundColor: "whitesmoke",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              <span>{moment(item.end_time, "HH:mm").format("HH:mm")}</span>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} className="ml-3">
                        <div
                          style={{
                            border: "1px solid gray",
                            backgroundColor: "whitesmoke",
                            padding: "5px",
                            borderRadius: "10px",
                          }}
                        >
                          <span>{item.mode}</span>
                        </div>
                      </Col>
                      <Col lg={1}>
                        {/* <i className='fas fa-ban' style={{display: `${item.tag ? 'block' : 'none'}`, marginLeft: "50px", fontSize: '25px'}}></i> */}
                        <img
                          style={{ cursor: "pointer", marginLeft: "50px", display: `${item.tag ? 'none' : 'block'}` }}
                          src="/assets/delete.svg"
                          alt="delete"
                          onClick={() => {
                            setConfirmModal(true);
                            setSlotId(item.id);
                          }}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Row style={{ borderTop: "3px solid gray" }}></Row>
            </Col>
          </Row>
          {checkState && <Row className="mt-3 mb-3">
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  checked={checkState}
                  onClick={() => setCheckState(!checkState)}
                  id="custom-switch"
                  label="Set Holiday"
                />
              </Form>
            </Col>
            <Col lg={{ span: 1, offset: 2 }}>
              {/* <input
              type="date"
              value={date}
              className="p-1 shadow-lg"
              style={{ border: "1px solid gray", borderRadius: "10px" }}
              onChange={(e) => setDate(e.target.value)}
            /> */}
            </Col>
            <Col lg={5} className="pl-0 pr-0">
              <input
                type="text"
                className="shadow-lg p-1"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter the event"
                style={{
                  width: "100%",
                  border: "1px solid gray",
                  borderRadius: "10px",
                }}
              ></input>
              <span className="text-start"><b>Enter holiday Description above</b></span>
            </Col>
            {!holidayCheckState && <Col lg={2}>
              <Button
                className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                disabled={desc === "" ? true : false}
                style={{ borderRadius: "10px" }}
                variant="info"
                onClick={() => {
                  handleAddHoliday(date, desc);
                  handleToast();
                }}
              >
                Set Holiday
              </Button>
            </Col>}
            {holidayCheckState && <Col lg={2}>
              <Button
                className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                disabled={desc === "" ? true : false}
                style={{ borderRadius: "10px" }}
                variant="danger"
                onClick={() => {
                  handleDeleteHoliday(holidays);
                  handleDeleteToast();
                }}
              >
                Delete Holiday
              </Button>
            </Col>}
          </Row>}
          {!checkState && <Row className="mt-3 mb-3">
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  checked={checkState}
                  onClick={() => setCheckState(!checkState)}
                  id="custom-switch"
                  label="Set Holiday"
                />
              </Form>
            </Col>
            <Col lg={{ span: 2 }}>
              {/* <input
              type="date"
              value={date}
              className="p-1 shadow-lg"
              style={{ border: "1px solid gray", borderRadius: "10px" }}
              onChange={(e) => setDate(e.target.value)}
            /> */}
            </Col>
            <Col lg={{ span: 5 }}>
              <Row>
                <Col lg={5}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(fromTime)} showSecond={false} minuteStep={15} onChange={(e) => { handleFromTimeInput(moment(e).format("HH:mm")) }} />
                  {/* </div> */}
                </Col>
                <Col lg={2}>To</Col>
                <Col lg={5}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(toTime)} showSecond={false} minuteStep={15} onChange={(e) => { handleToTimeInput(moment(e).format("HH:mm")) }} />
                  {/* </div> */}
                </Col>
              </Row>
              <div className="text-center mt-2">
                {handleTimeValidation()}
              </div>
            </Col>
            <Col lg={2} className="pl-0 pr-0">
              <Form.Control as="select" onChange={(e) => { setClassMode(e.target.value) }}>
                <option value="none">Select Mode</option>
                <option value="Offline">Online</option>
                <option value="Online">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </Form.Control>
            </Col>
            <Col lg={1}>
              <Button
                className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                title={disableAdd || classMode === '' ? "please enter valid details" : ""}
                disabled={disableAdd || classMode === ''}
                style={{ borderRadius: "10px" }}
                variant="info"
                onClick={() => {
                  handleWorkTime(fromTime, toTime, classMode, date, holidays);
                  handleToast();
                }}
              >
                Add
              </Button>
            </Col>
          </Row>}
          <Row>
            <Col lg={{ span: 8, offset: 4 }}>
              <div
                className="mt-2"
                style={{ display: `${deleteToast ? "block" : "none"}` }}
              >
                <Alert variant={"danger"}>Holiday Has Been Deleted.</Alert>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={{ span: 8, offset: 4 }}>
              <div
                className="mt-2"
                style={{ display: `${toast ? "block" : "none"}` }}
              >
                <Alert variant={"success"}>Successfully Added Slot!</Alert>
              </div>
            </Col>
          </Row>
          <Row className="mt-4" style={{ textAlign: "start" }}>
            <Col lg={4}>
              <span><b>Clients can book session time prior to?</b></span>
              <br />
            </Col>
          </Row>
          <Row className="mt-3" style={{ textAlign: "start" }}>
            <Col lg={2}>
              <span>Online</span>
              <div
                className="p-2 shadow-sm mt-2"
                style={{
                  backgroundColor: "whitesmoke",
                  borderRadius: "10px",
                  border: "1px solid gray",
                }}
              >
                {handleTimeConversion(
                  masterSettings[0]?.booking_lead_time_online_mins
                )}{" "}
                mins
              </div>
            </Col>
            <Col lg={2}>
              <span>Offline</span>
              <div
                className="p-2 shadow-sm mt-2"
                style={{
                  backgroundColor: "whitesmoke",
                  borderRadius: "10px",
                  border: "1px solid gray",
                }}
              >
                {handleTimeConversion(
                  masterSettings[0]?.booking_lead_time_offline_mins
                )}{" "}
                mins
              </div>
            </Col>
          </Row>
        </div>
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={showDaysModal}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setShowDaysModal(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                Master Settings
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ "maxHeight": '500px', "overflow": "auto" }}>
              <Row className="mb-3" style={{ justifyContent: 'space-around' }}>
                <div className="text-center">
                  <Row style={{ justifyContent: 'center' }}>
                    <label>Start Date</label>
                  </Row>
                  <input
                    type="date"
                    value={startDate}
                    min={moment().format("YYYY-MM-DD")}
                    max={moment().add(1, "month").format("YYYY-MM-DD")}
                    className="p-1 shadow-sm"
                    style={{ border: "1px solid gray", borderRadius: "10px" }}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <Row style={{ justifyContent: 'center' }}>
                    <label>End Date</label>
                  </Row>
                  <input
                    type="date"
                    value={endDate}
                    min={moment().add(1, "month").format("YYYY-MM-DD")}
                    max={moment().add(1, "year").format("YYYY-MM-DD")}
                    className="p-1 shadow-sm"
                    style={{ border: "1px solid gray", borderRadius: "10px" }}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </Row>
              <div className="text-center">
                <span style={{ color: 'gray' }}>
                  *This config will be set for the duration of the dates selected
                </span>
              </div>
              <hr />
              <div className="text-center mt-3">
                <span>
                  <b>Set By Day</b>
                </span>
              </div>
              <div className="text-center">
                <span>What all day do you work on?</span>
              </div>
              <div className="text-center">
                <Row style={{ justifyContent: 'center' }}>
                  {daysOfWeek.map((item: any, index: any) => {
                    return (
                      <>
                        <Col
                          onClick={(e) => { setDayIndex(index) }}
                          key={index} lg={1}
                          style={{ cursor: 'pointer', backgroundColor: `${dayIndex === index ? '#647a8c' : ''}`, border: '1px solid black', borderRadius: '20px' }}
                          className="p-0 m-2"
                        >
                          {moment(item, "ddd").format("ddd")}
                        </Col>
                      </>
                    )
                  })}
                </Row>
              </div>
              <hr />
              <div className="text-center">
                <Row style={{ verticalAlign: 'middle' }} className="text-center">
                  <Col lg={{ offset: 4 }}>
                    <span style={{ fontSize: '25px', textDecorationLine: 'underline' }}><b>{daysOfWeek[dayIndex]}</b></span>
                  </Col>
                  <Col>
                    <Form>
                      <Form.Check
                        type="switch"
                        checked={userConfig[daysOfWeek[dayIndex]]?.isHoliday}
                        onClick={() => {
                          setDayHoliday(!dayHoliday);
                          handleUserConfigHoliday({ dayIndex: dayIndex, isHoliday: !dayHoliday, config: userConfig });
                        }}
                        id="custom"
                        label="Set Holiday"
                      />
                    </Form>
                  </Col>
                </Row>
                <div className="text-center">
                  <span><b>General Working Hours</b></span>
                </div>
                <div className="text-center">
                  <p style={{ color: 'gray' }}>Everyone will be able to book only during this duration</p>
                </div>
                {userConfig[daysOfWeek[dayIndex]]?.isHoliday &&
                  <div style={{ display: `${userConfig[daysOfWeek[dayIndex]]?.desc === "" ? 'none' : 'block'}` }}>You've marked This Day as {userConfig[daysOfWeek[dayIndex]]?.desc}</div>
                }
                {!userConfig[daysOfWeek[dayIndex]]?.isHoliday && userConfig[daysOfWeek[dayIndex]]?.slots?.map((item, index) => {
                  return (
                    <Row key={index} className="mt-3 pt-1 pb-1 items-center">
                      <Col lg={8}>
                        <Row>
                          <Col lg={5}>
                            <div
                              className="shadow-sm"
                              style={{
                                border: "1px solid gray",
                                backgroundColor: "whitesmoke",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              <span>{moment(item.start_time, "HH:mm").format("HH:mm")}</span>
                            </div>
                          </Col>
                          <Col lg={2}>To</Col>
                          <Col lg={5}>
                            <div
                              className="shadow-sm"
                              style={{
                                border: "1px solid gray",
                                backgroundColor: "whitesmoke",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              <span>{moment(item.end_time, "HH:mm").format("HH:mm")}</span>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} className="ml-3">
                        <div
                          style={{
                            border: "1px solid gray",
                            backgroundColor: "whitesmoke",
                            padding: "5px",
                            borderRadius: "10px",
                          }}
                        >
                          <span>{item.mode}</span>
                        </div>
                      </Col>
                      <Col lg={1}>
                        <div className="ml-3">
                          <img
                            style={{ cursor: "pointer" }}
                            src="/assets/delete.svg"
                            alt="delete"
                            onClick={() => {
                              handleDeleteUserConfig(dayIndex, item.id);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  );
                })}
                <Col>
                  <Row className="mt-2" style={{ borderTop: "3px solid gray" }}></Row>
                </Col>
                <Col>
                  {userConfig[daysOfWeek[dayIndex]]?.isHoliday && <Row className="mt-3">
                    <Col lg={10} className="pl-0 pr-0">
                      <input
                        type="text"
                        className="shadow-lg p-1"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Holiday description"
                        style={{
                          width: "100%",
                          border: "1px solid gray",
                          borderRadius: "10px",
                        }}
                      ></input>
                    </Col>
                    <Col lg={2}>
                      <Button
                        className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                        style={{ borderRadius: "10px" }}
                        variant="info"
                        onClick={() => {
                          handleUserConfigHolidayDesc({ dayIndex: dayIndex, desc: desc, config: userConfig });
                          // handleAddHoliday(date, desc);
                          // handleToast();
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>}
                  {!userConfig[daysOfWeek[dayIndex]]?.isHoliday && <Row className="mt-4">
                    <Col lg={3}>
                      <TimePicker value={convertToMoment(fromTime)} showSecond={false} minuteStep={15} onChange={(e) => { handleFromTimeInput(moment(e).format("HH:mm")) }} />
                    </Col>
                    <Col lg={1}>To</Col>
                    <Col lg={3}>
                      <TimePicker value={convertToMoment(toTime)} showSecond={false} minuteStep={15} onChange={(e) => { handleToTimeInput(moment(e).format("HH:mm")) }} />
                    </Col>
                    <Col lg={3}>
                      <Form.Control as="select" onChange={(e) => { setClassMode(e.target.value) }}>
                        <option value="">Select Mode</option>
                        <option value="Offline">Online</option>
                        <option value="Online">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </Form.Control>
                    </Col>
                    <Col lg={2}>
                      <Button
                        className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                        title={disableAdd || classMode === '' ? "please enter valid details" : ""}
                        disabled={classMode === ''}
                        style={{ borderRadius: "10px" }}
                        variant="info"
                        onClick={() => {
                          handleUserConfig({ fromTime: fromTime, toTime: toTime, classMode: classMode, date: date, dayIndex: dayIndex, config: userConfig });
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>}
                  {!userConfig[daysOfWeek[dayIndex]]?.isHoliday && <Row>
                    <Col lg={7}>
                      <div className="text-center mt-2">
                        {handleTimeValidation()}
                      </div>
                    </Col>
                  </Row>}
                </Col>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  // handleCheckBoxes();
                  handleUserConfigSubmit(userConfig);
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={showDatesModal}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setShowDatesModal(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                Booking Time
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <h4>
                  <b>Client can book session time prior to?</b>
                </h4>
                <Form.Group>
                  <label>Online Mode</label>
                  <div>
                    <Form.Control as="select" onChange={(e) => { setUserOnlineTime(e.target.value) }}>
                      <option value={45}>45 min</option>
                      <option value={90}>90 min</option>
                      <option value={120}>120 min</option>
                      <option value={180}>180 min</option>
                    </Form.Control>
                  </div>
                </Form.Group>
                <Form.Group>
                  <label>Offline Mode</label>
                  <div>
                    <Form.Control as="select" onChange={(e) => { setUserOfflineTime(e.target.value) }}>
                      <option value={45}>45 min</option>
                      <option value={90}>90 min</option>
                      <option value={120}>120 min</option>
                      <option value={180}>180 min</option>
                    </Form.Control>
                  </div>
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => {
                  setShowDatesModal(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  handleBookingTimeUpdate(parseInt(userOnlineTime), parseInt(userOfflineTime));
                  setShowDatesModal(false);
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={errModal}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setErrModal(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                You cannot assign work hour for the date: {date} as you have marked the date as a holiday.
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  setErrModal(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={workHourErr}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setWorkHourErr(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                You cannot assign work hour for the date: {workHourConflict?.date} as you have marked every {moment(workHourConflict?.date).format("dddd")} as a holiday.
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  setWorkHourErr(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={holidayErr}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setHolidayErr(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                You cannot mark this day as a holiday as you have slots assigned <br />
                on the following days:
                <table>
                  <tr>
                    <th className="pl-3 pr-3">Date </th>
                  </tr>
                  {holidayConflics?.map((slot, index) => {
                    return (
                      <tr key={index}>
                        <td className="pl-3 pr-3">{moment(slot.date).format("DD MMM, YYYY")}</td>
                      </tr>
                    )
                  })}
                </table>
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  setHolidayErr(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={slotErr}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setSlotErr(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                You cannot add this slot as you already have an existing slot at this time.<br />
                The Following slots are:
                <table>
                  <tr>
                    <th className="pl-3 pr-3">Date </th>
                    <th className="pl-3 pr-3">From </th>
                    <th className="pl-3 pr-3">To </th>
                    <th className="pl-3 pr-3">Mode </th>
                  </tr>
                  {conflictSlots?.map((slot, index) => {
                    return (
                      <tr key={index}>
                        <td className="pl-3 pr-3">{moment(slot.date).format("DD MMM, YYYY")}</td>
                        <td className="pl-3 pr-3">{moment(slot.start_time, "HH:mm").format("HH:mm")}</td>
                        <td className="pl-3 pr-3">{moment(slot.end_time, "HH:mm").format("HH:mm")}</td>
                        <td className="pl-3 pr-3">{slot.mode}</td>
                      </tr>
                    )
                  })}
                </table>
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  setSlotErr(false);
                  setUserConfig(userConfig);
                  setConflictSlots([]);
                  setFromTime("00:00");
                  setToTime("00:00");
                  setDayIndex(dayIndex);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={confirmModal}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setSlotErr(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                Are you sure you want to delete this slot?
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirmModal(false);
                }}
              >
                No
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setConfirmModal(false);
                  handleDeleteWorkHour(slotId);
                }}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        }
        {
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={showDatesRangeModal}
            centered
          >
            <Modal.Header
              closeButton
              onHide={() => {
                setShowDatesRangeModal(false);
              }}
            >
              <Modal.Title id="contained-modal-title-vcenter">
                Master Settings
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <h4>
                  <b>Select Dates for Holidays</b>
                </h4>
                <Row className="mt-5" style={{ justifyContent: "center" }}>
                  <Calendar
                    tileDisabled={tileDisabled}
                    onChange={rangeOnChange}
                    value={rangeValue}
                    minDetail="month"
                    maxDetail="month"
                    selectRange={true}
                    next2Label={null}
                    prev2Label={null}
                  />
                </Row>
                <div className="mt-5 ml-5 mr-5 pl-5 pr-5">
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Type New Holiday"
                      onChange={(e) => {
                        setDesc(e.target.value);
                      }}
                      value={desc}
                    />
                  </InputGroup>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={() => {
                  setShowDatesRangeModal(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="success"
                disabled={desc === "" ? true : false}
                onClick={() => {
                  handleCustomDates(desc, rangeValue);
                  setShowDatesRangeModal(false);
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        }
      </>
    );
};

export default WorkHours;