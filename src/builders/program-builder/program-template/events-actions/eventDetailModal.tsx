import React, { useState, useRef } from 'react';
import { Row, Col, FormControl, InputGroup, Tab, Tabs, Button } from 'react-bootstrap';
import { FETCH_EVENT } from '../queries';
import { useQuery } from '@apollo/client';
import TimeField from '../../../../components/customWidgets/timeField';
import CreateoreditWorkout from '../../workout/createoredit-workout';

const EventDetailModal = ({ event, type, close, onChange }) => {

     const [data, setData] = useState<any[]>([]);
     const [startChange, setStartChange] = useState("");
     const [edit, setEdit] = useState(true);
     const createEditWorkoutComponent = useRef<any>(null);
     const [endChange, setEndChange] = useState("");

     function FetchDataWorkout(_variables: {}) {
          useQuery(FETCH_EVENT, { variables: _variables, onCompleted: (r) => { loadDataWorkout(r); } });
     }

     function loadDataWorkout(r: any) {
          setData(r.workouts);
     }

     if (type === 'workout') {
          FetchDataWorkout({ id: event.id });
     } else if (type === 'activity') {
          console.log("this is an activity");
     }

     function handleStart(e: any) {
          setStartChange(e);
     }

     function handleEnd(e: any) {
          setEndChange(e);
     }

     onChange({ startChange, endChange });

     return (
          <>
               <Row>
                    <Col lg={8}>
                         <h3 className="text-capitalize">{event.title}</h3>
                    </Col>
                    <Col>
                         <div>
                              <i className="fas fa-pencil-alt fa-lg" onClick={() => { setEdit(!edit) }} style={{ cursor: 'pointer', color: 'dodgerblue' }} />
                         </div>
                    </Col>
                    <Col>
                         <i className="fas fa-copy fa-lg" onClick={(e) => { console.log(e); }} style={{ cursor: 'pointer', color: '#696969' }} />
                    </Col>
                    <Col>
                         <div>
                              <i className="fas fa-trash-alt fa-lg" onClick={(e) => { console.log(e); }} style={{ cursor: 'pointer', color: 'red' }}></i>
                              {/* <DeleteEventModal /> */}
                         </div>
                    </Col>
                    <Col>
                         <i className="fas fa-times fa-lg" onClick={(e) => { close(); }} style={{ cursor: 'pointer' }}></i>
                    </Col>
               </Row>
               <hr style={{ marginTop: '0px', marginBottom: '20px', borderTop: '2px solid grey' }}></hr>
               <Row className="align-items-center">
                    <Col lg={1}>
                         <h6>Type: </h6>
                    </Col>
                    <Col lg={4}>
                         <FormControl value={event.type} disabled />
                    </Col>
               </Row>
               <Row className="pt-3 align-items-center">
                    <Col lg={1}>
                         <h6>Day: </h6>
                    </Col>
                    <Col lg={4}>
                         <FormControl value={`Day-${event.day}`} disabled />
                    </Col>
               </Row>
               <Row className="pt-3 align-items-center">
                    <Col>
                         <TimeField title="Start" onChange={handleStart} hr={event.hour} m={event.min} disabled={edit} />
                    </Col>
               </Row>
               <Row className="pt-3 align-items-center">
                    <Col>
                         <TimeField title="End" onChange={handleEnd} hr={event.endHour} m={event.endMin} disabled={edit} />
                    </Col>
               </Row>
               {(type === 'workout') && <Tabs defaultActiveKey="agenda" transition={false} id="noanim-tab-example" className="pt-4">
                    <Tab eventKey="agenda" title="Agenda">
                         <Row className="justify-content-end p-3">
                              <Button variant="outline-primary" onClick={() => { createEditWorkoutComponent.current.TriggerForm({ type: 'edit' }); }}>Edit</Button>
                         </Row>
                         {data.map(val => {
                              return (
                                   <>
                                        <Row>
                                             {val.warmup === null ? '' : <Col className="pt-2"><h5>Warmup: {val.warmup.map((d) => {
                                                  return (
                                                       <>
                                                            <Row className="pt-2">
                                                                 <Col>
                                                                      <p>Content: {d.type === 'url' || 'text' ? d.value : d.name}</p>
                                                                      {d.type !== 'exercise' ? null : <p>Reps: {d.reps}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Weights: {d.weights}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Sets: {d.sets}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Duration: {d.duration}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Rest Time: {d.restTime}</p>}
                                                                 </Col>
                                                            </Row>
                                                       </>
                                                  )
                                             })}</h5></Col>}
                                        </Row>
                                        <Row>
                                             {val.mainmovement === null ? '' : <Col className="pt-2"><h5>Mainmovement {val.mainmovement.map((d) => {
                                                  return (
                                                       <>
                                                            <Row className="pt-2">
                                                                 <Col>
                                                                      <p>Content: {d.type === 'url' || 'text' ? d.value : d.name}</p>
                                                                      {d.type !== 'exercise' ? null : <p>Reps: {d.reps}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Weights: {d.weights}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Sets: {d.sets}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Duration: {d.duration}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Rest Time: {d.restTime}</p>}
                                                                 </Col>
                                                            </Row>
                                                       </>
                                                  )
                                             })}</h5></Col>}
                                        </Row>
                                        <Row>
                                             {val.cooldown === null ? '' : <Col className="pt-2"><h5>Cooldown {val.cooldown.map((d) => {
                                                  return (
                                                       <>
                                                            <Row className="pt-2">
                                                                 <Col>
                                                                      <p>Content: {d.type === 'url' || 'text' ? d.value : d.name}</p>
                                                                      {d.type !== 'exercise' ? null : <p>Reps: {d.reps}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Weights: {d.weights}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Sets: {d.sets}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Duration: {d.duration}</p>}
                                                                      {d.type !== 'exercise' ? null : <p>Rest Time: {d.restTime}</p>}
                                                                 </Col>
                                                            </Row>
                                                       </>
                                                  )
                                             })}</h5></Col>}
                                        </Row>
                                   </>
                              )
                         })}
                    </Tab>
                    <Tab eventKey="summary" title="Summary">
                         {data.map(val => {
                              return (
                                   <>
                                        <Row className="pt-3 align-items-center">
                                             <Col lg={1}>
                                                  <label>Intensity: </label>
                                             </Col>
                                             <Col lg={3}>
                                                  <InputGroup>
                                                       <FormControl value={val.intensity} disabled />
                                                  </InputGroup>
                                             </Col>
                                             <Col lg={1}>
                                                  <label>Benifits: </label>
                                             </Col>
                                             <Col lg={3}>
                                                  <InputGroup>
                                                       <FormControl value={val.About} disabled />
                                                  </InputGroup>
                                             </Col>
                                             <Col lg={1}>
                                                  <label>Calories: </label>
                                             </Col>
                                             <Col lg={3}>
                                                  <InputGroup>
                                                       <FormControl value={val.calories} disabled />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text id="basic-addon2">Kcal</InputGroup.Text>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                             </Col>
                                        </Row>
                                        <Row className="pt-3 align-items-center">
                                             <Col lg={1}>
                                                  <label>About: </label>
                                             </Col>
                                             <Col lg={9}>
                                                  <InputGroup>
                                                       <FormControl as="textarea" value={val.About} disabled />
                                                  </InputGroup>
                                             </Col>
                                        </Row>
                                   </>
                              )
                         })}
                    </Tab>
               </Tabs>}
               <CreateoreditWorkout ref={createEditWorkoutComponent}></CreateoreditWorkout>
          </>
     )
}

export default EventDetailModal;