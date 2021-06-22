import { Card, Tab, Tabs } from "react-bootstrap";
import ExercisesTab from '../exercises';
import WorkoutTab from '../workout';

export default function FitnessTab(){
     return(
          <Card className="shadow-sm mt-3" border="light">
                  <Card.Body>
                      <Tabs transition={false} defaultActiveKey="exercises" >
                          <Tab eventKey="exercises" title="Exercises">
                               <ExercisesTab />
                          </Tab>
                          <Tab eventKey="workout" title="Workout">
                                <WorkoutTab />
                          </Tab>
                          <Tab eventKey="program" title="Program">
                          </Tab>
                      </Tabs>
                  </Card.Body>
              </Card>
     );
};