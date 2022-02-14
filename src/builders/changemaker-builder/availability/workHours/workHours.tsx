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
} from "../../graphql/queries";
import {
  UPDATE_USER_DATA,
  UPDATE_USER_BOOKING_TIME
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

  useQuery(GET_ALL_CHANGEMAKER_HOLIDAYS, {
    variables: {
      dateLowerLimit: `${moment()
        .endOf("month")
        .add(month, "month")
        .format("YYYY-MM-DD")}`,
      dateUpperLimit: `${moment()
        .startOf("month")
        .add(month, "month")
        .format("YYYY-MM-DD")}`,
      id: auth.userid,
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setHolidays(flattenData.changemakerHolidays);
    },
  });

  function handleTodaysSlots(settings: any){
    var today = moment().format("dddd");
    var values: any;
    
    for(var i=0; i<settings?.length; i++){
      if(today === settings[i].day){
        values = settings[i].slots;
      }
    }
    setSlots(values);
  }

  useQuery(GET_USER_WEEKLY_CONFIG, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setMasterSettings(flattenData.usersPermissionsUsers);
      handleTodaysSlots(flattenData.usersPermissionsUsers[0].Changemaker_weekly_schedule);
    },
  });

  const [updateUserData] = useMutation(UPDATE_USER_DATA);
  const [updateUserBookingTime] = useMutation(UPDATE_USER_BOOKING_TIME);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function tileDisabled({ date, view }) {
    if (view === "month") {
      return holidays?.find(
        (dDate) =>
          moment(dDate.date).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      );
    }
  }

  function handleBookingTimeUpdate(newOnline: number, newOffline: number) {
    console.log(newOnline, newOffline);
    console.log(auth.userid);
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

  function handleTimeSlot(val: any){
    const values = slots.map(elem => {
      return Object.assign({}, elem, slots[elem]);
    });
    values[val].isDisabled = !values[val].isDisabled;
    setSlots(values); 
  }

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


  function handleWorkTime(fromTime: any, toTime: any, mode: any) {
    for(var i=0; i<masterSettings[0].Changemaker_weekly_schedule.length; i++){
      if(masterSettings[0].Changemaker_weekly_schedule[i].day === moment().format("dddd")){
        const values = [...masterSettings[0].Changemaker_weekly_schedule[i].slots];
        values.push({
          "to": toTime,
          "from": fromTime,
          "mode": mode,
          "isDisabled": false
        });
        handleScheduleUpdate(values);
      }
    }
  }

  function handleScheduleUpdate(val: any){
    const values = [...masterSettings[0].Changemaker_weekly_schedule];

    let updatedUserConfig: any = [];
    let obj: any = {};
    for (var i = 0; i < values.length; i++) {
      if(values[i].day === moment().format("dddd")){
        obj.id = values[i].id;
        obj.day = values[i].day;
        obj.is_holiday = values[i].is_holiday;
        obj.slots = val;
        updatedUserConfig.push(obj);
        obj = {};
      }else {
        obj.id = values[i].id;
        obj.day = values[i].day;
        obj.is_holiday = values[i].is_holiday;
        obj.slots = values[i].slots;
        updatedUserConfig.push(obj);
        obj = {};
      }
    }
    updateUserData({
      variables: {
        id: auth.userid,
        changemaker_weekly_schedule: updatedUserConfig,
      },
    });
  }


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
              <h5>Toggle</h5>
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
                              <span>{item.from}</span>
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
                              <span>{item.to}</span>
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
                        <div className="ml-5">
                          <Form>
                            <Form.Check
                              type="switch"
                              checked={item.isDisabled}
                              onChange={(e) => {handleTimeSlot(index)}}
                              id={`custom-switch-${index}`}
                            />
                          </Form>
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={{ span: 8, offset: 4 }}>
              <Row style={{ borderTop: "3px solid gray" }}></Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={{ span: 5, offset: 4 }}>
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
                  handleWorkTime(fromTime, toTime, classMode);
                  setToast(true);
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
          <Row style={{ textAlign: "start" }}>
            <Col lg={4}>
              <span>Clients can book session time prior to?</span>
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
            size="sm"
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
            <Modal.Body>
              <div className="text-center">
                <span>
                  <b>Select Days for Holidays</b>
                </span>
              </div>
              <Form className="mt-3">
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
              </Form>
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
      </>
    );
};

export default WorkHours;
