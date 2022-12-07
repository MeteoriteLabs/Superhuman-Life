import { Tab, Tabs } from "react-bootstrap";
import MonthlyOfferingBookingGraph from "./MonthlyOfferingBookingGraph";
import WeeklyOfferingBookingGraph from "./WeeklyOfferingBookingGraph";

function OfferingBookingGraph() {
  return (
    <div>
      <Tabs defaultActiveKey="monthly" id="uncontrolled-tab-example">
        <Tab eventKey="monthly" title="Monthly">
          <MonthlyOfferingBookingGraph />
        </Tab>
        <Tab eventKey="weekly" title="Weekly">
          <WeeklyOfferingBookingGraph />
        </Tab>
      </Tabs>
    </div>
  );
}

export default OfferingBookingGraph;
