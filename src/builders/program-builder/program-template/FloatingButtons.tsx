import React, { useRef, useState } from 'react';
import {  Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import CreateEditProgramManager from './create-edit/createoredit-workoutTemplate';
import CreateEditNewWorkout from './create-edit/createoredit-newWorkout';
import CreateEditNewActivity from './create-edit/createoredit-newActivity';
import FitnessSvg from './assets/fitness.svg';
import NutritionSvg from './assets/nutrition.svg';
import ResourceSvg from './assets/resources.svg';
import UpdateSvg from './assets/update.svg';
import SettingSvg from './assets/settings.svg';
import { GET_SCHEDULEREVENTS } from "./queries";
import { useQuery } from "@apollo/client";

const FloatingButton = (props: any) => {

     const createEditProgramManagerComponent = useRef<any>(null);
     const createEditNewWorkoutComponent = useRef<any>(null);
     const createEditNewActivityComponent = useRef<any>(null);
     const [existingEvents, setExistingEvents] = useState<any[]>([]);
     const program_id = window.location.pathname.split('/').pop();

     function FetchData() {
          useQuery(GET_SCHEDULEREVENTS, { variables: { id: program_id }, onCompleted: (e: any) => { setExistingEvents(e.fitnessprograms[0].events) } });
     }

     FetchData();

     return (
          <>
               <div style={{ height: '100vh', width: '58px', position: 'fixed', right: '0px', top: '74px', zIndex: 999}} className="right-floating-menu">
                    <Col style={{ top: '50%', transform: 'translateY(-60%)'}}>
                         <Row className="" style={{ justifyContent: 'center'}}>
                         <DropdownButton
                              key={1}
                              drop='left'
                              title={<img src={FitnessSvg} style={{ cursor: 'pointer'}} title="movement" alt="fitness"/>}
                              style={{ backgroundColor: 'white !important'}}
                         >
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Movement</Dropdown.Header>
                              <Dropdown.Divider/>
                              <Dropdown.Item eventKey="1" onClick={(e) => {
                                   props.callback('block');
                              }}>Program Template</Dropdown.Item>
                              <Dropdown.Item eventKey="2" onClick={() => {
                                   createEditProgramManagerComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>Workout Template</Dropdown.Item>
                              <Dropdown.Item eventKey="3" onClick={() => {
                                   createEditNewWorkoutComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>New Workout</Dropdown.Item>
                              <Dropdown.Item eventKey="4" onClick={() => {
                                   createEditNewActivityComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>New Activity</Dropdown.Item>
                              <Dropdown.Item eventKey="5">Add Rest Day</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                         <Row className="mt-3" style={{ justifyContent: 'center'}}>
                         <DropdownButton
                              key={1}
                              drop='left'
                              title={<img src={NutritionSvg} title="nutrition" alt="nutrition"/> }
                              style={{ backgroundColor: 'white !important'}}
                         >
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Nutrition</Dropdown.Header>
                              <Dropdown.Divider/>
                              <Dropdown.Item eventKey="1">Add Consult</Dropdown.Item>
                              <Dropdown.Item eventKey="2">Build Meal Plan</Dropdown.Item>
                              <Dropdown.Item eventKey="3">Add Template</Dropdown.Item>
                              <Dropdown.Item eventKey="4">Add Food</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                         <Row className="mt-3" style={{ justifyContent: 'center'}}>
                         <DropdownButton
                              key={1}
                              drop='left'
                              title={<img src={ResourceSvg} title="resources" alt="resources"/>}
                              style={{ backgroundColor: 'white !important'}}
                         >
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Resources</Dropdown.Header>
                              <Dropdown.Divider/>
                              <Dropdown.Item eventKey="1">Add Notification</Dropdown.Item>
                              <Dropdown.Item eventKey="2">Add Message</Dropdown.Item>
                              <Dropdown.Item eventKey="3">Add Information<br/>bank</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                         <Row className="mt-3" style={{ justifyContent: 'center'}}>
                         <DropdownButton
                              key={1}
                              drop='left'
                              title={<img src={UpdateSvg} title="update" alt="update"/>}
                              style={{ backgroundColor: 'white !important'}}
                         >
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Update</Dropdown.Header>
                              <Dropdown.Divider/>
                              <Dropdown.Item eventKey="1">Request Photo</Dropdown.Item>
                              <Dropdown.Item eventKey="2">Request Feedback</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                         <Row className="mt-3" style={{ justifyContent: 'center'}}>
                         <DropdownButton
                              key={1}
                              drop='left'
                              title={<img src={SettingSvg} title="settings" alt="settings"/>}
                              style={{ backgroundColor: 'white !important'}}
                         >
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Settings</Dropdown.Header>
                              <Dropdown.Divider/>
                              <Dropdown.Item eventKey="1">Master Time</Dropdown.Item>
                              <Dropdown.Item eventKey="2">Master Mode</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                    </Col>
                    <CreateEditProgramManager ref={createEditProgramManagerComponent} events={existingEvents}></CreateEditProgramManager>
                    <CreateEditNewWorkout ref={createEditNewWorkoutComponent} events={existingEvents}></CreateEditNewWorkout>
                    <CreateEditNewActivity ref={createEditNewActivityComponent}></CreateEditNewActivity>
               </div>
          </>
     );
}

export default FloatingButton;