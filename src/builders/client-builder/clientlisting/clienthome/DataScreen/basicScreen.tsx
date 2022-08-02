import React from 'react';
import { Card, Row, Col, ProgressBar, Button, Modal, Form} from 'react-bootstrap';
import './styles.css';

const BasicScreen = (props: any) => {

     const [generalModalShow, setGeneralModalShow] = React.useState(false);

     function HobbiedCard(props: any){
          return (
               <Col lg={4}>
                    <div
                         style={{ cursor: 'pointer', borderRadius: '10px', border: '2px solid #ccc' }}
                         // text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                         className="mb-2 card-hover shadow-sm text-center"
                         // onClick={}
                    >
                         <span style={{ fontWeight: 'bold'}}>{props.title}</span>
                    </div>
               </Col>
          )
     }

     function HandleGeneralForm(props: any){
          return (
               <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
               >
                    <Modal.Body>
                    <div>
                         <Row>
                              <Col>
                                   <h5>General Data</h5>
                              </Col>
                              <Col>
                                   <span style={{ color: 'gray'}}>Last Updated: 25/06/2021. 04:20 pm</span>
                              </Col>
                         </Row>
                    </div>
                    <hr />
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>Blood Group</h6>
                         </Col>
                         <Col>
                              <Form.Control as="select">
                                   <option>O+</option>
                                   <option>O-</option>
                                   <option>A+</option>
                                   <option>A-</option>
                                   <option>B+</option>
                                   <option>B-</option>
                                   <option>AB+</option>
                                   <option>AB-</option>
                              </Form.Control>
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>Relationship Status</h6>
                         </Col>
                         <Col>
                              <Form.Control as="select">
                                   <option>Single</option>
                                   <option>Married</option>
                                   <option>Prefer Not to say</option>
                              </Form.Control>
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>No. Of Kids</h6>
                         </Col>
                         <Col>
                              <Form.Control aria-label="Small" type='number' placeholder='none' aria-describedby="inputGroup-sizing-sm" />
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>Type of family</h6>
                         </Col>
                         <Col>
                              <Form.Control aria-label="Small" type='text' placeholder='joint family' aria-describedby="inputGroup-sizing-sm" />
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>Where do you live</h6>
                         </Col>
                         <Col>
                              <Form.Control aria-label="Small" type='text' placeholder='In the heart of the city' aria-describedby="inputGroup-sizing-sm" />
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>I live at a</h6>
                         </Col>
                         <Col>
                              <Form.Control aria-label="Small" type='text' placeholder='Apartment' aria-describedby="inputGroup-sizing-sm" />
                         </Col>
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={3}>
                              <h6>My Hobbies</h6>
                         </Col>
                         <Col>
                              <Row>
                                   <HobbiedCard title={'Books'}/>
                                   <HobbiedCard title={'Internet'}/>
                                   <HobbiedCard title={'Sports'}/>
                                   <HobbiedCard title={'Movies'}/>
                                   <HobbiedCard title={'TV series'}/>
                              </Row>
                         </Col> 
                    </Row>
                    <Row className='ml-2 mr-2 mb-2'>
                         <Col lg={{ span: 9, offset: 3}}>
                              <Row>
                                   <span>Other ?</span>
                              </Row>
                              <Row>
                                   <Form.Control aria-label="Small" type='text' placeholder='Apartment' aria-describedby="inputGroup-sizing-sm" />
                              </Row>
                         </Col>
                    </Row>
                    </Modal.Body>
                    <Modal.Footer>
                         <Button variant='warning' onClick={props.onHide}>Edit</Button>
                         <Button variant='success' onClick={props.onHide}>Save</Button>
                    </Modal.Footer>
               </Modal>
          )
     };

     const BasicCard = (props: any) => {
          return (
               <Col lg={4}>
                    <Card
                         bg={'light'}
                         key={'light'}
                         style={{ cursor: 'pointer' }}
                         // text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                         className="mb-2 card-hover"
                         onClick={props.onClick}
                    >
                         <Card.Body>
                              <Row>
                                   <Col>
                                        <Card.Title>{props.title}</Card.Title>
                                   </Col>
                                   <Col>
                                        <ProgressBar striped variant={props.color} now={props.value} />
                                        <div className='text-center'><span style={{ color: 'gray'}}>{`Completed ${props.value}%`}</span></div>
                                   </Col>
                              </Row>
                         </Card.Body>
                         <Card.Footer>
                              <Row className="text-center">
                                   <Col>
                                        <span style={{ color: 'gray'}}>Updated on: 15/06/2021</span>
                                   </Col>
                                   <Col>
                                        <Row>
                                             <Col>
                                                  <span style={{ color: 'gray', fontSize: "14px"}}>Updated By: </span>
                                                  <span style={{ color: 'gray', fontSize: "12px", fontWeight: 'bold'}}>test </span>
                                             </Col>
                                             <Col>
                                             <img
                                                  src="https://picsum.photos/200/100" alt='profile-pic'
                                                  style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                             </Col>
                                        </Row>
                                   </Col>
                              </Row>
                         </Card.Footer>
                    </Card>
               </Col>
          )
     }

     function handleProgressColor(value: number){
          if(value === 0){
               return 'danger';
          }
          else if(value >= 1 && value <= 99){
               return 'warning';
          }else if(value === 100){
               return 'success';
          }
     }

     return (
          <div>
               <Row>
                    <BasicCard title={'General'} color={handleProgressColor(100)} value={100} onClick={() => setGeneralModalShow(true)}/>
                    <BasicCard title={'Lifestyle'} color={handleProgressColor(60)} value={60}/>
                    <BasicCard title={'Work'} color={handleProgressColor(0)} value={0}/>
                    <BasicCard title={'Education'} color={handleProgressColor(100)} value={100}/>
                    <BasicCard title={'Declaration'} color={handleProgressColor(5)} value={5}/>
               </Row>
               <HandleGeneralForm
                    show={generalModalShow}
                    onHide={() => setGeneralModalShow(false)}
               />
          </div>
     );
};

export default BasicScreen;