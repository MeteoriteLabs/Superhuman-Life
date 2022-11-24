import { Card, Tab, Tabs } from "react-bootstrap";
import Fitness from "./Fitness/Fitness";

export default function SessionPage() {
  return (
    <div>
      <h2>Program Manager</h2>

      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Tabs
            style={{ borderBottom: "1px solid black" }}
            className="pb-3"
            variant="pills"
            transition={false}
            defaultActiveKey="fitness"
          >
            <Tab eventKey="fitness" title="Fitness">
              <Fitness />
            </Tab>
            <Tab eventKey="nutrition" title="Nutrition">
              {/* <Fitness/> */}
            </Tab>
            <Tab eventKey="journey" title="Journey">
              {/* <Fitness/> */}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}
