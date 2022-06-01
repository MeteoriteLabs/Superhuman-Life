import React, {useState} from 'react';
import {Col, Row, Accordion, Card} from 'react-bootstrap';
import Chevron from './Chevron';

const RosterAgenda = (props: any) => {

    const data = props?.data[0]?.session?.workout;

    const [active, setActive] = useState(null);

     function toggleAccodian(id){
          setActive( id );
     }

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
            {data.workout_URL !== null && <div className='mt-3 shadow-lg p-3' style={{ borderRadius: "15px", display: 'inline-block'}}>
                <h5><b>Workout URL: </b></h5>
                <span>{data.workout_URL}</span>
            </div>}
            {data.workout_text !== null && <div className='mt-3 shadow-lg p-3' style={{ borderRadius: "15px", display: 'inline-block'}}>
                <h5><b>Workout Instructions in Text: </b></h5>
                <span>{data.workout_text}</span>
            </div>}
            <div className='mt-4'>
                <Accordion defaultActiveKey="">
                    {data?.warmup?.length > 0 && <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="1" onClick={() => toggleAccodian(active === 1 ? null : 1)}>
                            <b>Warmup</b>
                            <Chevron className={"accordion__icon float-right " + ((active === 1) ? 'rotate' : '')}  width={10} fill={"#777"}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                {data?.warmup[0]?.type === "exercise" && data?.warmup?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='shadow-lg p-3' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={7}>
                                                        <img src='https://picsum.photos/200/100' alt='img' style={{ borderRadius: "15px"}}/>
                                                    </Col>
                                                    <Col lg={5}>
                                                        <Row>
                                                            <h5>{item.value}</h5>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <h6>Reps</h6>
                                                                <span>{item.reps}</span>
                                                            </Col>
                                                            <Col>
                                                                <h6>Weight</h6>
                                                                <span>{item.weights}</span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <br />
                                            <div className='shadow-lg p-3 mt-4' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={6}>
                                                        <h6>Rest Time</h6>
                                                    </Col>
                                                    <Col lg={1}>
                                                        <span>{item.restTime}</span>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <span><b>min</b></span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    )
                                })}
                                <br />
                                {data?.warmup[0]?.type === "text" && data?.warmup?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <div dangerouslySetInnerHTML={{ __html: `${item.value}`}}></div>
                                            </div>
                                        </>
                                    )    
                                })}
                                <br />
                                {data?.warmup[0]?.type === "url" && data?.warmup?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <span>{item.value}</span>
                                            </div>
                                        </>
                                    )    
                                })}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>}
                    {data?.mainmovement?.length > 0 && <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="2" onClick={() => toggleAccodian(active === 2 ? null : 2)}>
                            <b>Main Movement</b>
                            <Chevron className={"accordion__icon float-right " + ((active === 2) ? 'rotate' : '')}  width={10} fill={"#777"}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                {data?.mainmovement[0]?.type === "exercise" && data?.mainmovement?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='shadow-lg p-3' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={7}>
                                                        <img src='https://picsum.photos/200/100' alt='img' style={{ borderRadius: "15px"}}/>
                                                    </Col>
                                                    <Col lg={5}>
                                                        <Row>
                                                            <h5>{item.value}</h5>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <h6>Reps</h6>
                                                                <span>{item.reps}</span>
                                                            </Col>
                                                            <Col>
                                                                <h6>Weight</h6>
                                                                <span>{item.weights}</span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <br />
                                            <div className='shadow-lg p-3 mt-4' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={6}>
                                                        <h6>Rest Time</h6>
                                                    </Col>
                                                    <Col lg={1}>
                                                        <span>{item.restTime}</span>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <span><b>min</b></span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    )
                                })}
                                <br />
                                {data?.mainmovement[0]?.type === "text" && data?.mainmovement?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <div dangerouslySetInnerHTML={{ __html: `${item.value}`}}></div>
                                            </div>
                                        </>
                                    )    
                                })}
                                <br />
                                {data?.mainmovement[0]?.type === "url" && data?.mainmovement?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <span>{item.value}</span>
                                            </div>
                                        </>
                                    )    
                                })}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>}
                    {data?.cooldown?.length > 0 && <Card>
                        <Accordion.Toggle as={Card.Header} className="text-left" eventKey="3" onClick={() => toggleAccodian(active === 3 ? null : 3)}>
                            <b>CoolDown</b>
                            <Chevron className={"accordion__icon float-right " + ((active === 3) ? 'rotate' : '')}  width={10} fill={"#777"}/>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>
                                {data?.cooldown[0]?.type === "exercise" && data?.cooldown?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='shadow-lg p-3' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={7}>
                                                        <img src='https://picsum.photos/200/100' alt='img' style={{ borderRadius: "15px"}}/>
                                                    </Col>
                                                    <Col lg={5}>
                                                        <Row>
                                                            <h5>{item.value}</h5>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <h6>Reps</h6>
                                                                <span>{item.reps}</span>
                                                            </Col>
                                                            <Col>
                                                                <h6>Weight</h6>
                                                                <span>{item.weights}</span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <br />
                                            <div className='shadow-lg p-3 mt-4' style={{ borderRadius: "15px", display: 'inline-block'}}>
                                                <Row>
                                                    <Col lg={6}>
                                                        <h6>Rest Time</h6>
                                                    </Col>
                                                    <Col lg={1}>
                                                        <span>{item.restTime}</span>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <span><b>min</b></span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    )
                                })}
                                <br />
                                {data?.cooldown[0]?.type === "text" && data?.cooldown?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <div dangerouslySetInnerHTML={{ __html: `${item.value}`}}></div>
                                            </div>
                                        </>
                                    )    
                                })}
                                <br />
                                {data?.cooldown[0]?.type === "url" && data?.cooldown?.map((item: any) => {
                                    return (
                                        <>
                                            <div className='p-3 shadow-lg mt-3' style={{ borderRadius: '15px', border: '1px solid gray', display: 'inline-block'}}>
                                                <span>{item.value}</span>
                                            </div>
                                        </>
                                    )    
                                })}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>}
                </Accordion>
            </div>
        </div>
    );
};

export default RosterAgenda;