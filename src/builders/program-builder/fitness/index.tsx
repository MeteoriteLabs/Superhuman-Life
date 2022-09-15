import { Card, Tab, Tabs } from "react-bootstrap";
import ExercisesTab from '../exercises';
import WorkoutTab from '../workout';
import ProgramTab from '../program';

export default function FitnessTab(){
     return(
          <Card className="shadow-sm mt-3" border="light">
                  <Card.Body>
                      <Tabs transition={false} defaultActiveKey="workout" >
                          <Tab eventKey="exercises" title="Exercises">
                               <ExercisesTab />
                          </Tab>
                          <Tab eventKey="workout" title="Workout">
                                <WorkoutTab />
                          </Tab>
                          <Tab eventKey="program" title="Program Template">
                              <ProgramTab />
                          </Tab>
                      </Tabs>
                  </Card.Body>
              </Card>
     );
};