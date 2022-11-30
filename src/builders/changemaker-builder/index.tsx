import { Card, Tab, Tabs } from "react-bootstrap";
import DayView from "./dayView";
import WeekView from "./weekView";

export default function ProgramPage() {
  return (
    <>
      <h2>Schedule</h2>
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="day" variant="pills">
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
