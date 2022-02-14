import React, { useState, useContext } from "react";
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
  DELETE_CHANGEMAKER_HOLIDAY,
  UPDATE_USER_DATA,
} from "../../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import "./styles.css";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";

const Holidays = () => {
  const auth = useContext(AuthContext);
  const [value, onChange] = useState(new Date());
  const [rangeValue, rangeOnChange] = useState([new Date(), new Date()]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [desc, setDesc] = useState("");
  const [holidays, setHolidays] = useState<any>([]);
  const [month, setMonth] = useState(0);
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [masterSettings, setMasterSettings] = useState<any>([]);
  const [toast, setToast] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");


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
      const flattenData = flattenObj({...data});
      setHolidays(flattenData.changemakerHolidays);
    },
  });
  useQuery(GET_USER_WEEKLY_CONFIG, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({...data})
      setMasterSettings(
        flattenData.usersPermissionsUsers[0]
      );
    },
  });

  const [createChangeMakerHoliday] = useMutation(CREATE_CHANGEMAKER_HOLIDAY);
  const [deleteChangeMakerHoliday] = useMutation(DELETE_CHANGEMAKER_HOLIDAY);
  const [updateUserData] = useMutation(UPDATE_USER_DATA);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function loadMasterSettings(data: any) {
    var values: any = document.querySelectorAll('[name="holiday-checkbox"]');
    if (data?.Changemaker_weekly_schedule !== null && data !== undefined) {
      for (var i = 0; i <= 6; i++) {
        if (data?.Changemaker_weekly_schedule[i]?.is_holiday) {
          values[i].checked = true;
        }
      }
    }
  }

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

  function handleDeleteHoliday(id: any) {
    deleteChangeMakerHoliday({ variables: { id: id } });
  }

  function tileDisabled({ date, view }) {
    if (view === "month") {
      return holidays?.find(
        (dDate) =>
          moment(dDate.date).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      );
    }
    // if(masterSettings !== null){
    //     return masterSettings.find(val => val.is_holiday ? date.getDay() === val.id : false);
    // }
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
    if (masterSettings === undefined || masterSettings.Changemaker_weekly_schedule === null) {
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

  return (
    <>
      <div style={{ textAlign: "end" }}>
        <DropdownButton variant="info" title="Master Settings" drop="left">
          <Dropdown.Item
            eventKey="1"
            onClick={() => {
              setShowDaysModal(true);
              setTimeout(() => {
                loadMasterSettings(masterSettings);
              }, 200);
            }}
          >
            Days
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="2"
            onClick={() => {
              setShowDatesModal(true);
            }}
          >
            Date
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div
        style={{ borderRadius: "20px" }}
        className="text-center mt-3 p-5 shadow-lg"
      >
        <Row style={{ borderBottom: "3px solid gray" }}>
          <Col lg={4}>
            <h5>Calender</h5>
          </Col>
          <Col lg={2}>
            <h5>Date</h5>
          </Col>
          <Col lg={5}>
            <h5>Description</h5>
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
                  action === "next" ? setMonth(month + 1) : setMonth(month - 1);
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
                  <Row key={index} className="mt-3 pt-1 pb-1">
                    <Col lg={3}>
                      <div
                        className="shadow-sm"
                        style={{
                          border: "1px solid gray",
                          backgroundColor: "whitesmoke",
                          padding: "5px",
                          borderRadius: "10px",
                        }}
                      >
                        <span>
                          {moment(item.date).format("Do MMM, YYYY")}
                        </span>
                      </div>
                    </Col>
                    <Col lg={7}>
                      <div
                        style={{
                          textAlign: "start",
                          minWidth: "100%",
                          border: "1px solid gray",
                          backgroundColor: "whitesmoke",
                          padding: "5px",
                          borderRadius: "10px",
                        }}
                      >
                        <span>{item.description}</span>
                      </div>
                    </Col>
                    <Col lg={1}>
                      <img
                        style={{ cursor: "pointer", marginLeft: "70px" }}
                        src="/assets/delete.svg"
                        alt="delete"
                        onClick={() => {
                          setConfirmModal(true);
                          setDeleteItem(item.id);
                        }}
                      />
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
          <Col lg={{ span: 2, offset: 4 }}>
            <input
              type="date"
              value={date}
              className="p-1 shadow-lg"
              style={{ border: "1px solid gray", borderRadius: "10px" }}
              onChange={(e) => setDate(e.target.value)}
            />
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
              <Alert variant={"success"}>Successfully Added Holiday!</Alert>
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
              variant="danger"
              onClick={() => {
                setShowDaysModal(false);
              }}
            >
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => {
                handleCheckBoxes();
                setShowDaysModal(false);
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
      {
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={showConfirmModal}
          centered
        >
          <Modal.Header
            closeButton
            onHide={() => {
              setConfirmModal(false);
            }}
          >
            <Modal.Title id="contained-modal-title-vcenter">
              Do you want to delete this holiday?
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
                handleDeleteHoliday(deleteItem);
                setConfirmModal(false);
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

export default Holidays;
