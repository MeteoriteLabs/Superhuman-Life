/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';
import { Row, Col, Dropdown, DropdownButton, Accordion, Card } from 'react-bootstrap';
import CreateEditProgramManager from './create-edit/createoredit-workoutTemplate';
import CreateEditNewWorkout from './create-edit/createoredit-newWorkout';
import CreateEditNewActivity from './create-edit/createoredit-newActivity';
import CreateEditRestDay from './create-edit/createoredit-restDay';
import FitnessSvg from './assets/fitness.svg';
import NutritionSvg from './assets/nutrition.svg';
import ResourceSvg from './assets/resources.svg';
import UpdateSvg from './assets/update.svg';
import SettingSvg from './assets/settings.svg';
import { GET_SCHEDULEREVENTS } from './queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../../../components/utils/responseFlatten';
import Icons from '../../../components/Icons';
import './styles.css';
import Event from '../../../pages/finance/Invoices/Event/Event';

const FloatingButton = (props: any) => {
    const createEditWorkoutTemplateComponent = useRef<any>(null);
    const createEditNewWorkoutComponent = useRef<any>(null);
    const createEditNewActivityComponent = useRef<any>(null);
    const createEditRestDayComponent = useRef<any>(null);
    const [existingEvents, setExistingEvents] = useState<any[]>([]);
    const [restDays, setRestDays] = useState<any[]>([]);
    const [renewalDate, setRenewalDate] = useState('');
    const program_id = window.location.pathname.split('/').pop();

    // var mini = true;
    const [mini, setMini] = useState(true);
    const [width, setWidth] = useState('250px');
    const [event, setEvent] = useState('');

    function toggleSidebar() {
        if (mini) {
            console.log('opening sidebar');
            // document.getElementById("mySidebar").style.width = "250px";
            // document.getElementById("main").style.marginLeft = "250px";
            setWidth('250px');
            setMini(false);
        } else {
            console.log('closing sidebar');
            // document.getElementById("mySidebar").style.width = "85px";
            // document.getElementById("main").style.marginLeft = "85px";
            setWidth('55px');
            setMini(true);
            setEvent('');
        }
    }

    return (
        <>
            {/* sidebar */}
            <div
                id="mySidebar"
                className="sidebar"
                style={{ width: `${width}` }}
                onMouseOver={() => toggleSidebar()}
                onMouseOut={() => toggleSidebar()}
            >
                <Accordion defaultActiveKey="">
                    {/* AI */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="ai"
                        className="bg-dark text-white border-dark"
                        onClick={() => setEvent('ai')}
                    >
                        <Icons name="ai" height={25} width={25} style={{ marginRight: '10px' }} />
                        <b>AI</b>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="ai">
                        <Card.Body>
                            <a href="#">
                                <span className="icon-text">Generate Workout</span>
                            </a>
                            <a href="#">
                                <span className="icon-text">Generate Program</span>
                            </a>
                        </Card.Body>
                    </Accordion.Collapse>

                    {/* Create */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="create"
                        className="text-white bg-dark"
                        onClick={() => setEvent('create')}
                    >
                        <Icons
                            name="create"
                            height={25}
                            width={25}
                            style={{ marginRight: '10px' }}
                        />
                        Create
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="create">
                        <Card.Body className="bg-dark">
                            {/* New workout */}
                            <a
                                href="#"
                                onClick={() => {
                                    createEditNewWorkoutComponent.current.TriggerForm({
                                        id: null,
                                        type: 'create'
                                    });
                                    setEvent('');
                                }}
                            >
                                <span className="icon-text">New Workout</span>
                            </a>
                            {/* Add activity */}
                            <a
                                href="#"
                                onClick={() => {
                                    createEditNewActivityComponent.current.TriggerForm({
                                        id: null,
                                        type: 'create'
                                    });

                                    setEvent('');
                                }}
                            >
                                <span className="icon-text">Add Activity</span>
                            </a>
                        </Card.Body>
                    </Accordion.Collapse>

                    {/* Library */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="library"
                        className="bg-dark text-white"
                        onClick={() => setEvent('library')}
                    >
                        <Icons
                            name="library"
                            height={25}
                            width={25}
                            style={{ marginRight: '10px' }}
                        />
                        Library
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="library">
                        <Card.Body>Hello! I am another body</Card.Body>
                    </Accordion.Collapse>

                    {/* Active programs */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="3"
                        className="bg-dark text-white"
                        onClick={() => setEvent('activeprograms')}
                    >
                        <Icons
                            name="activeprograms"
                            height={25}
                            width={25}
                            style={{ marginRight: '10px' }}
                        />
                        Active Programs
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="activeprograms">
                        <Card.Body>Hello! I am another body</Card.Body>
                    </Accordion.Collapse>

                    {/* Mark day */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="markday"
                        className="bg-dark text-white"
                        onClick={() => setEvent('markday')}
                    >
                        <Icons
                            name="markday"
                            height={25}
                            width={25}
                            style={{ marginRight: '10px' }}
                        />
                        Mark Day
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="markday">
                        <Card.Body>
                            <a
                                href="#"
                                onClick={() => {
                                    props.restDayCallback();
                                }}
                            >
                                <span className="icon-text">Mark Rest Day</span>
                            </a>
                        </Card.Body>
                    </Accordion.Collapse>

                    {/* Views */}
                    <Accordion.Toggle
                        as={Card.Header}
                        eventKey="views"
                        className="bg-dark text-white"
                        onClick={() => setEvent('views')}
                    >
                        <Icons
                            name="view"
                            height={25}
                            width={25}
                            style={{ marginRight: '10px', marginTop: '5px' }}
                        />
                        <span className="ml-1">Views</span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="views">
                        <Card.Body>Hello! I am another body</Card.Body>
                    </Accordion.Collapse>
                </Accordion>
            </div>

            {/* <div
        //         style={{
        //             height: '100vh',
        //             width: '58px',
        //             position: 'fixed',
        //             right: '0px',
        //             top: '74px',
        //             zIndex: 999
        //         }}
        //         className="right-floating-menu"
        //     > *
        //         <Col 
        //         // style={{ top: '50%', transform: 'translateY(-60%)' }}
        //         >
        //             <Row className="" style={{ justifyContent: 'center' }}>
        //                 <DropdownButton
        //                     variant="dark"
        //                     key={1}
        //                     className='mb-5'
        //                     // drop="left"
        //                     title=
        //                     "Select Operation"
        //                     // {
        //                     //     <img
        //                     //         src={FitnessSvg}
        //                     //         style={{ cursor: 'pointer' }}
        //                     //         title="movement"
        //                     //         alt="fitness"
        //                     //     />
        //                     // }
        //                     style={{ backgroundColor: 'white !important' }}
        //                 >
        //                     <Dropdown.Header
        //                         style={{
        //                             overflow: 'auto',
        //                             color: 'black',
        //                             fontWeight: 'bold',
        //                             letterSpacing: '1px'
        //                         }}
        //                     >
        //                         Fitness
        //                     </Dropdown.Header>
        //                     <Dropdown.Divider />
        //                     {window.location.pathname.split('/')[1] !== 'programs' && (
        //                         <Dropdown.Item
        //                             eventKey="2"
        //                             onClick={(e) => {
        //                                 props.callback2('block');
        //                             }}
        //                         >
        //                             Sessions
        //                         </Dropdown.Item>
        //                     )}
        //                     <Dropdown.Item
        //                         className="text-wrap"
        //                         eventKey="1"
        //                         onClick={(e) => {
        //                             props.callback('block');
        //                         }}
        //                     >
        //                         Import Program Template
        //                     </Dropdown.Item>
        //                     <Dropdown.Item
        //                         eventKey="3"
        //                         onClick={() => {
        //                             createEditWorkoutTemplateComponent.current.TriggerForm({
        //                                 id: null,
        //                                 type: 'create'
        //                             });
        //                         }}
        //                     >
        //                         Import Workout
        //                     </Dropdown.Item>
        //                     <Dropdown.Item
        //                         eventKey="4"
        //                         onClick={() => {
        //                             createEditNewWorkoutComponent.current.TriggerForm({
        //                                 id: null,
        //                                 type: 'create'
        //                             });
        //                         }}
        //                     >
        //                         New Workout
        //                     </Dropdown.Item>
        //                     <Dropdown.Item
        //                         eventKey="5"
        //                         onClick={() => {
        //                             createEditNewActivityComponent.current.TriggerForm({
        //                                 id: null,
        //                                 type: 'create'
        //                             });
        //                         }}
        //                     >
        //                         New Activity
        //                     </Dropdown.Item>
        //                     <Dropdown.Item
        //                         eventKey="6"
        //                         onClick={() => {
        //                             props.restDayCallback();
        //                         }}
        //                     >
        //                         <i
        //                             style={{
        //                                 display: `${
        //                                     props.showRestDayAction ? 'inline-block' : 'none'
        //                                 }`
        //                             }}
        //                             className="fa fa-check text-success"
        //                         ></i>{' '}
        //                         Mark Rest Day
        //                     </Dropdown.Item>
        //                 </DropdownButton>
        //             </Row>
                          //         </Col> */}
            <CreateEditProgramManager
                clientIds={props.clientIds}
                sessionIds={props.sessionIds}
                callback={props.callback3}
                startDate={props.startDate}
                duration={props.duration}
                ref={createEditWorkoutTemplateComponent}
                events={existingEvents}
                renewalDate={renewalDate}
            ></CreateEditProgramManager>
            <CreateEditNewWorkout
                clientIds={props.clientIds}
                sessionIds={props.sessionIds}
                callback={props.callback3}
                startDate={props.startDate}
                duration={props.duration}
                ref={createEditNewWorkoutComponent}
                events={existingEvents}
            ></CreateEditNewWorkout>
            <CreateEditNewActivity
                clientIds={props.clientIds}
                sessionIds={props.sessionIds}
                callback={props.callback3}
                startDate={props.startDate}
                duration={props.duration}
                ref={createEditNewActivityComponent}
                events={existingEvents}
            ></CreateEditNewActivity>
            <CreateEditRestDay
                startDate={props.startDate}
                duration={props.duration}
                ref={createEditRestDayComponent}
                restDays={restDays}
            ></CreateEditRestDay>
        </>
    );
};

export default FloatingButton;
