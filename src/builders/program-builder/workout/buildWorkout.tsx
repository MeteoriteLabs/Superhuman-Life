import react from 'react';
import { Row, Col, Accordion, Card } from 'react-bootstrap';

const BuildWorkout = (props: any) => {
     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ backgroundColor: 'grey', color: 'white'}}>
                    Warm Up
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                              <Col>
                                   <Row lg={12}>
                                        <input type="number" placeholder="add rest time"/>
                                   </Row>
                                   <Row className="mt-2">
                                        <input type="number" placeholder="add rest time"/>
                                   </Row>
                                   <Row className="mt-2">
                                        <input type="text" placeholder="add URL" />
                                   </Row>
                              </Col>
                         </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                    Click me!
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                    Click me!
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
               </Card>
          </Accordion>
     );
};

export default BuildWorkout;