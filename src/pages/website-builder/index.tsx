import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TabsComponent from "./Tabs/TabsComponent";

const WebsiteBuilder: React.FC = () => {
  return (
    <>
      <Container fluid className="mt-5">
        <Row>
          <Col md={4} className="pb-2 pt-5">
            <h1>My Websites</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 12, offset: 0 }}>
            <TabsComponent />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default WebsiteBuilder;