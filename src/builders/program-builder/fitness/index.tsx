import react from 'react';
import { Card, Tab, Tabs } from "react-bootstrap";
import ExercisesTab from '../exercises';
import './App.css';

export default function FitnessTab(){
     return(
          <Card className="shadow-sm mt-3" border="light">
                  <Card.Body>
                      <Tabs className="myClass" variant="pills"  transition={false} defaultActiveKey="exercises" >
                          <Tab eventKey="exercises" title="Exercises">
                               <ExercisesTab />
                          </Tab>
                          <Tab eventKey="workout" title="Workout">
                          </Tab>
                          <Tab eventKey="program" title="Program">
                          </Tab>
                      </Tabs>
                  </Card.Body>
              </Card>
     );
};