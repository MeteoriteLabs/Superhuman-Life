import { Container, Col, Card, Row } from "react-bootstrap";
import Icon from "../../components/Icons";

export default function SettingsPage() {
  return (
    <div>
      <h2>Settings</h2>
      <Container>
        <hr style={{ height: "12px" }} />
        {/* {showPasswordSetting && <ChangePasswordPage show={showPasswordSetting} onHide={() => setShowPasswordSetting(false)} />}
                {showModuleSetting && <Modules show={showModuleSetting} onHide={() => setShowModuleSetting(false)} />}
                {showDeleteAccountSetting && <DeleteAccountConfirmation show={showDeleteAccountSetting} onHide={() => setShowDeleteAccountSetting(false)} />} */}
        <Row>
          {/* Availability Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer" }}
          >
            <Card className="shadow-lg bg-white rounded p-3">
              <Card.Body className="text-center">
                <Icon
                name="darkschedule"
                width={24}
                height={24}
                
              />
                <Card.Title className="pt-1">Availability Settings</Card.Title>
                <Card.Text>
                  <small>Last updated: 29 Aug 2022</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking settings */}
          <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12}>
            <Card className="shadow-lg bg-white rounded p-3">
              <Card.Body className="text-center">
                <Icon
                name="darkbooking"
                width={24}
                height={24}
                
              />
                <Card.Title className="pt-1">Booking Settings</Card.Title>
                <Card.Text>
                  <small>Last updated: 29 Aug 2022</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          </Row>
          <Row>

          {/* Account Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer" }}
           
          >
            <Card className="shadow-lg bg-white rounded p-3">
              <Card.Body className="text-center">
                <Icon
                  name="account_settings"
                  width={24}
                  height={24}
                  style={{ marginLeft: "5px" }}
                />
                <Card.Title className="pt-1">Account Settings</Card.Title>
                <Card.Text>
                  <small>Last updated: 29 Aug 2022</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Notification Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer" }}
          >
            <Card className="shadow-lg bg-white rounded p-3">
              <Card.Body className="text-center">
                <Icon
                name="notification"
                width={24}
                height={24}
                
              />
                <Card.Title className="pt-1">Notification Settings</Card.Title>
                <Card.Text>
                  <small>Last updated: 29 Aug 2022</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
