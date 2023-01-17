import { Row, Col, Button, Card } from "react-bootstrap";
import Icons from "../../../Icons";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import authContext from "../../../../context/auth-context";
import {
  GET_CHANGEMAKER_NOTIFICATION,
  MARK_NOTIFICATION_AS_READ,
  DELETE_NOTIFICATION,
} from "./queries";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";
import "./style.css";

interface Notification {
  id: String;
  DateTime: Date;
  Title: String;
  Body: String;
  OnClickRoute: String;
  ContactID: String | Number;
  type: String;
  IsRead: Boolean;
}

function Notifications() {
  const auth = useContext(authContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    // eslint-disable-next-line
    data: get_changemaker_notifications,
    // eslint-disable-next-line
    refetch: refetch_changemaker_notifications,
  } = useQuery(GET_CHANGEMAKER_NOTIFICATION, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setNotifications(flattenData.changemakerNotifications);
    },
  });

  const [changeNotificationStatus] = useMutation(MARK_NOTIFICATION_AS_READ);

  function markAsRead(id: String) {
    changeNotificationStatus({
      variables: { id: id, IsRead: true },
      onCompleted: () => {
        refetch_changemaker_notifications();
      },
    });
  }

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

  function deleteNoti(id: String) {
    deleteNotification({
      variables: { id: id },
      onCompleted: () => {
        refetch_changemaker_notifications();
      },
    });
  }

  function markAsUnread(id: String) {
    changeNotificationStatus({
      variables: { id: id, IsRead: false },
      onCompleted: () => {
        refetch_changemaker_notifications();
      },
    });
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Notifications</h2>
        <div className="px-5">
          <Link to="/notificationSettings">
            <Button variant="outline-dark">Settings</Button>
          </Link>
        </div>
      </div>

      <div className="mt-5 col-lg-12">
        {notifications.map((currentValue) => {
          return (
            <div key={`${currentValue.id}`}>
              <Row className="my-3">
                <Col lg={2}>
                  <b>{moment(currentValue.DateTime).format("DD MMM YYYY")}</b>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg={9}>
                  <Card
                    style={{
                      borderLeft: "5px solid black",
                      color: "black",
                      textDecoration: "none",
                      background: `${
                        currentValue.IsRead ? "white" : "#f0f2f2"
                      }`,
                    }}
                  >
                    <Row>
                      <Col md={{ offset: 11 }}>
                        <small>
                          {moment(currentValue.DateTime).format("HH:mm A")}
                        </small>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={1}>
                        <Icons name="avatar" width={45} height={45} />
                      </Col>

                      <Col lg={10}>
                        <Link to={`${currentValue.OnClickRoute}`} className="a">
                          <p className="ml-2 text-dark">{currentValue.Body}</p>
                        </Link>
                      </Col>

                      <Col lg={1}>
                        {currentValue.IsRead ? (
                          <div
                            title="mark as unread"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              markAsUnread(currentValue.id);
                            }}
                          >
                            <Icons name="readeye" width={24} height={24} />
                          </div>
                        ) : (
                          <div
                            title="mark as read"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              markAsRead(currentValue.id);
                            }}
                          >
                            <Icons name="unreadeye" width={24} height={24} />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col lg={1}>
                  <div
                    title="delete notification"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteNoti(currentValue.id)}
                  >
                    <Icons name="close" width={24} height={24} />
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;
