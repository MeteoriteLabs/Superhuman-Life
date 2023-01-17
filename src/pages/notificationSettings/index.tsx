import { useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import authContext from "../../context/auth-context";
import { Form, Card, Row, Col } from "react-bootstrap";
import { CREATE_NOTIFICATION_SETTINGS, GET_NOTIFICATION_SETTINGS } from "./queries";
import { flattenObj } from "../../components/utils/responseFlatten";

function NotificationSetting() {
  const auth = useContext(authContext);
  const [isSettingNotificationCreated, setIsSettingNotificationCreated] = useState<number>(0);

  // eslint-disable-next-line
  const { data: get_notifications, refetch : refetch_notifications } = useQuery(GET_NOTIFICATION_SETTINGS, { variables: { id: auth.userid },
    onCompleted: (data) => {
      console.log(data);
      const flattenData = flattenObj({ ...data });
        console.log(flattenData)
        setIsSettingNotificationCreated(flattenData.notificationSettings?.length)
    },
  });

  //Notification  Settings
  const [createNotificationSetting] = useMutation(CREATE_NOTIFICATION_SETTINGS);

  const createNotification = () => {
    createNotificationSetting({
      variables: {
        data: {
          isUsersEmail: true,
          isUsersPlatform: true,
          isBookingsPlatform: true,
          isBookingsEmail: true,
          isOfferingsPlatform: true,
          isOfferingsEmail: true,
          isResorucesPlatform: true,
          isResorucesEmail: true,
          isFinancePlatform: true,
          isFinanceEmail: true,
          isCommunicationPlatform: true,
          isCommunicationEmail: true,
          isSchedulePlatform: true,
          isScheduleEmail: true,
          isProgramManagerEmail: true,
          isProgramManagerPlatform: true,
          users_permissions_user: auth.userid,
        },
      } 
    });
  };

  return (
    <div>
      <h2>Notification Settings</h2>
      <div className="pt-5">
        {/* Basic Notification Settings */}
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Enable Notifications</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Enable Platform Notification and Email Notification"
                  checked={isSettingNotificationCreated ? true : false}
                  disabled={isSettingNotificationCreated !==0 ? true : false}
                  onClick={() => {
                    createNotification();
                    refetch_notifications();
                  }}
                />
              </Form>
            </Col>
          </Row>
        </Card>
        {/* Schedule */}
        {
          isSettingNotificationCreated ? 
          <Card className="p-3">
          <Row>
            <Col>
              <h6>Schedule</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null
        }
        
        {/* Program Manager */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Program Manager</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Users */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Users</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Bookings */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Bookings</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Offerings */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Offerings</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Resources */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Resources</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Finance */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Finance</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }

        {/* Communication */}
        {
          isSettingNotificationCreated ? 
        <Card className="p-3">
          <Row>
            <Col>
              <h6>Communication</h6>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Platform Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Email Notification"
                  defaultChecked={true}
                  // onClick={() => {
                  //   setShowHistory(!showHistory);
                  //   mainQuery.refetch().then((res: any) => {
                  //     handleHistoryPackage(res.data);
                  //   });
                  // }}
                />
              </Form>
            </Col>
          </Row>
        </Card> : null }
      </div>
    </div>
  );
}

export default NotificationSetting;
