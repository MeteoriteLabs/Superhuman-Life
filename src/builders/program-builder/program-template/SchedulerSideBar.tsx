import { Accordion, Button, Form, Nav } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import Icon from 'components/Icons';
import CreateEditProgramManager from './create-edit/createoredit-workoutTemplate';
import CreateEditNewWorkout from './create-edit/createoredit-newWorkout';
import CreateEditNewActivity from './create-edit/createoredit-newActivity';
import CreateEditRestDay from './create-edit/createoredit-restDay';
import './sidebar.css';

export default function SideNav({
    collapse,
    setCollapse,
    clientIds,
    sessionIds,
    startDate,
    duration,
    callback,
    callback2,
    callback3,
    restDayCallback,
    showRestDayAction,
    accordionExpanded,
    onAccordionToggle,
    show24HourFormat,
    setShow24HourFormat,
    showBlockedSlots,
    setShowBlockedSlots,
    handleScrollScheduler,
    type,
    sessionDate,
    days
}: {
    collapse: boolean;
    setCollapse: (arg: boolean) => void;
    clientIds?: any;
    sessionIds: any;
    startDate?: any;
    duration: any;
    callback: any;
    callback2: any;
    callback3: any;
    restDayCallback: any;
    showRestDayAction: any;
    accordionExpanded: any;
    onAccordionToggle: any;
    showBlockedSlots: boolean;
    setShowBlockedSlots: (parmas: boolean) => void;
    show24HourFormat: boolean;
    handleScrollScheduler: () => void;
    setShow24HourFormat: (parmas: boolean) => void;
    type?: string;
    sessionDate?: string;
    days?: number;
}): JSX.Element {
    const createEditWorkoutTemplateComponent = useRef<any>(null);
    const createEditNewWorkoutComponent = useRef<any>(null);
    const createEditNewActivityComponent = useRef<any>(null);
    const createEditRestDayComponent = useRef<any>(null);
    const [existingEvents, setExistingEvents] = useState<any[]>([]);
    const [restDays, setRestDays] = useState<any[]>([]);
    const [renewalDate, setRenewalDate] = useState('');

    const [accordionOpen, setAccordionOpen] = useState(accordionExpanded);
    const [activeKey, setActiveKey] = useState('');

    // Sync accordionOpen with accordionExpanded prop
    useEffect(() => {
        setAccordionOpen(accordionExpanded);
    }, [accordionExpanded]);

    // Close the accordion when the sidebar is collapsed
    useEffect(() => {
        if (collapse) {
            setAccordionOpen(false);
            setActiveKey('');
        }
    }, [collapse]);

    const handleSidebarToggle = () => {
        setCollapse(!collapse);
        setAccordionOpen(false); // Close the accordion when the sidebar is collapsed
        setActiveKey('');
    };

    const handleAccordionToggle = (eventKey) => {
        if (activeKey === eventKey) {
            setActiveKey(''); // Close the accordion when clicking on the same tab again
            setAccordionOpen(false);
        } else {
            setActiveKey(eventKey);
            setAccordionOpen(true);
        }
    };

    return (
        <>
            <aside
                style={{ position: 'fixed', height: '100%', right: '0', top: '0' }}
                className="bg-dark"
            >
                <hr />
                <Nav className="flex-column ">
                    <Accordion as={Nav} className="flex-column mt-5">
                        {/* AI */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="ai"
                                style={{ color: '#cebaa8' }}
                                className={`d-flex ${
                                    activeKey === 'ai' && !collapse ? 'active' : ''
                                }`}
                                onClick={() => handleAccordionToggle('ai')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="ai"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />
                                        AI
                                    </>
                                ) : (
                                    <Icon
                                        name="ai"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px', marginTop: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="ai"
                                    in={activeKey === 'ai' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Nav.Link className="text-white">Generate workout</Nav.Link>
                                        <Nav.Link className="text-white">Generate workout</Nav.Link>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>

                        {/* Create */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="create"
                                className={`d-flex ${
                                    activeKey === 'create' && !collapse ? 'active' : ''
                                }`}
                                style={{ color: '#cebaa8' }}
                                onClick={() => handleAccordionToggle('create')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="create"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />{' '}
                                        Create
                                    </>
                                ) : (
                                    <Icon
                                        name="create"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="create"
                                    in={activeKey === 'create' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                handleScrollScheduler();
                                                createEditNewWorkoutComponent.current.TriggerForm({
                                                    id: null,
                                                    type: 'create'
                                                });
                                            }}
                                        >
                                            Create workout
                                        </Nav.Link>
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                handleScrollScheduler();
                                                createEditNewActivityComponent.current.TriggerForm({
                                                    id: null,
                                                    type: 'create'
                                                });
                                            }}
                                        >
                                            Add activity
                                        </Nav.Link>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>

                        {/* Library */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="library"
                                style={{ color: '#cebaa8' }}
                                className={`d-flex ${
                                    activeKey === 'library' && !collapse ? 'active' : ''
                                }`}
                                onClick={() => handleAccordionToggle('library')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="library"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />{' '}
                                        Library
                                    </>
                                ) : (
                                    <Icon
                                        name="library"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="library"
                                    in={activeKey === 'library' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                handleScrollScheduler();
                                                createEditWorkoutTemplateComponent.current.TriggerForm(
                                                    {
                                                        id: null,
                                                        type: 'create'
                                                    }
                                                );
                                            }}
                                        >
                                            Import workout
                                        </Nav.Link>
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                callback('block');
                                            }}
                                        >
                                            Import template
                                        </Nav.Link>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>

                        {/* Active programs */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="activeprogram"
                                style={{ color: '#cebaa8' }}
                                className={`d-flex ${
                                    activeKey === 'activeprogram' && !collapse ? 'active' : ''
                                }`}
                                onClick={() => handleAccordionToggle('activeprogram')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="activeprograms"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />{' '}
                                        Active Programs
                                    </>
                                ) : (
                                    <Icon
                                        name="activeprograms"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="activeprogram"
                                    in={activeKey === 'activeprogram' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                callback2('block');
                                            }}
                                        >
                                            Import sessions
                                        </Nav.Link>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>

                        {/* Mark day */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="markday"
                                className={`d-flex ${
                                    activeKey === 'markday' && !collapse ? 'active' : ''
                                }`}
                                style={{ color: '#cebaa8' }}
                                onClick={() => handleAccordionToggle('markday')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="markday"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />{' '}
                                        Mark day
                                    </>
                                ) : (
                                    <Icon
                                        name="markday"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="markday"
                                    in={activeKey === 'markday' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Nav.Link
                                            className="text-white"
                                            onClick={() => {
                                                restDayCallback();
                                            }}
                                        >
                                            Mark rest day
                                        </Nav.Link>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>

                        {/* Views */}
                        <Nav.Item>
                            <Accordion.Toggle
                                as={Nav.Link}
                                eventKey="views"
                                className={`d-flex ${
                                    activeKey === 'views' && !collapse ? 'active' : ''
                                }`}
                                style={{ color: '#cebaa8' }}
                                onClick={() => handleAccordionToggle('views')}
                            >
                                {!collapse ? (
                                    <>
                                        <Icon
                                            name="view"
                                            height={25}
                                            width={25}
                                            style={{ marginRight: '10px' }}
                                        />{' '}
                                        Views
                                    </>
                                ) : (
                                    <Icon
                                        name="view"
                                        height={25}
                                        width={25}
                                        style={{ marginRight: '10px' }}
                                    />
                                )}
                            </Accordion.Toggle>
                            {!collapse ? (
                                <Accordion.Collapse
                                    eventKey="views"
                                    in={activeKey === 'views' && accordionOpen}
                                >
                                    <Nav className="flex-column pl-3">
                                        <Form.Check
                                            type="switch"
                                            id="availability"
                                            label="Availaibility"
                                            className="text-white mt-2"
                                            defaultChecked={showBlockedSlots}
                                            onChange={() => {
                                                setShowBlockedSlots(!showBlockedSlots);
                                                handleScrollScheduler();
                                            }}
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="rotine"
                                            label="Routine"
                                            className="text-white mt-2"
                                            onChange={() => {
                                                // setShow24HourFormat(!show24HourFormat);
                                                handleScrollScheduler();
                                            }}
                                        />

                                        <Form className="d-flex">
                                            <Form.Check
                                                type="switch"
                                                id="timeformat"
                                                label="24 hour"
                                                className="text-white mt-2"
                                                onChange={() => {
                                                    setShow24HourFormat(!show24HourFormat);
                                                    handleScrollScheduler();
                                                }}
                                            />
                                        </Form>
                                    </Nav>
                                </Accordion.Collapse>
                            ) : null}
                        </Nav.Item>
                    </Accordion>
                </Nav>

                {/* Collapse/Expand button */}
                <Button
                    variant="dark"
                    onClick={handleSidebarToggle}
                    className="mt-5 nav-link d-flex"
                >
                    {collapse ? (
                        <i className="fas fa-angle-double-left"></i>
                    ) : (
                        <>
                            <div className="mb-1">
                                <i className="fas fa-angle-double-right mr-sm-2 mt-1"></i>Collapse
                            </div>
                        </>
                    )}
                </Button>
            </aside>
            <CreateEditProgramManager
                clientIds={clientIds}
                sessionIds={sessionIds}
                callback={callback3}
                startDate={startDate}
                duration={duration}
                ref={createEditWorkoutTemplateComponent}
                events={existingEvents}
                renewalDate={renewalDate}
            ></CreateEditProgramManager>
            <CreateEditNewWorkout
                type={type}
                clientIds={clientIds}
                sessionIds={sessionIds}
                callback={callback3}
                startDate={startDate}
                duration={duration}
                ref={createEditNewWorkoutComponent}
                events={existingEvents}
                sessionDate={sessionDate}
                days={days}
            ></CreateEditNewWorkout>
            <CreateEditNewActivity
                clientIds={clientIds}
                sessionIds={sessionIds}
                callback={callback3}
                startDate={startDate}
                duration={duration}
                ref={createEditNewActivityComponent}
                events={existingEvents}
            ></CreateEditNewActivity>
            <CreateEditRestDay
                startDate={startDate}
                duration={duration}
                ref={createEditRestDayComponent}
                restDays={restDays}
            ></CreateEditRestDay>
        </>
    );
}
