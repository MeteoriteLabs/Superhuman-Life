import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Row, Col, Tab, Tabs, InputGroup, FormControl } from 'react-bootstrap';
import './styles.css';
import { GET_SCHEDULEREVENTS, PROGRAM_EVENTS, UPDATE_FITNESSPROGRAMS, FETCH_EVENT } from './queries';
import { useQuery, useMutation } from "@apollo/client";
import ProgramList from "../../../components/customWidgets/programList";
import FloatingButton from './FloatingButtons';
import TimeField from '../../../components/customWidgets/timeField';
import CreateoreditWorkout from '../workout/createoredit-workout';

const Schedular = (props: any) => {

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<any[]>([]);
    const [event, setEvent] = useState<any>({});
    const [arr, setArr] = useState<any[]>([]);
    const [program, setProgram] = useState('none');
    const program_id = window.location.pathname.split('/').pop();
    const schedulerDay: any = require("./json/scheduler-day.json");

    function Fetchdata(_variables: any) {
        useQuery(GET_SCHEDULEREVENTS, { variables: _variables, onCompleted: handleRenderTable });
    }

    function draganddrop() {
        const draggable: any = document.querySelectorAll('.schedular-content');
        const container: any = document.querySelectorAll('.container');
        // const resizer: any = document.getElementById('dragMe');



        draggable.forEach(drag => {
            drag.addEventListener('dragstart', () => {
                drag.classList.add('dragging');
            });

            drag.addEventListener('dragend', () => {
                drag.classList.remove('dragging');
            });
        })

        container.forEach(con => {
            con.addEventListener('dragover', e => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(con, e.clientY);
                if (afterElement === null) {
                    con.appendChild(draggable);
                } else {
                    if (afterElement !== undefined && draggable !== undefined) {
                        con.insertBefore(draggable, afterElement);
                    }
                }
                if (draggable !== undefined && afterElement !== undefined) {
                    con.appendChild(draggable);
                }
            });
        })

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

            draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child }
                } else {
                    return closest;
                }
            }, { offset: Number.POSITIVE_INFINITY })
        }
    }

    setTimeout(() => {
        draganddrop();
    }, 200)

    function handleRenderTable(data: any) {
        for (var d = 1; d <= props.days; d++) {
            arr[d] = JSON.parse(JSON.stringify(schedulerDay));
        }
        if (data.fitnessprograms[0].events) {
            data.fitnessprograms[0].events.forEach((val) => {
                var startTimeHour: any = `${val.startTime === undefined ? '0' : val.startTime.split(':')[0]}`;
                var startTimeMinute: any = `${val.startTime === undefined ? '0' : val.startTime.split(':')[1]}`;
                var endTimeHour: any = `${val.endTime === undefined ? '0' : val.endTime.split(':')[0]}`;
                var endTimeMin: any = `${val.endTime === undefined ? '0' : val.endTime.split(':')[1]}`;
                if (!arr[val.day][startTimeHour][startTimeMinute]) {
                    arr[val.day][startTimeHour][startTimeMinute] = [];
                }
                arr[val.day][startTimeHour][startTimeMinute].push({
                    "title": val.name, "color": "skyblue",
                    "day": val.day, "hour": startTimeHour, "min": startTimeMinute, "type": val.type,
                    "endHour": endTimeHour, "endMin": endTimeMin, "id": val.id
                });
            })
        }
    }

    const hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const days: number[] = [];
    const min: number[] = [0, 15, 30, 45];

    function handleDays() {
        for (var i = 1; i <= props.days; i++) {
            days.push(i);
        }
    }

    handleDays();
    Fetchdata({ id: props.programId });

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 2000)
    }, [show]);

    console.log(arr);

    function handleChange(d: any, h: any, m: any, event: any) {
        console.log(d, h, m);
        console.log(event);
        const values = [...arr];
        if (event.day) {
            values[event.day][event.hour][event.min].splice(event.index, 1);
        }
        if (d === undefined || h === undefined || m === undefined) {
            return;
        }
        if (!values[d][h][m]) {
            values[d][h][m] = [];
        }
        const diff = handleHeight(event) / 15;
        var sh = parseInt(h);
        var sm = parseInt(m);
        for (var i = 0; i < diff; i++) {
            sm += 15;
            if (sm === 60) {
                sh++;
                sm = 0;
            }
        }

        values[d][h][m].push({ "title": event.title, "color": event.color, "day": d, "hour": h, "min": m, "endHour": sh, "endMin": sm });
        setArr(values);
    }

    function handleFloatingActionProgramCallback(event: any) {
        setProgram(`${event}`);
    }


    function handleRestDays(val: any) {
        if (props.restDays) {
            for (var i = 0; i < props.restDays.length; i++) {
                if (val === props.restDays[i].day) {
                    return 'rgba(255,165,0)';
                }
            }
        }
        return 'white';
    }

    function handleHeight(val: any) {
        var starth = parseInt(val.hour);
        var startm = parseInt(val.min);
        var endh = parseInt(val.endHour);
        var endm = parseInt(val.endMin);

        var calculatedH = (endh - starth);
        var calculatedM = (endm - startm);
        var height = (((calculatedH * 4) * 15) + calculatedM);
        return height;
    }

    function FetchProgramEvents(_variables: {}) {
        useQuery(PROGRAM_EVENTS, { variables: _variables, onCompleted: (r) => { loadProgramEvents(r); } });
    }

    function loadProgramEvents(r: any) {
        setCurrentProgram([...r.fitnessprograms[0].events] ? r.fitnessprograms[0].events : []);
    }

    FetchProgramEvents({ id: program_id });

    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, { onCompleted: (r: any) => { console.log(r) } });

    var changedTime: any;
    function handleTimeChange(e: any) {
        changedTime = e;
    }

    function handleSaveChanges(e: any) {
        let values = [...currentProgram];
        let newEvent: any = {};
        let a = values.find((val) => val.id === event.id && val.day === event.day && val.startTime === event.hour + ":" + event.min && val.endTime === event.endHour + ":" + event.endMin);
        let b = values.findIndex((val) => val.id === event.id && val.day === event.day && val.startTime === event.hour + ":" + event.min && val.endTime === event.endHour + ":" + event.endMin);
        console.log(a);
        if (a) {
            newEvent.id = a.id;
            newEvent.name = a.name;
            newEvent.startTime = e.startChange;
            newEvent.endTime = e.endChange;
            newEvent.type = a.type;
            newEvent.day = a.day;

            values.splice(b, 1);
            values.push(newEvent);
            updateProgram({
                variables: {
                    programid: program_id,
                    events: values
                }
            })
        }
    }
    var changedDay;
    var changedHour;
    var changedEvent;
    var changedMin;
    const handleClose = () => { setData([]); setShowModal(false) };
    const handleShow = () => setShowModal(true);
    const [data, setData] = useState<any[]>([]);
    const [startChange, setStartChange] = useState("");
    const createEditWorkoutComponent = useRef<any>(null);
    const [endChange, setEndChange] = useState("");

    function handleStart(e: any) {
        setStartChange(e);
    }

    function handleEnd(e: any) {
        setEndChange(e);
    }
    handleTimeChange({ startChange, endChange });


    function DetailModal() {

        function FetchDataWorkout(_variables: {}) {
            useQuery(FETCH_EVENT, { variables: _variables, onCompleted: (r) => { loadDataWorkout(r); } });
        }

        function loadDataWorkout(r: any) {
            setData(r.workouts);
        }

        if (event.type === 'workout') {
            FetchDataWorkout({ id: event.id });
        } else if (event.type === 'activity') {
            console.log("this is an activity");
        }
    }

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>
            <div className="mb-5 shadow-lg p-3" style={{ display: `${program}`, borderRadius: '20px' }}>
                <ProgramList callback={handleFloatingActionProgramCallback} />
            </div>

            <div className="wrapper shadow-lg">
                <div className="schedular">
                    <div className="day-row">
                        <div className="cell" style={{ backgroundColor: 'white', position: 'relative' }}></div>
                        {days.map(val => {
                            return (
                                <div className="cell" style={{ backgroundColor: `${handleRestDays(val)}` }}>{`Day ${val}`}</div>
                                // handleDaysRender(val)
                            )
                        })}
                    </div>
                    {hours.map(h => {
                        return (
                            <div className="time-row" style={{ backgroundColor: 'white' }}>
                                <div className="cell" style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', lineHeight: '14px', top: '-8px', fontSize: '14px',
                                        width: '90%', backgroundColor: 'white', left: '0px', textAlign: 'right', paddingRight: '10px',
                                        zIndex: 999
                                    }}>{`${h}:00`}</span>
                                </div>
                                {days.map(d => {
                                    return (
                                        <div className="cell container">
                                            {min.map(m => {
                                                return (
                                                    <div className="time"
                                                        data-day={d}
                                                        data-hour={h}
                                                        data-min={m}
                                                        style={{ backgroundColor: `${handleRestDays(d)}` }}
                                                        onDrop={(e) => {
                                                            changedEvent = JSON.parse(e.dataTransfer.getData('scheduler-event'));
                                                            handleChange(changedDay, changedHour, changedMin, changedEvent);
                                                            e.preventDefault();
                                                        }}
                                                        onDragLeave={(e) => {
                                                            changedDay = e.currentTarget.getAttribute('data-day');
                                                            changedHour = e.currentTarget.getAttribute('data-hour');
                                                            changedMin = e.currentTarget.getAttribute('data-min');
                                                        }}>
                                                        {(arr[d][h][m]) && arr[d][h][m].map((val, index) => {
                                                            val.index = index;
                                                            return (
                                                                <div
                                                                    onClick={(e) => {
                                                                        setEvent(val);
                                                                        handleShow();
                                                                        DetailModal();
                                                                    }}
                                                                    id="dragMe"
                                                                    className="schedular-content draggable"
                                                                    draggable={val.type === 'restday' ? false : true}
                                                                    onDragStart={(e) => { e.dataTransfer.setData("scheduler-event", JSON.stringify(val)) }}
                                                                    style={{
                                                                        borderRadius: '5px',
                                                                        height: `${handleHeight(val) + handleHeight(val) / 60}px`,
                                                                        backgroundColor: 'rgb(135,206,235)',
                                                                        width: `${val.type === 'restday' ? '100%' : `${(100 / arr[d][h][m].length)}%`}`,
                                                                        border: '2px solid rgba(255,255,255,0.5)',
                                                                        paddingTop: `${handleHeight(val) > 15 ? '3' : '2'}px`,
                                                                        minWidth: "50% !important",
                                                                        maxWidth: "50% !important",
                                                                        cursor: 'pointer',
                                                                        left: `${index * (100 / arr[d][h][m].length)}%`
                                                                    }}
                                                                >
                                                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                                        <div className="event-desc">
                                                                            {val.type === 'restday' ? null : val.title}
                                                                        </div>
                                                                        <div className="event-time">
                                                                            {val.type === 'restday' ? null : (val.hour === '0' ? '00' : val.hour) + ":" + (val.min === '0' ? '00' : val.min) + " - " + val.endHour + ":" + (val.endMin.toString() === '0' ? '00' : val.endMin)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>);
                    })}
                </div>
            </div>
            <FloatingButton callback={handleFloatingActionProgramCallback} />
            {
                <Modal show={showModal} onHide={handleClose} centered size="lg" >
                    <Modal.Body style={{ maxHeight: '600px', overflow: 'auto' }}>
                        {/* <EventDetailModal event={event} type={event.type} close={handleClose} onChange={handleTimeChange} /> */}
                        <Row>
                            <Col lg={8}>
                                <h3 className="text-capitalize">{event.title}</h3>
                            </Col>
                            <Col>
                                <div>
                                    <i className="fas fa-pencil-alt fa-lg" onClick={() => { handleClose(); setData([]); createEditWorkoutComponent.current.TriggerForm({ type: 'edit' }); }} style={{ cursor: 'pointer', color: 'dodgerblue' }} />
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
                                <i className="fas fa-times fa-lg" onClick={(e) => { handleClose(); }} style={{ cursor: 'pointer' }}></i>
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
                                <TimeField title="Start" onChange={handleStart} hr={event.hour} m={event.min} />
                            </Col>
                        </Row>
                        <Row className="pt-3 align-items-center">
                            <Col>
                                <TimeField title="End" onChange={handleEnd} hr={event.endHour} m={event.endMin} />
                            </Col>
                        </Row>
                        {(event.type === 'workout') && <Tabs defaultActiveKey="agenda" transition={false} id="noanim-tab-example" className="pt-4">
                            <Tab eventKey="agenda" title="Agenda">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="success" onClick={() => {
                            handleSaveChanges(changedTime);
                            handleClose();
                        }}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
            <CreateoreditWorkout ref={createEditWorkoutComponent}></CreateoreditWorkout>
        </>
    );
};


export default Schedular;