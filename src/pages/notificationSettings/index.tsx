import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import authContext from "../../context/auth-context";
import { Form, Card, Row, Col } from "react-bootstrap";
import { CREATE_NOTIFICATION_SETTINGS } from "./queries";

function NotificationSetting() {
  const auth = useContext(authContext);
  const [showAllSettings, setShowAllSettings] = useState<boolean>(false);
  const [isShowAllSettingsSelected, setIsShowAllSettingsSelected] = useState<string>("");

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
          users_permissions_user: auth.userid,
        },
      },
    });
  };
console.log(isShowAllSettingsSelected);

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
                  defaultChecked={false}
                  value={isShowAllSettingsSelected}
                  onClick={(e) => {
                    setIsShowAllSettingsSelected('T')
                    createNotification();
                    setShowAllSettings(true);
                  }}
                />
              </Form>
            </Col>
          </Row>
        </Card>
        {/* Schedule */}
        {
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
          showAllSettings ? 
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
