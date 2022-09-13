import { Card, Tab, Tabs } from "react-bootstrap";
import FitnessTab from './fitness/index';

export default function ProgramPage() {
     return (
          <>
              <h3>Resources</h3>
              <Card className="shadow-sm mt-3" border="light">
                  <Card.Body>
                      <Tabs variant="pills" transition={false} defaultActiveKey="fitness">
                          <Tab eventKey="fitness" title="Fitness">
                              <FitnessTab />
                          </Tab>
                          {/* <Tab eventKey="journey" title="Journey">
                          </Tab>
                          <Tab eventKey="nutrition" title="Nutrition">
                          </Tab> */}
                      </Tabs>
                  </Card.Body>
              </Card>
          </>
      );
}