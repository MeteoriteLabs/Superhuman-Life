import { Row, Col, Button, Card } from "react-bootstrap";
import Icons from "../../../Icons";
import {Link} from 'react-router-dom';

function Notifications() {
  return (
    <div className="col-lg-12">
    
      <div className="d-flex justify-content-between align-items-center">
        <h2>Notifications</h2>
        <div className="px-5">
          <Link to="/notificationSettings"><Button variant="outline-dark">Settings</Button></Link>
        </div>
      </div>

      <div className="mt-5">
        {/* Today */}
        <Row className="my-3">
          <Col lg={1}>
            <b>Today</b>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col lg={9}>
            <Card style={{borderLeft: "5px solid blue "}}>
              <Row>
                <Col md={{ offset: 11 }}>
                  <small>08:32 PM</small>
                </Col>
              </Row>
              <p className="ml-2">This is some text within a card body.</p>
            </Card>
          </Col>
          <Col lg={1}>
            <Icons name="close" width={24} height={24} />
          </Col>
        </Row>
        <Row className="mt-1">
          <Col lg={9}>
            <Card style={{borderLeft: "5px solid blue "}}>
              <Row>
                <Col md={{ offset: 11 }}>
                  <small>08:32 PM</small>
                </Col>
              </Row>
              <p className="ml-2">This is some text within a card body.</p>
            </Card>
          </Col>
          <Col lg={1}>
            <Icons name="close" width={24} height={24} />
          </Col>
        </Row>

        {/* 08-01-2023 */}
        <Row className="my-3">
          <Col lg={1}>
            <b>08 Jan 2023</b>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col lg={9}>
            <Card style={{borderLeft: "5px solid green "}}>
              <Row>
                <Col md={{ offset: 11 }}>
                  <small>08:32 PM</small>
                </Col>
              </Row>
              <p className="ml-2">This is some text within a card body.</p>
            </Card>
          </Col>
          <Col lg={1}>
            <Icons name="close" width={24} height={24} />
          </Col>
        </Row>
        <Row className="mt-1">
          <Col lg={9}>
            <Card style={{borderLeft: "5px solid red "}}>
              <Row>
                <Col md={{ offset: 11 }}>
                  <small>08:32 PM</small>
                </Col>
              </Row>
              <p className="ml-2">This is some text within a card body.</p>
            </Card>
          </Col>
          <Col lg={1}>
            <Icons name="close" width={24} height={24} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Notifications;
