import React from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import DayView from "./dayView";
import WeekView from "./weekView";

export default function ProgramPage() {
  return (
    <>
      <h3>Schedule</h3>
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="day">
            <Tab eventKey="day" title="Day">
              <DayView />
            </Tab>
            <Tab eventKey="week" title="Week">
              <WeekView />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
}
