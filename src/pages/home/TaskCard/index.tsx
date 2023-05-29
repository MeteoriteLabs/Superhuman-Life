import {
  Card,
  Button,
  Modal,
  Tab,
  Tabs,
  Badge,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import { GET_ALL_BOOKINGS } from "../../booking/GraphQL/queries";
import {
  GET_FITNESS,
  GET_TAGS,
} from "../../../builders/package-builder/fitness/graphQL/queries";
import authContext from "../../../context/auth-context";
import React,{ useContext, useState, useRef } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { flattenObj } from "../../../components/utils/responseFlatten";
import BookingAction from "../../booking/Movement/BookingAction";
import moment from "moment";
import "./style.css";
import { Link } from "react-router-dom";
import NoDataInCard from "../../../components/NoDataInCard";

const TaskCard: React.FC = () => {
  const auth = useContext(authContext);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [notPendingBookings, setNotPendingBookings] = useState<any[]>([]);
  const bookingActionRef = useRef<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<any>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // eslint-disable-next-line
  const { data: get_booking, refetch: refetchBookings } = useQuery(GET_ALL_BOOKINGS, {
    variables: {
      id: auth.userid,
    },
    onCompleted: (data) => loadData(data),
  });

  const sessionsObj = {};

  //offerings
  // eslint-disable-next-line
  const [tags, { data: get_tags }] = useLazyQuery(GET_TAGS, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const tagsFlattenData = flattenObj({ ...data });
      const fitnessFlattenData = flattenObj({ ...get_fitness });

      setDataTable(
        [...fitnessFlattenData.fitnesspackages].map((item) => {
          return {
            sessionsObject: tagsFlattenData.tags
              .filter(
                (currentValue) => currentValue.fitnesspackage.id === item.id
              )
              .map((curr) => {
                return curr.sessions.map((item) => {
                  sessionsObj[item.session_date] =
                    (sessionsObj[item.session_date] || 0) + 1;

                  return sessionsObj;
                });
              }),
            tagId: tagsFlattenData.tags
              .filter(
                (currentValue) => currentValue.fitnesspackage.id === item.id
              )
              .map((currentValue) => [currentValue.id]),
            tagname: tagsFlattenData.tags
              .filter(
                (currentValue) => currentValue.fitnesspackage.id === item.id
              )
              .map((currentValue) => [currentValue.tag_name]),
            id: item.id,
            packagename: item.packagename,
            type: item.fitness_package_type.type,
            details: [
              item.ptonline,
              item.ptoffline,
              item.grouponline,
              item.groupoffline,
              item.recordedclasses,
              item.duration,
              item.mode,
            ],
            duration: item.fitnesspackagepricing.map((i) => i.duration),
            mrp: item.fitnesspackagepricing.map((i) => i.mrp),
            Status: item.Status ? "Active" : "Inactive",
            publishingDate: item.publishing_date,
            mode: item.mode,
            days: item.duration,
            pricing: item.fitnesspackagepricing,
            freeClass: item.groupinstantbooking,
            startDate: item.Start_date,
            endDate: moment(item.End_date).add(1, "days"),
          };
        })
      );
    },
  });

  // eslint-disable-next-line
  const { data: get_fitness, refetch: refetchFitness } = useQuery(GET_FITNESS, {
    variables: { id: auth.userid },
    onCompleted: () => {
      tags({ variables: { id: auth.userid } });
    },
  });

  const loadData = (data: { clientBookings: any[] }) => {
    const flattenData = flattenObj({ ...data.clientBookings });

    const pendingBookingsArray = flattenData.filter(
      (currentValue) => currentValue.Booking_status === "pending"
    );

    const notPendingBookingsArray = flattenData.filter(
      (currentValue) => currentValue.Booking_status !== "pending"
    );
    setNotPendingBookings(notPendingBookingsArray);
    setPendingBookings(pendingBookingsArray);
  };

  const redirectHandler = (id, type) => {
    let name = "";
    if (type === "Classic Class") {
      name = "classic";
    } else if (type === "Live Stream Channel") {
      name = "channel";
    } else if (type === "Cohort") {
      name = "cohort";
    } else if (type === "Custom Fitness") {
      name = "custom";
    } else if (type === "One-On-One") {
      name = "pt";
    } else if (type === "On-Demand PT") {
      name = "pt";
    } else if (type === "Group Class") {
      name = "group";
    }

    window.open(`${name}/session/scheduler/${id}`, "_self");
  };

  return (
    <>
      <Card>
        <Card.Header as="h5" className="bg-dark text-light">
          Task
        </Card.Header>

        <Tabs
          defaultActiveKey="actionRequired"
          className="d-flex justify-content-center"
        >
          <Tab eventKey="actionRequired" title="Action Required">
            <div className="scrollBar pt-3 ">
              {pendingBookings &&
              pendingBookings.length === 0 &&
              dataTable &&
              dataTable.length === 0 ? (
                <NoDataInCard msg={"No pending bookings and offerings to show"}/>
              ) : null}

              {/* One-on-One and On-Demand PT */}
              {dataTable && dataTable.length
                ? dataTable
                    .filter(
                      (current) =>
                        (current.type === "One-On-One" &&
                          current.Status === "Inactive") ||
                        (current.type === "On-Demand PT" &&
                          current.Status === "Inactive") ||
                        (current.type === "Custom Fitness" &&
                          current.Status === "Inactive")
                    )
                    .map((currentValue, index: number) => (
                      <Card
                        key={index}
                        style={{
                          borderLeft: "5px solid grey",
                          borderRadius: "5px",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        <div className="col-lg-12">
                          <b>Change status for {currentValue.packagename}</b>
                          <p>
                            Please change the status to publish this offering
                          </p>
                          <p>
                            #offering #{currentValue.type} #
                            {currentValue.Status}
                          </p>

                          <Badge variant="danger" className="p-2">
                            Draft
                          </Badge>

                          <div className="d-flex justify-content-end">
                            <Link to={"/offerings"}>
                              <Button variant="success">Change Status</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))
                : null}

              {dataTable && dataTable.length
                ? dataTable
                    .filter(
                      (current) =>
                        Object.keys(current.sessionsObject).length !==
                          current.endDate.diff(current.startDate, "days") &&
                        current.type !== "One-On-One" &&
                        current.type !== "On-Demand PT" &&
                        current.type !== "Custom Fitness"
                    )
                    .map((currentValue, index: number) => (
                      <Card
                        key={index}
                        style={{
                          borderLeft: "5px solid grey",
                          borderRadius: "5px",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        <div className="col-lg-12">
                          <b>Create a program for {currentValue.packagename}</b>
                          <p>
                            Please create the whole program to publish this
                            offering
                          </p>
                          <p>#offering #{currentValue.type}</p>
                          {currentValue.tagId.length > 1 ? (
                            <Row>
                              <Col md={{ offset: 9 }}>
                                <ButtonGroup>
                                  <DropdownButton
                                    as={ButtonGroup}
                                    title="Create new"
                                    id="bg-nested-dropdown"
                                    variant="success"
                                  >
                                    {currentValue.tagId.map(
                                      (curr, index: number) => (
                                        <Dropdown.Item
                                          className="col-xs-12"
                                          key={index}
                                          eventKey={curr[index]}
                                          onClick={() => {
                                            redirectHandler(
                                              curr[index],
                                              currentValue.type
                                            );
                                          }}
                                        >
                                          Create {currentValue.tagname[index]}
                                        </Dropdown.Item>
                                      )
                                    )}
                                  </DropdownButton>{" "}
                                </ButtonGroup>
                              </Col>
                            </Row>
                          ) : (
                            <Row>
                              <Col md={{ offset: 9 }}>
                                <Button
                                  variant="success"
                                  key={index}
                                  onClick={() =>
                                    redirectHandler(
                                      currentValue.tagId[0],
                                      currentValue.type
                                    )
                                  }
                                >
                                  Create new
                                </Button>
                              </Col>
                            </Row>
                          )}
                        </div>
                      </Card>
                    ))
                : null}

              {/* Bookings in pending stage*/}
              {pendingBookings && pendingBookings.length
                ? pendingBookings.map((currentValue, index: number) => (
                    <Card
                      key={index}
                      style={{
                        borderLeft: "5px solid grey",
                        borderRadius: "5px",
                        margin: "5px",
                        padding: "5px",
                      }}
                    >
                      <div key={index}>
                        {currentValue.ClientUser.map(
                          (currentValue, index: number) => (
                            <b key={index}>{currentValue.username}</b>
                          )
                        )}{" "}
                        requested to book{" "}
                        {currentValue.fitnesspackages.map(
                          (currentElement, index: number) => (
                            <b key={index}>
                              {currentElement.fitness_package_type.type}{" "}
                            </b>
                          )
                        )}
                        <div className="d-flex space-in-between">
                          <Button
                            variant="outline-dark"
                            onClick={handleShow}
                            className="m-1"
                          >
                            Check Details
                          </Button>
                          <Button
                            variant="outline-dark"
                            onClick={handleShow}
                            className="m-1"
                          >
                            Remind me later
                          </Button>

                          <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header
                              closeButton
                              className="bg-dark text-light"
                            >
                              <Modal.Title>Booking Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div>
                                Username:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>{currentValue.username}</b>
                                  )
                                )}
                                <br />
                                Name:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>
                                      {currentValue.First_Name +
                                        " " +
                                        currentValue.Last_Name}
                                    </b>
                                  )
                                )}
                              </div>
                              <div>
                                Email:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>{currentValue.email}</b>
                                  )
                                )}
                                <br />
                                Phone no.:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>
                                      {currentValue.Phone_Number}
                                    </b>
                                  )
                                )}
                              </div>
                              <div className="p-2 shadow p-3 mb-5 bg-white rounded border">
                                <div className="d-flex">
                                  Offering:{" "}
                                  {currentValue.fitnesspackages.map(
                                    (currentElement, index: number) => (
                                      <span key={index} className="d-flex">
                                        {" "}
                                        {
                                          currentElement.fitness_package_type
                                            .type
                                        }{" "}
                                      </span>
                                    )
                                  )}
                                </div>
                                <br />
                                Duration: {currentValue.package_duration}{" "}
                                {currentValue.package_duration === 1
                                  ? "day"
                                  : "days"}
                                <br />
                                Start Date:{" "}
                                {moment(currentValue.effective_date).format(
                                  "DD MMM YYYY"
                                )}
                                <br />
                                End Date:{" "}
                                {moment(currentValue.effective_date)
                                  .add(
                                    Number(currentValue.package_duration),
                                    "days"
                                  )
                                  .format("DD MMM YYYY")}
                              </div>
                              <div className="d-flex justify-content-between">
                                Booking Status: {currentValue.Booking_status}
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                        <div className="d-flex justify-content-end">
                          <span>
                            <button
                              className="btn btn-success m-2"
                              onClick={() => {
                                bookingActionRef.current.TriggerForm({
                                  id: currentValue.id,
                                  actionType: "accept",
                                });
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger m-2"
                              onClick={() => {
                                bookingActionRef.current.TriggerForm({
                                  id: currentValue.id,
                                  actionType: "reject",
                                });
                              }}
                            >
                              Reject
                            </button>
                          </span>
                        </div>
                        <div className="d-flex">
                          <p>#{currentValue.Booking_status} </p>
                          {currentValue.fitnesspackages.map(
                            (currentElement, index: number) => (
                              <p key={index}>
                                #{currentElement.fitness_package_type.type}{" "}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                : null}
            </div>
          </Tab>

          {/* completed tab */}
          <Tab eventKey="profile" title="Completed">
            <div className="scrollBar pt-3 ">
            {notPendingBookings && notPendingBookings.length === 0 &&
              dataTable &&
              dataTable.length === 0 ? (
                <NoDataInCard msg={"No accepted / rejected bookings and offerings to show"}/>
              ) : null}
              {dataTable && dataTable.length
                ? dataTable
                    .filter(
                      (current) =>
                        (current.type === "One-On-One" &&
                          current.Status === "Active") ||
                        (current.type === "On-Demand PT" &&
                          current.Status === "Active") ||
                        (current.type === "Custom Fitness" &&
                          current.Status === "Active")
                    )
                    .map((currentValue, index: number) => (
                      <Card
                        key={index}
                        style={{
                          borderLeft: "5px solid grey",
                          borderRadius: "5px",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        <div className="col-lg-12">
                          <b>
                            Program is created for {currentValue.packagename}
                          </b>
                          <p>Program is published for this offering</p>
                          <p>
                            #offering #{currentValue.type} #
                            {currentValue.Status}
                          </p>
                          <div className="d-flex justify-content-end">
                            <Badge variant="success" className="p-2">
                              Published
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))
                : null}

              {/* sessions(offerings) */}
              {dataTable && dataTable.length
                ? dataTable
                    .filter(
                      (current) =>
                        Object.keys(current.sessionsObject).length ===
                        current.endDate.diff(current.startDate, "days")
                    )
                    .map((currentValue, index: number) => (
                      <Card
                        key={index}
                        style={{
                          borderLeft: "5px solid grey",
                          borderRadius: "5px",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        <div className="col-lg-12">
                          <b>Create a program for {currentValue.packagename}</b>
                          <p>
                            Please create the whole program to publish this
                            offering
                          </p>
                          <p>#offering #{currentValue.type}</p>
                          <Row>
                            <Col md={{ offset: 10 }}>
                              <Badge variant="success" className="p-2">
                                Published
                              </Badge>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    ))
                : null}

              {/* bookings which are booked */}
              {notPendingBookings && notPendingBookings.length
                ? notPendingBookings.map((currentValue, index: number) => (
                    <Card
                      key={index}
                      style={{
                        borderLeft: "5px solid grey",
                        borderRadius: "5px",
                        margin: "5px",
                        padding: "5px",
                      }}
                    >
                      <div key={index} className="col-lg-12">
                        {currentValue.ClientUser.map(
                          (currentValue, index) => (
                            <b key={index}>{currentValue.username}</b>
                          )
                        )}{" "}
                        requested to book{" "}
                        {currentValue.fitnesspackages.map(
                          (currentElement, index: number) => (
                            <b key={index}>
                              {currentElement.fitness_package_type.type}{" "}
                            </b>
                          )
                        )}
                        <div className="d-flex space-in-between">
                          <Button
                            variant="outline-dark"
                            onClick={handleShow}
                            className="m-1"
                          >
                            Check Details
                          </Button>
                          <Button
                            variant="outline-dark"
                            onClick={handleShow}
                            className="m-1"
                          >
                            Remind me later
                          </Button>

                          <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header
                              closeButton
                              className="bg-dark text-light"
                            >
                              <Modal.Title>Booking Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div>
                                Username:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>{currentValue.username}</b>
                                  )
                                )}
                                <br />
                                Name:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>
                                      {currentValue.First_Name +
                                        " " +
                                        currentValue.Last_Name}
                                    </b>
                                  )
                                )}
                              </div>
                              <div>
                                Email:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>{currentValue.email}</b>
                                  )
                                )}
                                <br />
                                Phone no.:{" "}
                                {currentValue.ClientUser.map(
                                  (currentValue, index: number) => (
                                    <b key={index}>
                                      {currentValue.Phone_Number}
                                    </b>
                                  )
                                )}
                              </div>
                              <div className="p-2 shadow p-3 mb-5 bg-white rounded border">
                                <div className="d-flex">
                                  Offering:{" "}
                                  {currentValue.fitnesspackages.map(
                                    (currentElement, index: number) => (
                                      <span key={index} className="d-flex">
                                        {" "}
                                        {
                                          currentElement.fitness_package_type
                                            .type
                                        }{" "}
                                      </span>
                                    )
                                  )}
                                </div>
                                <br />
                                Duration: {currentValue.package_duration}{" "}
                                {currentValue.package_duration === 1
                                  ? "day"
                                  : "days"}
                                <br />
                                Start Date:{" "}
                                {moment(currentValue.effective_date).format(
                                  "DD MMM YYYY"
                                )}
                                <br />
                                End Date:{" "}
                                {moment(currentValue.effective_date)
                                  .add(
                                    Number(currentValue.package_duration),
                                    "days"
                                  )
                                  .format("DD MMM YYYY")}
                              </div>
                              <div className="d-flex justify-content-between">
                                Booking Status: {currentValue.Booking_status}
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                        <div className="d-flex">
                          <p>#{currentValue.Booking_status} </p>
                          {currentValue.fitnesspackages.map(
                            (currentElement, index: number) => (
                              <p key={index}>
                                #{currentElement.fitness_package_type.type}{" "}
                              </p>
                            )
                          )}
                        </div>
                        <Row>
                          <Col md={{ offset: 10 }}>
                            <Badge variant="success" className="p-2">
                              Booked
                            </Badge>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  ))
                : null}
            </div>
          </Tab>
        </Tabs>
      </Card>
      <BookingAction ref={bookingActionRef} refetchBookings={refetchBookings}/>
    </>
  );
}

export default TaskCard;
