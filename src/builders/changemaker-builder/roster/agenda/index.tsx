import React from 'react';
import {Col, Row, Accordion, Card} from 'react-bootstrap';

const RosterAgenda = (props: any) => {

    const data = props?.data[0]?.session?.workout;

    console.log(data)

    return (
        <div className='text-left shadow-lg p-4' style={{ borderRadius: '15px'}}>
            <Row>
                <Col>
                    <h6>Workout Name</h6>
                </Col>
                <Col>
                    <h6>Discipline</h6>
                </Col>
                <Col>
                    <h6>Duration</h6>
                </Col>
                <Col>
                    <h6>Level</h6>
                </Col>
                <Col>
                    <h6>Intensity</h6>
                </Col>
                <Col>
                    <h6>Calories</h6>
                </Col>
                <Col>
                    <h6>Muscle Group</h6>
                </Col>
                <Col>
                    <h6>Equipment</h6>
                </Col>
            </Row>
            <hr />
            <div className='text-left shadow-lg p-4' style={{ borderRadius: '15px'}}>
                <Row>
                    <Col>
                        <span>{data.workouttitle}</span>
                    </Col>
                    <Col>
                        <span>{data.fitnessdisciplines.map((item: any) => {
                            return item.disciplinename
                        }).join(", ")}</span>
                    </Col>
                    <Col>
                        <span>{'duration'}</span>
                    </Col>
                    <Col>
                        <span>{data.level}</span>
                    </Col>
                    <Col>
                        <span>{data.intensity}</span>
                    </Col>
                    <Col>
                        <span>{data.calories}</span>
                    </Col>
                    <Col>
                        <span>{data.muscle_groups.map((item: any) => {
                            return item.name
                        }).join(", ")}</span>
                    </Col>
                    <Col>
                        <h6>{data.equipment_lists.map((item: any) => {
                            return item.name
                        }).join(", ")}</h6>
                    </Col>
                </Row>
            </div>
            <div className='mt-4'>
                <Accordion defaultActiveKey="">
                    <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="0">
                            <b>Warmup</b>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="1">
                            <b>Main Movement</b>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="1">
                            <b>CoolDown</b>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        </div>
    );
};

export default RosterAgenda;