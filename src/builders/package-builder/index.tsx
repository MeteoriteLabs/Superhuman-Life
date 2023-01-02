import { Card, Tab, Tabs } from "react-bootstrap";
import FitnessTab from "./fitness/Fitness";

export default function PackagePage() {
  return (
    <>
      <h2>Offerings</h2>
      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Tabs
            variant="pills"
            transition={false}
            defaultActiveKey="fitness"
            className="pb-3 cards"
            style={{ borderBottom: "1px solid black" }}
          >
            <Tab eventKey="fitness" title="Fitness">
              <FitnessTab />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
}
