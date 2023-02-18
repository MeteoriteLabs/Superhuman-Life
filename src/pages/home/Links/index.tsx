import { Card, Row, Col } from "react-bootstrap";
import "../LeadCard/lead.css";

const websiteUrl = process.env.WEBSITE_URL;
const subdomainWebsiteUrl = process.env.SUBDOMAIN_WEBSITE_URL;
const androidUrl = process.env.ENDUSER_ANDROID_APP_URL;
const iosUrl = process.env.ENDUSER_IOS_APP_URL;

function LinksCard() {
  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
        Links
      </Card.Header>
      <div className="scrollBar">
        <h5 className="p-2">Website</h5>

        {/* alotted sub domain website link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1} sm={1} xs={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10} sm={8} xs={8}>
            {websiteUrl}
          </Col>
          <Col lg={1} sm={1} xs={1}>
            <a href={`${websiteUrl}`} target="_blank" rel="noreferrer">
              <img src="assets/home_page_images/redirect.svg" alt="redirect" />
            </a>
          </Col>
        </Row>

        {/* changemaker domain website link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1} sm={1} xs={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10} sm={8} xs={8}>
            {subdomainWebsiteUrl}
          </Col>
          <Col lg={1} sm={1} xs={1}>
            <a href={`${subdomainWebsiteUrl}`} target="_blank" rel="noreferrer">
              <img src="assets/home_page_images/redirect.svg" alt="redirect" />
            </a>
          </Col>
        </Row>

        <h5 className="p-2">Apps</h5>

        {/* app android app link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1} sm={1} xs={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10} sm={8} xs={8}>
            https://www.applinksAndroid.com
          </Col>
          <Col lg={1} sm={1} xs={1}>
            <a href={`${androidUrl}`} target="_blank" rel="noreferrer">
              <img src="assets/home_page_images/redirect.svg" alt="redirect" />
            </a>
          </Col>
        </Row>

        {/* app iOS app link*/}
        <Row className="border p-1 m-2 bg-white rounded shadow">
          <Col lg={1} sm={1} xs={1}>
            <img src="assets/home_page_images/links.svg" alt="links" />
          </Col>
          <Col lg={10} sm={8} xs={8}>
            https://www.applinksIOS.com
          </Col>
          <Col lg={1} sm={1} xs={1}>
            <a href={`${iosUrl}`} target="_blank" rel="noreferrer">
              <img src="assets/home_page_images/redirect.svg" alt="redirect" />
            </a>
          </Col>
        </Row>
      </div>
    </Card>
  );
}

export default LinksCard;
