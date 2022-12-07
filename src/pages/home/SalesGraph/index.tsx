import { Tab, Tabs } from "react-bootstrap";
import MonthlySalesGraph from "./MonthlySalesGraph";
import WeeklySalesGraph from "./WeeklySalesGraph";

function SalesGraph() {
  return (
    <div>
      <Tabs defaultActiveKey="monthly" id="uncontrolled-tab-example">
        <Tab eventKey="monthly" title="Monthly">
          <MonthlySalesGraph />
        </Tab>
        <Tab eventKey="weekly" title="Weekly">
          <WeeklySalesGraph />
        </Tab>
      </Tabs>
    </div>
  );
}

export default SalesGraph;
