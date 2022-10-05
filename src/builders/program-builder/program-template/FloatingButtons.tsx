/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import {  Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import CreateEditProgramManager from './create-edit/createoredit-workoutTemplate';
import CreateEditNewWorkout from './create-edit/createoredit-newWorkout';
import CreateEditNewActivity from './create-edit/createoredit-newActivity';
import CreateEditRestDay from './create-edit/createoredit-restDay';
import FitnessSvg from './assets/fitness.svg';
import NutritionSvg from './assets/nutrition.svg';
import ResourceSvg from './assets/resources.svg';
import UpdateSvg from './assets/update.svg';
import SettingSvg from './assets/settings.svg';
import { GET_SCHEDULEREVENTS } from "./queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from '../../../components/utils/responseFlatten';

const FloatingButton = (props: any) => {

     const createEditWorkoutTemplateComponent = useRef<any>(null);
     const createEditNewWorkoutComponent = useRef<any>(null);
     const createEditNewActivityComponent = useRef<any>(null);
     const createEditRestDayComponent = useRef<any>(null);
     const [existingEvents, setExistingEvents] = useState<any[]>([]);
     const [restDays, setRestDays] = useState<any[]>([]);
     const [renewalDate, setRenewalDate] = useState("");
     const program_id = window.location.pathname.split('/').pop();


     function FetchData() {
          useQuery(GET_SCHEDULEREVENTS, { variables: { id: program_id }, onCompleted: (e: any) => { 
               const flattenData = flattenObj({...e});
               // setExistingEvents(flattenData.fitnessprograms[0].events); setRestDays(flattenData.fitnessprograms[0].rest_days); setRenewalDate(flattenData.fitnessprograms[0].renewal_dt)
           } });
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
                              <Dropdown.Header style={{ color: 'black', fontWeight: 'bold', letterSpacing: '1px'}}>Fitness</Dropdown.Header>
                              <Dropdown.Divider/>
                              {window.location.pathname.split("/")[1] !== 'programs' && <Dropdown.Item eventKey="2" onClick={(e) => {
                                   props.callback2('block');
                              }}>Sessions</Dropdown.Item>}
                              <Dropdown.Item eventKey="1" onClick={(e) => {
                                   props.callback('block');
                              }}>Import Program Template</Dropdown.Item>
                              <Dropdown.Item eventKey="3" onClick={() => {
                                   createEditWorkoutTemplateComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>Import Workout</Dropdown.Item>
                              <Dropdown.Item eventKey="4" onClick={() => {
                                   createEditNewWorkoutComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>New Workout</Dropdown.Item>
                              <Dropdown.Item eventKey="5" onClick={() => {
                                   createEditNewActivityComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>New Activity</Dropdown.Item>
                              <Dropdown.Item eventKey="6" onClick={() => {
                                   createEditRestDayComponent.current.TriggerForm({ id: null, type: 'create' });
                              }}>Mark Rest Day</Dropdown.Item>
                         </DropdownButton>
                         </Row>
                         {/* <Row className="mt-3" style={{ justifyContent: 'center'}}>
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
                         </Row> */}
                         {/* <Row className="mt-3" style={{ justifyContent: 'center'}}>
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
                         </Row> */}
                         {/* <Row className="mt-3" style={{ justifyContent: 'center'}}>
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
                         </Row> */}
                         {/* <Row className="mt-3" style={{ justifyContent: 'center'}}>
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
                         </Row> */}
                    </Col>
                    <CreateEditProgramManager callback={props.callback3()} startDate={props.startDate} duration={props.duration} ref={createEditWorkoutTemplateComponent} events={existingEvents} renewalDate={renewalDate}></CreateEditProgramManager>
                    <CreateEditNewWorkout startDate={props.startDate} duration={props.duration} ref={createEditNewWorkoutComponent} events={existingEvents}></CreateEditNewWorkout>
                    <CreateEditNewActivity startDate={props.startDate} duration={props.duration} ref={createEditNewActivityComponent} events={existingEvents}></CreateEditNewActivity>
                    <CreateEditRestDay startDate={props.startDate} duration={props.duration} ref={createEditRestDayComponent} restDays={restDays}></CreateEditRestDay>
               </div>
          </>
     );
}

export default FloatingButton;