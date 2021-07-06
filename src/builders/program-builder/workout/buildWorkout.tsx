import { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import Chevron from '../search-builder/Chevron';
import Build from './build';

const BuildWorkout = (props: any) => {

     const [active, setActive] = useState("active");
     const [rotate, setRotate] = useState("accordian__icon");

     function toggleAccodian(){
          setActive(active === "active" ? "" : "active");
          setRotate(
               active === "active" ? "accordion__icon" : "accordian__icon rotate"
          )
     }

     return (
          <Accordion defaultActiveKey="0">
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0"  className={`${active}`} onClick={() => toggleAccodian()}>
                    Warm Up
                         <Chevron className={`${rotate} float-right`}  width={10} fill={"#777"}/>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                         <Card.Body>
                              <Build />
                         </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1" >
                    Main Movement
                         <Chevron className={`${rotate} float-right`}  width={10} fill={"#777"}/>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>
                         <Build />
                    </Card.Body>
                    </Accordion.Collapse>
               </Card>
               <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2" >
                    Cool Down
                         <Chevron className={`${rotate} float-right`}  width={10} fill={"#777"}/>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <Card.Body>
                         <Build />
                    </Card.Body>
                    </Accordion.Collapse>
               </Card>
          </Accordion>
     );
};

export default BuildWorkout;