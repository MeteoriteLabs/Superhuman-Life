import { Card, Tab, Tabs } from "react-bootstrap";
import FitnessTab from "./fitness/index";

export default function ProgramPage() {
  return (
    <>
      <h2>Resources</h2>
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
              <FitnessTab />
            </Tab>
            {/* 
              <Tab eventKey="journey" title="Journey">
                </Tab>
                    <Tab eventKey="nutrition" title="Nutrition">
                </Tab> 
            */}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
}
