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
} from "react-bootstrap";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  GET_ALL_CHANGEMAKER_HOLIDAYS,
  GET_USER_WEEKLY_CONFIG,
  GET_ALL_CLIENT_PACKAGE_BY_TYPE,
  GET_ALL_CHANGEMAKER_AVAILABILITY_WORKHOURS,
  GET_ALL_CHANGEMAKER_AVAILABILITY
} from "../../graphql/queries";
import {
  UPDATE_USER_DATA,
  UPDATE_USER_BOOKING_TIME,
  CREATE_CANGEMAKER_WORK_HOUR,
  UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS,
  CREATE_CHANGEMAKER_AVAILABILITY_WORKHOURS
} from "../../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

import { flattenObj } from "../../../../components/utils/responseFlatten";

const WorkHours = () => {
  const auth = useContext(AuthContext);
  const [value, onChange] = useState(new Date());
  const [holidays, setHolidays] = useState<any>([]);
  const [month, setMonth] = useState(0);
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [masterSettings, setMasterSettings] = useState<any>([]);
  const [slots, setSlots] = useState<any>([]);
  const [toast, setToast] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  // const [todaysEvents, setTodaysEvents] = useState<any>([]);
  // const [userWorkHoursConfig, setUserWorkHoursConfig] = useState<any>([]);
  const [allChangeMakerHolidays, setAllChangeMakerHolidays] = useState<any>([]);
  const [errModal, setErrModal] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().add(1, 'months').format("YYYY-MM-DD"));
  const [userConfig, setUserConfig] = useState<any>([]);

  useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
    variables: {
      id: auth.userid,
      type_in: ["Personal Training", "Group Class", "Custom"],
      date: moment().format("YYYY-MM-DD"),
    },
    onCompleted: (data) => {
      LoadProgramEvents(data);
    },
  });

  useQuery(GET_ALL_CHANGEMAKER_AVAILABILITY_WORKHOURS, {
    variables: {
      date: moment().format("YYYY-MM-DD"),
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
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({...data});
      setAllChangeMakerHolidays(flattenData.changemakerAvailabilties);
    },
  });

  function handleTodaysSlots(todaysEvents: any, changeMakerAvailability: any){
    const currentDateWorkHours = changeMakerAvailability[0]?.booking_slots.length > 0 ? [...changeMakerAvailability[0]?.booking_slots] : [];

    const values = todaysEvents.concat(currentDateWorkHours);
    values.sort((a: any, b: any) => {
      var btime1: any = moment(a.startTime, "HH:mm a");
      var btime2: any = moment(b.startTime, "HH:mm a");
      return btime1 - btime2;
    });
    setSlots(values);

    // var today = moment().format("dddd");
    // var values: any;
    
    // for(var i=0; i<settings?.length; i++){
    //   if(today === settings[i].day){
    //     values = settings[i].slots;
    //   }
    // }
    // setUserWorkHoursConfig(values);
    // handleWorkHours(values, todaysSlots, todaysEvents);
  }


  // function handleWorkHours(val: any, currentWorkHours: any, todaysEvents: any){
  //   const values = val.concat(currentWorkHours);
  //   console.log(todaysEvents);
  //   console.log(values);
  //   setSlots(values);
  // }

  const [availability, setAvailability] = useState<any>([]);

  function LoadProgramEvents(data: any) {
    const flattenData = flattenObj({ ...data });
    setAvailability(flattenData.changemakerAvailabilties);
    var sortedPrograms: any = [];
    var Values: any = {};
    for (var i = 0; i < flattenData.clientPackages.length; i++) {
        if (flattenData.clientPackages[i].program_managers.length !== 0) {
        if (flattenData.clientPackages[i].fitnesspackages[0].fitness_package_type.type === "Group Class") {
            for (var j = 0; j < flattenData.clientPackages[i].program_managers[0].fitnessprograms.length; j++) {
            Values.effectiveDate = flattenData.clientPackages[i].program_managers[0].fitnessprograms[j].start_dt;
            Values.program = flattenData.clientPackages[i].program_managers[0].fitnessprograms[j];
            sortedPrograms.push(Values);
            Values = {};
            }
        } else {
            for (var k = 0; k < flattenData.clientPackages[i].program_managers[0].fitnessprograms.length; k++) {
            Values.effectiveDate = flattenData.clientPackages[i].effective_date.substring(0,flattenData.clientPackages[i].effective_date.indexOf("T"));
            Values.program = flattenData.clientPackages[i].program_managers[0].fitnessprograms[k];
            sortedPrograms.push(Values);
            Values = {};
            }
        }
        }
    }
    handleDuplicates(sortedPrograms, flattenData.changemakerAvailabilties);
    }
    
    function handleDuplicates(sortedPrograms: any, changeMakerAvailability: any){
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
        // setTodaysEvents(todaysPrograms);
    }

  useQuery(GET_USER_WEEKLY_CONFIG, {
    variables: { id: auth.userid, date: moment().format("YYYY-MM-DD"), type_in: ["Personal Training", "Group Class", "Custom"] },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setMasterSettings(flattenData.usersPermissionsUsers);
    },
  });

  const [updateUserData] = useMutation(UPDATE_USER_DATA);
  const [updateUserBookingTime] = useMutation(UPDATE_USER_BOOKING_TIME);
  // const [createChangemakerWorkHour] = useMutation(CREATE_CANGEMAKER_WORK_HOUR);
  const [updateChangemakerAvailabilityWorkHour] = useMutation(UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS);
  const [createChangemakerAvailabilityWorkHour] = useMutation(CREATE_CHANGEMAKER_AVAILABILITY_WORKHOURS);

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
    if (view === "month") {
      return allChangeMakerHolidays?.find(
        (dDate) => moment(dDate.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD") && dDate.Is_Holiday === true
      );
    }
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

  const changeMakerWeeklySchedule: any = [];

  function handleCheckBoxes() {
    var values: any = document.querySelectorAll('[name="holiday-checkbox"]');
    if (masterSettings === undefined) {
      for (var i = 0; i <= 6; i++) {
        changeMakerWeeklySchedule.push({
          id: i,
          day: values[i].value,
          is_holiday: values[i].checked,
          slots: [],
        });
      }
      updateUserData({
        variables: {
          id: auth.userid,
          changemaker_weekly_schedule: changeMakerWeeklySchedule,
        },
      });
    } else {
      const userConfig = [...masterSettings.Changemaker_weekly_schedule];
      let updatedUserConfig: any = [];
      let obj: any = {};
      for (var j = 0; j <= 6; j++) {
        obj.id = userConfig[j].id;
        obj.day = userConfig[j].day;
        if (userConfig[j].is_holiday !== values[j].checked) {
          obj.is_holiday = values[j].checked;
        } else {
          obj.is_holiday = userConfig[j].is_holiday;
        }
        obj.slots = userConfig[j].slots;
        updatedUserConfig.push(obj);
        obj = {};
      }
      updateUserData({
        variables: {
          id: auth.userid,
          changemaker_weekly_schedule: updatedUserConfig,
        },
      });
    }
  }

  function handleToast() {
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }

  const [fromTime, setFromTime]= useState("00:00"); 
  const [toTime, setToTime] = useState("00:00"); 
  const [disableAdd, setDisableAdd] = useState(false);
  const [classMode, setClassMode] = useState("");

  function convertToMoment(time: string) {
    var timeSplit = time.split(":").map(Number);
    return moment().set({"hour": timeSplit[0], "minute": timeSplit[1]});
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

  // function handleTimeSlot(val: any){
  //   const values = slots.map(elem => {
  //     return Object.assign({}, elem, slots[elem]);
  //   });
  //   values[val].is_disabled = !values[val].is_disabled;
  //   setSlots(values); 
  // }

  function handleFromTimeInput(val: any){
    var m = (Math.round(parseInt(val.slice(3,5))/15) * 15) % 60;
    setFromTime(val.slice(0,2) + ':' + (m === 0 ? '00' : m));
  }

  function handleToTimeInput(val: any){
    var m = (Math.round(parseInt(val.slice(3,5))/15) * 15) % 60;
    setToTime(val.slice(0,2) + ':' + (m === 0 ? '00' : m));
  }

  function handleTimeValidation() {
    var sh = fromTime.split(":")[0];
    var sm = fromTime.split(":")[1];
    var eh = toTime.split(":")[0];
    var em = toTime.split(":")[1];

    if(fromTime !== "00:00" || toTime !== "00:00"){
      if(parseInt(sh) > parseInt(eh)) {
          return <span id="timeErr" style={{color: 'red'}}>End Time should be greater than Start Time</span>
      }else if(parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
          return <span id="timeErr" style={{color: 'red'}}>End Time and start Time cannot be the same</span>
      }else if(parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
          return <span id="timeErr" style={{color: 'red'}}>End Time Cannot be lesser than Start Time</span>
      }else {
          return <span style={{color: 'green'}}>Valid Time</span>
      }
    }
  }

  function getRandomId(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  const [slotErr, setSlotErr] = useState(false);

  function handleWorkTime(fromTime: any, toTime: any, mode: any, date: any, holidays: any) {

    const values = allChangeMakerHolidays.find((item: any) => item.date === date);
    var obj: any = {};

    if(slots.length > 1){
      for(var i=0; i<slots.length; i++ ){
        if(moment(fromTime, 'hh:mm:ss').isSameOrAfter(moment(slots[i].startTime, 'hh:mm:ss')) && moment(fromTime, 'hh:mm:ss').isBefore(moment(slots[i].endTime, 'hh:mm:ss'))){
          setSlotErr(true);
          return;
        }
      }
    }

    if(values?.Is_Holiday === true) {
      setErrModal(true);
    }

    if(values){
      if(values.Is_Holiday === false){
        obj.id = getRandomId(10);
        obj.startTime = fromTime;
        obj.endTime = toTime;
        obj.mode = mode;
        const userData = values.booking_slots !== null ? [...values.booking_slots] : [];
        userData.push(obj);
        updateChangemakerAvailabilityWorkHour({
          variables: {id: values.id, slots: userData}
        });
        setToast(true);
      }
    }else if(values === undefined){
      obj.id = getRandomId(10);
      obj.startTime = fromTime;
      obj.endTime = toTime;
      obj.mode = mode;
      const userData: any = [];
      userData.push(obj);
      createChangemakerAvailabilityWorkHour({
        variables: {id: auth.userid, slots: userData, date: date}
      });
      setToast(true);
    }

    // createChangemakerWorkHour({
    //   variables: {
    //     date: date,
    //     From_time: fromTime + ":00.000",
    //     To_time: toTime + ":00.000",
    //     Mode: mode,
    //     users_permissions_user: auth.userid,
    //   }
    // });

    // for(var i=0; i<masterSettings[0].Changemaker_weekly_schedule.length; i++){
    //   if(masterSettings[0].Changemaker_weekly_schedule[i].day === moment().format("dddd")){
    //     const values = [...masterSettings[0].Changemaker_weekly_schedule[i].slots];
    //     values.push({
    //       "to": toTime,
    //       "from": fromTime,
    //       "mode": mode,
    //       "isDisabled": false
    //     });
    //     handleScheduleUpdate(values);
    //   }
    // }
  }

  // function handleScheduleUpdate(val: any){
  //   const values = [...masterSettings[0].Changemaker_weekly_schedule];

  //   let updatedUserConfig: any = [];
  //   let obj: any = {};
  //   for (var i = 0; i < values.length; i++) {
  //     if(values[i].day === moment().format("dddd")){
  //       obj.id = values[i].id;
  //       obj.day = values[i].day;
  //       obj.is_holiday = values[i].is_holiday;
  //       obj.slots = val;
  //       updatedUserConfig.push(obj);
  //       obj = {};
  //     }else {
  //       obj.id = values[i].id;
  //       obj.day = values[i].day;
  //       obj.is_holiday = values[i].is_holiday;
  //       obj.slots = values[i].slots;
  //       updatedUserConfig.push(obj);
  //       obj = {};
  //     }
  //   }
  //   updateUserData({
  //     variables: {
  //       id: auth.userid,
  //       changemaker_weekly_schedule: updatedUserConfig,
  //     },
  //   });
  // }


  useEffect(() => {
    var element = document.getElementById("timeErr");
    if(element !== null) {
      setDisableAdd(true);
    }else {
      setDisableAdd(false);
    }
  }, [fromTime, toTime]);

  const [userOfflineTime, setUserOfflineTime]: any = useState(45);
  const [userOnlineTime, setUserOnlineTime]: any = useState(45);
  const [dayIndex, setDayIndex]: any = useState(moment().weekday());
  const [confirmModal, setConfirmModal]: any = useState(false);
  const [slotId, setSlotId]: any = useState('');

  function handleDeleteWorkHour(id: any){
    const objIndex = availability[0]?.booking_slots.findIndex((item: any) => item.id === id);

    const values = [...availability[0].booking_slots];
    values.splice(objIndex, 1);

    updateChangemakerAvailabilityWorkHour({
      variables: {id: availability[0].id, slots: values}
    });

  }

  function handleUserConfig(fromTime: any, toTime: any, classMode: any, date: any, dayIndex: any){
    const values = [...userConfig];
    console.log(fromTime, toTime, classMode, date, dayIndex);
    var obj: any = {};
    obj.day = daysOfWeek[dayIndex];
    obj.slots = [{
      id: getRandomId(10),
      startTime: fromTime,
      endTime: toTime,
      mode: classMode,
    }];

    values.push(obj);

    setUserConfig(values);
  }

  console.log(userConfig);

  if (!show)
    return (
      <div className="mt-2" style={{ color: "red" }}>
        Loading....
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
              <h5>Calender</h5>
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
                  tileDisabled={tileDisabled}
                  onChange={onChange}
                  onActiveStartDateChange={({ action }) => {
                    action === "next"
                      ? setMonth(month + 1)
                      : setMonth(month - 1);
                  }}
                  value={value}
                  maxDetail="month"
                  minDetail="month"
                  next2Label={null}
                  prev2Label={null}
                />
              </Row>
            </Col>
            <Col lg={8}>
              <div
                style={{
                  maxHeight: "300px",
                  overflow: "auto",
                  overflowX: "hidden",
                }}
              >
                {slots?.map((item, index) => {
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
                              <span>{moment(item.startTime, "HH:mm").format("HH:mm")}</span>
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
                              <span>{moment(item.endTime, "HH:mm").format("HH:mm")}</span>
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
          <Row className="mt-3 mb-3">
          <Col lg={{ span: 2, offset: 2 }}>
            <input
              type="date"
              value={date}
              className="p-1 shadow-lg"
              style={{ border: "1px solid gray", borderRadius: "10px" }}
              onChange={(e) => setDate(e.target.value)}
            />
          </Col>
            <Col lg={{ span: 5 }}>
              <Row>
                <Col lg={5}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(fromTime)} showSecond={false} minuteStep={15} onChange={(e) => {handleFromTimeInput(moment(e).format("HH:mm"))}}/>
                  {/* </div> */}
                </Col>
                <Col lg={2}>To</Col>
                <Col lg={5}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(toTime)} showSecond={false} minuteStep={15} onChange={(e) => {handleToTimeInput(moment(e).format("HH:mm"))}}/>
                  {/* </div> */}
                </Col>
              </Row>
              <div className="text-center mt-2">
                {handleTimeValidation()}
                </div>
            </Col>
            <Col lg={2} className="pl-0 pr-0">
              <Form.Control as="select" onChange={(e) => {setClassMode(e.target.value)}}>
                <option value="">Select Mode</option>
                <option value="Offline">Online</option>
                <option value="Online">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </Form.Control>
            </Col>
            <Col lg={1}>
              <button
                className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                title={disableAdd || classMode === '' ? "please enter valid details": ""}
                disabled={disableAdd || classMode === ''}
                style={{ backgroundColor: "#647a8c", borderRadius: "10px" }}
                onClick={() => {
                  handleWorkTime(fromTime, toTime, classMode, date, holidays);
                  handleToast();
                }}
              >
                Add
              </button>
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
            <Modal.Body style={{ "maxHeight": '500px', "overflow": "auto"}}>
              <Row className="mb-3" style={{ justifyContent: 'space-around'}}>
              <div className="text-center">
                <Row style={{ justifyContent: 'center'}}>
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
                <Row style={{ justifyContent: 'center'}}>
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
                <span style={{ color: 'gray'}}>
                  *This config will be set for the duration of the dates selected
                </span>
              </div>
              <hr/>
              <div className="text-center mt-3">
                <span>
                  <b>Set By Day</b>
                </span>
              </div>
              <div className="text-center">
                <span>What all day do you work on?</span>
              </div>
              <div className="text-center">
                <Row style={{ justifyContent: 'center'}}>
                  {daysOfWeek.map((item: any, index: any) => {
                    return (
                      <>
                        <Col 
                          onClick={(e) => {setDayIndex(index)}} 
                          key={index} lg={1} 
                          style={{cursor: 'pointer', backgroundColor: `${dayIndex === index ? '#647a8c' : ''}`,border: '1px solid black', borderRadius: '20px'}} 
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
              <div className="text-center">
                <span style={{fontSize: '25px', textDecorationLine: 'underline'}}><b>{daysOfWeek[dayIndex]}</b></span>
              </div>
              <div className="text-center">
                <span><b>General Working Hours</b></span>
              </div>
              <div className="text-center">
                <p style={{color: 'gray'}}>Everyone will be able to book only during this duration</p>
              </div>
              {userConfig[0]?.slots?.map((item, index) => {
                  console.log(userConfig)
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
                              <span>{moment(item.startTime, "HH:mm").format("HH:mm")}</span>
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
                              <span>{moment(item.endTime, "HH:mm").format("HH:mm")}</span>
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
                          // setConfirmModal(true);
                          // setDeleteItem(item.id);
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
              <Row className="mt-4">
                <Col lg={3}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(fromTime)} showSecond={false} minuteStep={15} onChange={(e) => {handleFromTimeInput(moment(e).format("HH:mm"))}}/>
                  {/* </div> */}
                </Col>
                <Col lg={1}>To</Col>
                <Col lg={3}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker value={convertToMoment(toTime)} showSecond={false} minuteStep={15} onChange={(e) => {handleToTimeInput(moment(e).format("HH:mm"))}}/>
                  {/* </div> */}
                </Col>
                <Col lg={3}>
                <Form.Control as="select" onChange={(e) => {setClassMode(e.target.value)}}>
                <option value="">Select Mode</option>
                <option value="Offline">Online</option>
                <option value="Online">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </Form.Control>
                  </Col>
                <Col lg={2}>
                <button
                  className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                  title={disableAdd || classMode === '' ? "please enter valid details": ""}
                  disabled={classMode === ''}
                  style={{ backgroundColor: "#647a8c", borderRadius: "10px" }}
                  onClick={() => {
                    // handleWorkTime(fromTime, toTime, classMode, date);
                    // setToast(true);
                    // handleToast();
                    handleUserConfig(fromTime, toTime, classMode, date, dayIndex);
                  }}
                >
                  Add
                </button>
                </Col>
              </Row>
              </Col>
              </div>
              {/* <Form className="mt-3">
                {daysOfWeek.map((day, index) => {
                  return (
                    <>
                      <Form.Check
                        key={index}
                        name="holiday-checkbox"
                        type="checkbox"
                        label={day}
                        id={day}
                        value={day}
                      />
                    </>
                  );
                })}
              </Form> */}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  handleCheckBoxes();
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
                    <Form.Control as="select" onChange={(e) => {setUserOnlineTime(e.target.value)}}>
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
                    <Form.Control as="select" onChange={(e) => {setUserOfflineTime(e.target.value)}}>
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
              You cannot add this slot as you already have an existing slot at this time.
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                setSlotErr(false);
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
      </>
    );
};

export default WorkHours;
