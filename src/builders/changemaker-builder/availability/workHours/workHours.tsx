import React, { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
  Form,
  FormControl,
  InputGroup,
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
  CREATE_CHANGEMAKER_HOLIDAY,
  UPDATE_USER_DATA,
} from "../../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";

import { flattenObj } from "../../../../components/utils/responseFlatten";

const WorkHours = () => {
  const auth = useContext(AuthContext);
  const [value, onChange] = useState(new Date());
  const [rangeValue, rangeOnChange] = useState([new Date(), new Date()]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [desc, setDesc] = useState("");
  const [holidays, setHolidays] = useState<any>([]);
  const [month, setMonth] = useState(0);
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [masterSettings, setMasterSettings] = useState<any>([]);
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

  useQuery(GET_USER_WEEKLY_CONFIG, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setMasterSettings(flattenData.usersPermissionsUsers);
    },
  });

  const [createChangeMakerHoliday] = useMutation(CREATE_CHANGEMAKER_HOLIDAY);
  const [updateUserData] = useMutation(UPDATE_USER_DATA);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function handleAddHoliday(date: any, event: any) {
    createChangeMakerHoliday({
      variables: {
        date: `${moment(date).format("YYYY-MM-DD")}`,
        description: desc,
        users_permissions_user: auth.userid,
      },
    });
    setDesc("");
    setDate(moment().format("YYYY-MM-DD"));
  }

  function tileDisabled({ date, view }) {
    if (view === "month") {
      return holidays?.find(
        (dDate) =>
          moment(dDate.date).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      );
    }
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

  const changeMakerWeeklySchedule: any = [];

  function handleCheckBoxes() {
    var values: any = document.querySelectorAll('[name="holiday-checkbox"]');
    for (var i = 0; i <= 6; i++) {
      changeMakerWeeklySchedule.push({
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
  }

  function handleToast() {
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }

  function convertToMoment(time: string) {
    var timeSplit = time.split(":").map(Number);
    return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
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
                {holidays?.map((item, index) => {
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
                              <span>{moment().format("hh:mm a")}</span>
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
                              <span>{moment().format("hh:mm a")}</span>
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
                          <span>Online</span>
                        </div>
                      </Col>
                      <Col lg={1}>
                        <div className="ml-5">
                          <Form>
                            <Form.Check
                              type="switch"
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
                  <TimePicker
                    value={convertToMoment("2:15")}
                    showSecond={false}
                    minuteStep={15}
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  {/* </div> */}
                </Col>
                <Col lg={2}>To</Col>
                <Col lg={5}>
                  {/* <div className="shadow-sm" style={{ border: '1px solid gray',backgroundColor: 'whitesmoke', padding: '5px', borderRadius: '10px'}}> */}
                  <TimePicker
                    value={convertToMoment("2:15")}
                    showSecond={false}
                    minuteStep={15}
                    onChange={(e) => {
                      console.log(e);
                    }}
                  />
                  {/* </div> */}
                </Col>
              </Row>
            </Col>
            <Col lg={2} className="pl-0 pr-0">
              <Form.Control as="select">
                <option>Select Mode</option>
                <option value="offline">Online</option>
                <option value="online">Offline</option>
                <option value="hybrid">Hybrid</option>
              </Form.Control>
            </Col>
            <Col lg={1}>
              <button
                className="pl-3 pr-3 pt-1 pb-1 shadow-lg"
                style={{ backgroundColor: "#647a8c", borderRadius: "10px" }}
                onClick={() => {
                  handleAddHoliday(date, desc);
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
                {daysOfWeek.map((day) => {
                  return (
                    <>
                      <Form.Check
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
                  setShowDatesModal(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="success"
                disabled={desc === "" ? true : false}
                onClick={() => {
                  handleCustomDates(desc, rangeValue);
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
