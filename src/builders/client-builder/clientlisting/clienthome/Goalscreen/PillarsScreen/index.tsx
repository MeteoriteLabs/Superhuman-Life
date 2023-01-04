import React, { useState } from 'react';
import { Row, Col, Button, Card, Tabs, Tab, Spinner } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import PillarCard from "./pillarCard"; 
import { useQuery } from "@apollo/client";
import { GET_USER_GOAL } from './queries';
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { flattenObj } from '../../../../../'
import { flattenObj } from '../../../../../../components/utils/responseFlatten';

const PillarScreen = () => {

     const last = window.location.pathname.split("/").pop();
     const goalId = window.location.pathname.split("/")[2];

     const [goalData, setGoalData] = useState<any>([]);
     const [show, setShow] = useState(false);

     const goalQuery = useQuery(GET_USER_GOAL, {variables: { id: goalId }, onCompleted: (data) => {
          const flattenData = flattenObj({...data});
          setGoalData(flattenData.userGoals[0]);
          setShow(true);
     }});




     var settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
          responsive: [
               {
                    breakpoint: 1350,
                    settings: {
                         slidesToShow: 2,
                         slidesToScroll: 2,
                         infinite: true,
                         dots: true,
                    },
               },
               {
                    breakpoint: 600,
                    settings: {
                         slidesToShow: 1,
                         slidesToScroll: 1,
                         initialSlide: 1,
                    },
               },
          ],
     };

     const BasicCard = (props: any) => {
          return (
               <Col lg={2}>
                    <Card
                         bg={'light'}
                         key={'light'}
                         style={{ border: 'none', borderRadius: '20px' }}
                         // text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                         className="mb-2 shadow-lg"
                         onClick={props.onClick}
                    >
                         <Card.Body>
                              <div className="text-center p-2">
                                   <span style={{ color: '#414141', fontWeight: 'bold' }}>{props.title}</span><br />
                              </div>
                              <div className='text-center p-2'>

                                   <span style={{ color: '#414141' }}>1000 steps</span>
                              </div>
                              <div className="text-center mt-3">
                                   <Col>
                                        <Row>
                                             <Col>
                                             <img
                                                  src="https://picsum.photos/200/100" alt='profile-pic'
                                                  style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                             </Col>
                                             <Col>
                                                  <span style={{ color: 'gray', fontSize: "12px", fontWeight: 'bold'}}>Arjun Nair </span>
                                             </Col>
                                        </Row>
                                   </Col>
                              </div>
                         </Card.Body>
                    </Card>
               </Col>
          )
     }

     const HabitCard = (props: any) => {
          return (
               <Col lg={6}>
                    <Card
                         bg={'light'}
                         key={'light'}
                         style={{ border: 'none', borderRadius: '20px' }}
                         // text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                         className="m-3 shadow-lg"
                         onClick={props.onClick}
                    >
                         <Card.Body style={{ padding: '0px'}}>
                              <div>
                                   <Row>
                                        <Col className="text-center p-4"  lg={2} style={{ verticalAlign: 'middle' ,backgroundColor: "#FFEFC5", borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px'}}>
                                             <img src={props.imgProp} alt="siren" width={70} height={70}/>
                                        </Col>
                                        <Col lg={10}>
                                             <Row className="p-2">
                                                  <h4>{props.title}</h4>
                                             </Row>
                                             <Row className="p-2">
                                                  Lorem epsum Lorem epsumLorem epsumLorem epsumLorem epsumLorem epsum Lorem  psum Lorem epsumLorem epsum
                                             </Row>
                                        </Col>
                                   </Row>
                              </div>
                         </Card.Body>
                    </Card>
               </Col>
          )
     }

     if(!show){
          return (
               <div className="text-center">
                    <Spinner animation="border" variant="danger" />
                    <br />
                    <div className='mt-3' style={{ fontWeight: 'bold'}}>Loading Data...</div>
               </div>
          )
     }else return (
          <div>
               <div className="mb-3">
                    <span style={{ fontSize: '30px'}}>
                         <Link to={`/client/home/${last}`}><i className="fa fa-arrow-circle-left" style={{ color: 'black'}}></i></Link>
                         <b> {goalData?.goals[0]?.name}</b>
                    </span>
               </div>
               <div className='p-3' style={{ backgroundColor: '#FFEFC5', borderRadius: '15px'}}>
                    <Row className='p-3' style={{ justifyContent: 'space-between' }}>
                         <div>
                              <h2>Pillars</h2>
                         </div>
                         <div>
                              <Button variant='outline-dark'>+ Add New Pillar</Button>
                         </div>
                    </Row>
                    <div className="w-95 ml-5 mr-5 mt-3 p-5">
                         <Slider {...settings}>
                              <PillarCard imgProp={'/assets/salad-pillar.svg'} title={'Eat Healthy'}/>
                              <PillarCard imgProp={'/assets/shoe-pillar.svg'} title={'Move more'}/>
                              <PillarCard imgProp={'/assets/salad-pillar.svg'} title={'Eat Healthy'}/>
                              <PillarCard imgProp={'/assets/shoe-pillar.svg'} title={'Move more'}/>
                              {/* <PillarCard />
                              <PillarCard />
                              <PillarCard /> */}
                         </Slider>
                    </div>
                    
               </div>
               <div className='p-3'>
                    <Row className='p-3' style={{ justifyContent: 'space-between' }}>
                         <div>
                              <h2>Targets</h2>
                         </div>
                         <div>
                              <Button variant='outline-dark'>+ Add Target</Button>
                         </div>
                    </Row>
                    <Row className="justify-content-center">
                         <BasicCard title={'General'} description={"20 min / daily"}/>
                         <BasicCard title={'Steps'} description={"20 min / daily"}/>
                         <BasicCard title={'Steps'} description={"20 min / daily"}/>
                         <BasicCard title={'General'} description={"20 min / daily"}/>
                    </Row>
               </div>
               <div className='p-3'>
                    <Row className='p-3' style={{ justifyContent: 'space-between' }}>
                         <div>
                              <h2>Habits</h2>
                         </div>
                    </Row>
                    <Row className="justify-content-center">
                         <HabitCard imgProp={'/assets/siren-pillar.svg'} title={'Off-track alerts'} />
                         <HabitCard imgProp={'/assets/community-pillar.svg'} title={'Support from Community'} />
                         <HabitCard imgProp={'/assets/certificate-pillar.svg'} title={'Note to future self'} />
                         <HabitCard imgProp={'/assets/money-pillar.svg'} title={'Bet with a buddy'} />
                    </Row>
               </div>
               <div className='p-3'>
                    <Row className='p-3' style={{ justifyContent: 'space-between' }}>
                         <div>
                              <h2>Actions</h2>
                         </div>
                    </Row>
                    <div className='p-3' style={{ backgroundColor: '#FFEFC5', borderRadius: '15px'}}>
                    <Tabs variant='pills' className="justify-content-center" defaultActiveKey="all" id="uncontrolled-tab-example">
                         <Tab eventKey="all" title="All">
                         </Tab>
                         <Tab eventKey="notCompleted" title="Not Completed">
                         </Tab>
                         <Tab eventKey="completed" title="Completed">
                         </Tab>
                    </Tabs>
                    </div>
               </div>
          </div>
     );
}

export default PillarScreen;