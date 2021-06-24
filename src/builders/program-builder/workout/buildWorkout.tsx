import react from 'react';
import { Row, Col, Accordion, Card, Dropdown } from 'react-bootstrap';

const BuildWorkout = (props: any) => {
     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ backgroundColor: 'grey', color: 'white'}}>
                    Warm Up
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                         <Dropdown>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">
                              Dropdown Button
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                   <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                   <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                   <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                              </Dropdown.Menu>
                         </Dropdown>
                         </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                    Main Movement
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                    Cool Down
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
               </Card>
          </Accordion>
     );
};

export default BuildWorkout;