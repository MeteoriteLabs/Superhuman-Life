import { Card, Button, Modal } from "react-bootstrap";
import { GET_ALL_BOOKINGS } from "../../booking/GraphQL/queries";
import authContext from "../../../context/auth-context";
import { useContext, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../../../components/utils/responseFlatten";
import BookingAction from "../../booking/Movement/BookingAction";
import moment from "moment";
import "./style.css";

function TaskCard() {
  const auth = useContext(authContext);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const bookingActionRef = useRef<any>(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useQuery(GET_ALL_BOOKINGS, {
    variables: {
      id: auth.userid,
    },
    onCompleted: (data) => loadData(data),
  });

  const loadData = (data: { clientBookings: any[] }) => {
    const flattenData = flattenObj({ ...data.clientBookings });

    let pendingBookingsArray = flattenData.filter(
      (currentValue) => currentValue.booking_status === "pending"
    );

    setPendingBookings(pendingBookingsArray);
  };

  return (
    <>
      <Card>
        <Card.Header as="h5" className="bg-dark text-light">
          Task
        </Card.Header>
        <div className="scrollBar pt-3">
          {pendingBookings && pendingBookings.length ? (
            pendingBookings.map((currentValue, index) => (
              <Card
                style={{
                  borderLeft: "5px solid grey",
                  borderRadius: "5px",
                  margin: "5px",
                  padding: "5px",
                }}
              >
                <div key={index}>
                  {currentValue.users_permissions_users.map(
                    (currentValue, index) => (
                      <b key={index}>{currentValue.username}</b>
                    )
                  )}{" "}
                  requested to book{" "}
                  {currentValue.fitnesspackages.map((currentElement, index) => (
                    <b key={index}>
                      {currentElement.fitness_package_type.type}{" "}
                    </b>
                  ))}
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
                      <Modal.Header closeButton className="bg-dark text-light">
                        <Modal.Title>Booking Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div>
                          Username:{" "}
                          {currentValue.users_permissions_users.map(
                            (currentValue, index) => (
                              <b key={index}>{currentValue.username}</b>
                            )
                          )}
                          <br />
                          Name:{" "}
                          {currentValue.users_permissions_users.map(
                            (currentValue, index) => (
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
                          {currentValue.users_permissions_users.map(
                            (currentValue, index) => (
                              <b key={index}>{currentValue.email}</b>
                            )
                          )}
                          <br />
                          Phone no.:{" "}
                          {currentValue.users_permissions_users.map(
                            (currentValue, index) => (
                              <b key={index}>{currentValue.Phone_Number}</b>
                            )
                          )}
                        </div>
                        <div className="p-2 shadow p-3 mb-5 bg-white rounded border">
                          <div className="d-flex">
                            Offering:{" "}
                            {currentValue.fitnesspackages.map(
                              (currentElement, index) => (
                                <span key={index} className="d-flex">
                                  {" "}
                                  {
                                    currentElement.fitness_package_type.type
                                  }{" "}
                                </span>
                              )
                            )}
                          </div>
                          <br />
                          Duration: {currentValue.package_duration}{" "}
                          {currentValue.package_duration === 1 ? "day" : "days"}
                          <br />
                          Start Date:{" "}
                          {moment(currentValue.effective_date).format(
                            "DD MMM YYYY"
                          )}
                          <br />
                          End Date:{" "}
                          {moment(currentValue.effective_date)
                            .add(Number(currentValue.package_duration), "days")
                            .format("DD MMM YYYY")}
                        </div>
                        <div className="d-flex justify-content-between">
                          Booking Status: {currentValue.booking_status}
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
                    <p>#{currentValue.booking_status} </p>
                    {currentValue.fitnesspackages.map(
                      (currentElement, index) => (
                        <p key={index}>
                          #{currentElement.fitness_package_type.type}{" "}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center">No task to show</p>
          )}
        </div>
      </Card>
      <BookingAction ref={bookingActionRef} />
    </>
  );
}

export default TaskCard;
