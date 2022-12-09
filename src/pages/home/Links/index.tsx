import { Card, Row, Col } from "react-bootstrap";
import "../LeadCard/lead.css";

function LinksCard() {
  return (
    <Card>
      <Card.Header
        as="h5"
        className="bg-dark text-light"
        style={{ cursor: "pointer" }}
      >
        Links
      </Card.Header>
      <div className="scrollBar">
        <h5 className="p-2">Website</h5>

        {/* alotted sub domain website link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10}>https://www.websitelink.com</Col>
          <Col lg={1}>
            <img src="assets/home_page_images/redirect.svg" alt="redirect" />
          </Col>
        </Row>

        {/* changemaker domain website link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10}>https://www.websitelink.com</Col>
          <Col lg={1}>
            <img src="assets/home_page_images/redirect.svg" alt="redirect" />
          </Col>
        </Row>

        <h5 className="p-2">Apps</h5>

        {/* app android app link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10}>https://www.applinksAndroid.com</Col>
          <Col lg={1}>
            <img src="assets/home_page_images/redirect.svg" alt="redirect" />
          </Col>
        </Row>

        {/* app iOS app link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10}>https://www.applinksIOS.com</Col>
          <Col lg={1}>
            <img src="assets/home_page_images/redirect.svg" alt="redirect" />
          </Col>
        </Row>
      </div>
    </Card>
  );
}

export default LinksCard;
