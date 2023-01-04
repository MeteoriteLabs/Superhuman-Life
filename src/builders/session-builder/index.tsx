import { Card, Tab, Tabs } from "react-bootstrap";
import Fitness from "./Fitness/Fitness";

export default function SessionPage() {
  return (
    <div>
      <h2>Program Manager</h2>

      <Card className="shadow-sm mt-3" border="light" >
        <Card.Body>
          <Tabs
            className="pb-3 cards"
            variant="pills"
            transition={false}
            defaultActiveKey="fitness"
          >
            <Tab eventKey="fitness" title="Fitness">
              <Fitness />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}
