import react from 'react';
import { Row, Accordion, Card } from 'react-bootstrap';

const BuildWorkout = (props: any) => {
     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" style={{ backgroundColor: 'blue', color: 'white'}}>
                    Warm Up
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                              <input type="text" placeholder="Search from exercise"/>
                              <input type="number" placeholder="add rest time"/>
                              <input type="text" placeholder="add URL" />
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