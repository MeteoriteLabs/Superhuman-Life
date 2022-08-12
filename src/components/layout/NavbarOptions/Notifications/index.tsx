import {
  Row,
  Alert,
  NavDropdown
} from "react-bootstrap";
import './notification.css';

export function NotificationOption() {

  return (
    <NavDropdown title={<img
      src="/assets/navbar_icons/notificationIcon.svg"
      alt="notification"
      className="img-responsive "
      style={{ height: '20px', width: '20px' }}
    />}
      id="collasible-nav-dropdown">
      <NavDropdown.Item href="#action/3.1">
        <Row className="justify-content-between">
          <div className="float-left"><b>Notification</b></div>
          <div className="float-right"><small>Clear All</small></div>
        </Row>
      </NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">
        <small>Today</small>
      </NavDropdown.Item>
      <NavDropdown.Item href="#action/3.3">
        <Row>

          <Alert variant={'dark'}>
            <Row className="justify-content-end">
              <div className="float-right"><small><img src="/assets/close.svg" alt="close icon" /></small></div>
            </Row>
            <Row className="justify-content-between">
              <div className="float-left"><small><b>@username</b></small></div>
              <div className="float-right"><small>07:00 AM</small></div>
            </Row>
            <Row className="justify-content-between">
              <div>
                This is a demo notification.
              </div>
            </Row>
          </Alert>

        </Row>
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href="#action/3.4">
      </NavDropdown.Item>
    </NavDropdown>
  );
}