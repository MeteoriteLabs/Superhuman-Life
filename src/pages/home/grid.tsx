import React from "react";
import { Row, Col } from "react-bootstrap";
import UpcomingCard from "./UpcomingCard";
import LeadCard from "./LeadCard/index";
import GraphSelector from "./GraphSelector";
import LinksCard from "./Links";
import TaskCard from "./TaskCard";

const Grid: React.FC = () => {
  return (
    <>
      <Row className="my-3">
        <Col className="my-2" lg={4} sm={12}>
          <LeadCard />
        </Col>
        <Col className="my-2" lg={4} sm={12}>
          <UpcomingCard />
        </Col>
        <Col className="my-2" lg={4} sm={12}>
          <LinksCard />
        </Col>
        <Col className="my-2" lg={6} sm={12}>
          <TaskCard />
        </Col>
        
      </Row>
      <Row>
        <Col>
          <GraphSelector />  
        </Col>
      </Row>
    </>
  );
}

export default Grid;
