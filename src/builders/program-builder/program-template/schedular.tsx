import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Row, Col, Tab, Tabs, InputGroup, FormControl, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './styles.css';
import { GET_SCHEDULEREVENTS, PROGRAM_EVENTS, UPDATE_FITNESSPROGRAMS, FETCH_EVENT } from './queries';
import { useQuery, useMutation } from "@apollo/client";
import ProgramList from "../../../components/customWidgets/programList";
import FloatingButton from './FloatingButtons';
import TimeField from '../../../components/customWidgets/timeField';
import TextEditor from '../../../components/customWidgets/textEditor';
import CreateoreditWorkout from '../workout/createoredit-workout';
import ReplaceWorkout from './create-edit/replaceWorkout';
import DaysInput from './daysInput';

const Schedular = (props: any) => {

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [onDragAndDrop, setOnDragAndDrop] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<any[]>([]);
    const [edit, setEdit] = useState(true);
    const [del, setDel] = useState(false);
    const [duplicate, setDuplicate] = useState(false);
    const [event, setEvent] = useState<any>({});
    const [arr, setArr] = useState<any[]>([]);
    const [program, setProgram] = useState('none');
    const program_id = window.location.pathname.split('/').pop();
    const schedulerDay: any = require("./json/scheduler-day.json");

    useQuery(FETCH_EVENT, {
        variables: { id: event.id },
        skip: (event.type !== "workout"),
        onCompleted: (r: any) => {
            setData(r.workouts);
            handleShow();
        }
    });

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

    let confirmVal: any = {};
    const [arr2, setarr2] = useState<any>({});

    function handleChange(d: any, h: any, m: any, event: any) {
        confirmVal.event = event;
        confirmVal.d = d;
        confirmVal.h = h;
        confirmVal.m = m;
        setarr2(confirmVal);    
        setOnDragAndDrop(true); 
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

    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS);

    var changedTime: any;
    function handleTimeChange(e: any) {
        changedTime = e;
    }

    function handleTimeFormat(time: string) {
        let timeArray = time.split(':');
        let hours = timeArray[0];
        let minutes = timeArray[1];
        let timeString = (parseInt(hours) < 10 ? "0" + hours : hours) + ':' + (parseInt(minutes) === 0 ? "0" + minutes : minutes);
        return timeString.toString();
    }

    var duplicatedDay: any;
    function onChange(e: any){
        // console.log(e);
        duplicatedDay = e;
    }

    function handleDuplicate(e: any, changedTime: any){
        let values = [...currentProgram];
        let newEvent: any = {};
        newEvent.name = e.title;
        newEvent.day = (duplicatedDay === undefined ? e.day : parseInt(duplicatedDay.substr(13,1)));
        newEvent.startTime = changedTime.startChange;
        newEvent.endTime = changedTime.endChange;
        newEvent.type = e.type;
        newEvent.id = e.id;

        var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.startTime));
        var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.endTime));
        var diff1 = timeEnd - timeStart;
        for (var i = 0; i <= values.length - 1; i++) {
            var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(values[i].startTime));
            var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(values[i].endTime));
            var diff2 = endTimeHour - startTimeHour;

            if (diff2 < diff1) {
                values.splice(i, 0, newEvent);
                break;
            }
            if (i === values.length - 1) {
                values.push(newEvent);
                break;
            }
        }

        updateProgram({
            variables: {
                programid: program_id,
                events: values
            }
        })
    }

    function handleSaveChanges(e: any) {
        let values = [...currentProgram];
        let newEvent: any = {};
        let a = values.find((val) => val.id === event.id && val.day === event.day && val.startTime === event.hour + ":" + event.min && val.endTime === event.endHour + ":" + event.endMin);
        let b = values.findIndex((val) => val.id === event.id && val.day === event.day && val.startTime === event.hour + ":" + event.min && val.endTime === event.endHour + ":" + event.endMin);
        if (a) {
            newEvent.id = a.id;
            newEvent.name = a.name;
            newEvent.startTime = e.startChange;
            newEvent.endTime = e.endChange;
            newEvent.type = a.type;
            newEvent.day = a.day;

            values.splice(b, 1);
            var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.startTime));
            var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.endTime));
            var diff1 = timeEnd - timeStart;
            for (var i = 0; i <= values.length - 1; i++) {
                var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(values[i].startTime));
                var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(values[i].endTime));
                var diff2 = endTimeHour - startTimeHour;

                if (diff2 < diff1) {
                    values.splice(i, 0, newEvent);
                    break;
                }
                if (i === values.length - 1) {
                    values.push(newEvent);
                    break;
                }
            }
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
    const handleClose = () => { setData([]); setShowModal(false); };
    const handleShow = () => {setShowModal(true)};
    const [data, setData] = useState<any[]>([]);
    const [startChange, setStartChange] = useState("");
    const createEditWorkoutComponent = useRef<any>(null);
    const replaceWorkoutComponent = useRef<any>(null);
    const [endChange, setEndChange] = useState("");

    function handleStart(e: any) {
        setStartChange(e);
    }

    function handleEnd(e: any) {
        setEndChange(e);
    }
    handleTimeChange({ startChange, endChange });

    function handleAgenda(d: any){
        return (
            <>
                <Row className="pt-2">
                    <Col>
                        <div style={{borderRadius: '10px', display: `${d.type !== 'exercise' ? 'none' : 'block'}`}} className="pt-2 shadow-lg">
                            <Row className="pl-4">
                                <p className="text-capitalize">{d.type !== 'exercise' ? null : d.value}</p>
                            </Row>
                            <Row className="pl-4 pr-2">
                                <Col>
                                    {
                                    d.type !== 'exercise' ? null : 
                                    <p>Reps: <br/> 
                                    <InputGroup className="pt-2">
                                        <FormControl
                                            disabled
                                            value={d.reps ? d.reps : 'N/A'}
                                        />
                                    </InputGroup>
                                    </p>
                                    }
                                </Col>
                                <Col>
                                    {
                                    d.type !== 'exercise' ? null : 
                                    <p>Weights: <br/> 
                                    <InputGroup className="pt-2">
                                        <FormControl
                                            disabled
                                            value={d.weights ? d.weights : 'N/A'}
                                        />
                                    </InputGroup>
                                    </p>
                                    }
                                </Col>
                                <Col>
                                    {
                                    d.type !== 'exercise' ? null : 
                                    <p>Sets: <br/> 
                                    <InputGroup className="pt-2">
                                        <FormControl
                                            disabled
                                            value={d.sets ? d.sets : 'N/A'}
                                        />
                                    </InputGroup>
                                    </p>
                                    }
                                </Col>
                                <Col>
                                    {
                                    d.type !== 'exercise' ? null : 
                                    <p>Duration: <br/> 
                                    <InputGroup className="pt-2">
                                        <FormControl
                                            disabled
                                            value={d.duration ? d.duration : 'N/A'}
                                        />
                                    </InputGroup>
                                    </p>
                                    }
                                </Col>
                            </Row>
                        </div>
                        <div style={{borderRadius: '10px'}} className="mt-4 shadow-lg">
                            {!d.restTime ? null : <Row className="pl-2">
                            {d.type !== 'exercise' ? null : <>
                            <Col lg={2} className="text-center pt-2 mt-1">
                                <p>Rest Time: </p>
                            </Col>
                            <Col lg={3}>
                            <InputGroup className="pt-2">
                                <FormControl
                                    disabled
                                    value={d.restTime ? d.restTime : 'N/A'}
                                />
                                </InputGroup></Col>
                            </>}
                        </Row>}
                        </div>
                    </Col>
                </Row>
                <Row className="pl-2">
                    {d.type !== 'text' ? null : <Col>
                        <TextEditor val={d.value} type="text"/>
                    </Col>}
                </Row>
                <Row>
                    <p>{d.type !== 'url' ? null : <Col >
                        <InputGroup>
                                    <FormControl
                                        disabled
                                        value={d.value}
                            />
                            </InputGroup></Col>
                        }
                    </p>
                </Row>
            </>
        )
    }

    function handleEventDelete(){
        let values = [...currentProgram];
        let a = values.findIndex((val) => val.id === event.id && val.day === event.day && val.startTime === event.hour + ":" + event.min && val.endTime === event.endHour + ":" + event.endMin);
        values.splice(a,1);
        updateProgram({
            variables: {
                programid: program_id,
                events: values
            }
        });
        handleClose();

    }

    function confirm() {
        const values = [...arr];
        if (arr2.event.day) {
            values[arr2.event.day][arr2.event.hour][arr2.event.min].splice(arr2.event.index, 1);
        }
        
        if (arr2.d === undefined || arr2.h === undefined || arr2.m === undefined) {
            return;
        }
        if (!values[arr2.d][arr2.h][arr2.m]) {
            values[arr2.d][arr2.h][arr2.m] = [];
        }
        const diff = handleHeight(arr2.event) / 15;
        var sh = parseInt(arr2.h);
        var sm = parseInt(arr2.m);
        for (var i = 0; i < diff; i++) {
            sm += 15;
            if (sm === 60) {
                sh++;
                sm = 0;
            }
        }

        let localEvent: any = {};
        localEvent.id = arr2.event.id;
        localEvent.day = arr2.d;
        localEvent.hour = arr2.h;
        localEvent.min = arr2.m;
        localEvent.endHour = sh;
        localEvent.endMin = sm;
        localEvent.type = arr2.event.type;
        localEvent.title = arr2.event.title;
        
        let newEvent: any = {};
        newEvent.id = arr2.event.id;
        newEvent.name = arr2.event.title;
        newEvent.startTime = arr2.h + ":" + arr2.m;
        newEvent.endTime = sh + ":" + sm;
        newEvent.type = arr2.event.type;
        newEvent.day = arr2.d;
        let existingValues = currentProgram === null ? [] : [...currentProgram];
        if(arr2.event.type2 === "transferEvent"){
            var timeStartTransfer: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.startTime));
            var timeEndTransfer: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.endTime));
            var diff1Transfer = timeEndTransfer - timeStartTransfer;
            for (var j = 0; j <= existingValues.length - 1; j++) {
                    var startTimeHourTransfer: any = new Date("01/01/2007 " + handleTimeFormat(existingValues[j].startTime));
                    var endTimeHourTransfer: any = new Date("01/01/2007 " + handleTimeFormat(existingValues[j].endTime));
                    var diff2Transfer = endTimeHourTransfer - startTimeHourTransfer;

                    if (diff2Transfer < diff1Transfer) {
                        existingValues.splice(j, 0, newEvent);
                        break;
                    }
                    if (j === existingValues.length - 1) {
                        existingValues.push(newEvent);
                        break;
                    }
            }
        }else {
        let a = existingValues.findIndex((val) => val.id === arr2.event.id && val.day === arr2.event.day && val.startTime === arr2.event.hour + ":" + arr2.event.min && val.endTime === arr2.event.endHour + ":" + arr2.event.endMin);
        existingValues.splice(a,1);
        if(existingValues.length === 0 ){
            existingValues.push(newEvent);
        }else {
                var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.startTime));
                var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.endTime));
                var diff1 = timeEnd - timeStart;
                for (var k = 0; k <= existingValues.length - 1; k++) {
                    var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingValues[k].startTime));
                    var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingValues[k].endTime));
                    var diff2 = endTimeHour - startTimeHour;

                    if (diff2 < diff1) {
                        existingValues.splice(k, 0, newEvent);
                        break;
                    }
                    if (k === existingValues.length - 1) {
                        existingValues.push(newEvent);
                        break;
                    }
                }
            }
        }
        updateProgram({
            variables: {
                programid: program_id,
                events: existingValues
            }
        })

        if(values[arr2.d][arr2.h][arr2.m].length === 0){
            values[arr2.d][arr2.h][arr2.m].push({ "title": arr2.event.title, "color": arr2.event.color, "day": arr2.d, "hour": arr2.h, "min": arr2.m, "endHour": sh, "endMin": sm });
        }else {
            var timeStartArr: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.startTime));
            var timeEndArr: any = new Date("01/01/2007 " + handleTimeFormat(newEvent.endTime));
            var diff1Arr = timeEndArr - timeStartArr;
            for(var l=0; l<values[arr2.d][arr2.h][arr2.m].length; l++){
                    var startTimeHourArr: any = new Date("01/01/2007 " + handleTimeFormat(values[arr2.d][arr2.h][arr2.m][l].hour + ":" + values[arr2.d][arr2.h][arr2.m][l].min));
                    var endTimeHourArr: any = new Date("01/01/2007 " + handleTimeFormat(values[arr2.d][arr2.h][arr2.m][l].endHour + ":" + values[arr2.d][arr2.h][arr2.m][l].endMin));
                    var diff2Arr = endTimeHourArr - startTimeHourArr;

                    if (diff2Arr < diff1Arr) {
                        values[arr2.d][arr2.h][arr2.m].splice(l, 0, localEvent);
                        break;
                    }
                    if (l === values[arr2.d][arr2.h][arr2.m].length - 1) {
                        values[arr2.d][arr2.h][arr2.m].push(localEvent);
                        break;
                    }
            }
        }
        setArr(values);
        setarr2([]);
        confirmVal = {};
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
                                                                    onClick={() => { setEvent(val)}}
                                                                    id="dragMe"
                                                                    className="schedular-content draggable"
                                                                    draggable={val.type === 'restday' ? false : true}
                                                                    onDragStart={(e) => {
                                                                        e.dataTransfer.setData("scheduler-event", JSON.stringify(val));
                                                                    }}
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
                <Modal show={showModal} onHide={handleClose} backdrop="static" centered size="lg" >
                    <Modal.Body style={{ maxHeight: '600px', overflow: 'auto' }}>
                        <Row>
                            <Col lg={8}>
                                <h3 className="text-capitalize">{event.title}</h3>
                            </Col>
                            <Col>
                                <div>
                                <OverlayTrigger
                                    key='left'
                                    placement='left'
                                    overlay={
                                        <Tooltip id={`left`}>
                                             <strong>Edit</strong>.
                                        </Tooltip>
                                    }
                                    >
                                    <i className="fas fa-pencil-alt fa-lg" onClick={(e) => {setEdit(!edit)}} style={{ cursor: 'pointer', color: 'dodgerblue' }}/>
                                </OverlayTrigger>
                                </div>
                            </Col>
                            <Col>
                                <OverlayTrigger
                                    key='left'
                                    placement='left'
                                    overlay={
                                        <Tooltip id={`left`}>
                                             <strong>Duplicate</strong>.
                                        </Tooltip>
                                    }
                                    >
                                    <i className="fas fa-copy fa-lg" onClick={(e) => { handleClose(); setDuplicate(true); }} style={{ cursor: 'pointer', color: '#696969' }} />
                                </OverlayTrigger>
                            </Col>
                            <Col>
                                <div>
                                <OverlayTrigger
                                    key='left'
                                    placement='left'
                                    overlay={
                                        <Tooltip id={`left`}>
                                             <strong>Delete</strong>.
                                        </Tooltip>
                                    }
                                    >
                                    <i className="fas fa-trash-alt fa-lg" onClick={(e) => { setDel(true); }} style={{ cursor: 'pointer', color: 'red' }}></i>
                                </OverlayTrigger>
                                </div>
                            </Col>
                            <Col>
                                <OverlayTrigger
                                    key='left'
                                    placement='left'
                                    overlay={
                                        <Tooltip id={`left`}>
                                             <strong>Close</strong>.
                                        </Tooltip>
                                    }
                                    >
                                    <i className="fas fa-times fa-lg" onClick={(e) => { handleClose(); setData([]) }} style={{ cursor: 'pointer' }}></i>
                                </OverlayTrigger>
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
                                <TimeField title="Start Time: " onChange={handleStart} hr={event.hour} m={event.min} disabled={edit}/>
                            </Col>
                        </Row>
                        <Row className="pt-3 align-items-center">
                            <Col>
                                <TimeField title="End Time: " onChange={handleEnd} hr={event.endHour} m={event.endMin} disabled={edit}/>
                            </Col>
                        </Row>
                        {(event.type === "workout") && <Tabs defaultActiveKey="agenda" transition={false} id="noanim-tab-example" className="pt-4">
                            <Tab eventKey="agenda" title="Agenda">
                                <Row className="justify-content-end">
                                    <Button className="mr-3 mt-2" variant="primary" size="sm" onClick={() => { handleClose(); setData([]); setEvent([]); createEditWorkoutComponent.current.TriggerForm({ type: 'edit' }); }}><i className="fas fa-pencil-alt"></i>{" "}Edit</Button>
                                    <Button className="mr-3 mt-2" variant="warning" size="sm" onClick={() => {handleClose(); setData([]); setEvent([]); replaceWorkoutComponent.current.TriggerForm({type: 'edit' })}}><i className="fas fa-reply"></i>{" "}Replace</Button>
                                </Row>
                                {data.map(val => {
                                    return (
                                        <>
                                            <Row>
                                                {val.warmup === null ? '' : <Col className="pt-2"><h5>Warmup: {val.warmup.map((d) => {
                                                    return (
                                                        handleAgenda(d)
                                                    )
                                                })}</h5></Col>}
                                            </Row>
                                            <hr style={{ marginTop: '0px', marginBottom: '20px', borderTop: '2px solid grey', display: `${val.mainmovement === null ? 'none' : 'block'}` }}></hr>
                                            <Row>
                                                {val.mainmovement === null ? '' : <Col className="pt-2"><h5>Mainmovement {val.mainmovement.map((d) => {
                                                    return (
                                                        handleAgenda(d)
                                                    )
                                                })}</h5></Col>}
                                            </Row>
                                            <hr style={{ marginTop: '0px', marginBottom: '20px', borderTop: '2px solid grey', display: `${val.cooldown === null ? 'none' : 'block'}` }}></hr>
                                            <Row>
                                                {val.cooldown === null ? '' : <Col className="pt-2"><h5>Cooldown {val.cooldown.map((d) => {
                                                    return (
                                                        handleAgenda(d)
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
                                                <Col lg={11}>
                                                    <InputGroup>
                                                        <FormControl as="textarea" value={val.About} disabled />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row className="pt-3">
                                                <Col lg={2} className="pr-0">
                                                    <label>Equipment: </label>
                                                </Col>
                                                <Col lg={10} className="pl-0">
                                                    {val.equipment_lists.map((d) => {
                                                        return (
                                                            <>
                                                                <Badge className="p-2" pill variant="secondary">
                                                                    {d.name}
                                                                </Badge>{' '}
                                                            </>
                                                        )
                                                    })}
                                                </Col>
                                            </Row>
                                            <Row className="pt-3">
                                                <Col lg={2} className="pr-0">
                                                    <label>Muscle Group: </label>
                                                </Col>
                                                <Col lg={10} className="pl-0">
                                                    {val.muscle_groups.map((d) => {
                                                        return (
                                                            <>
                                                                <Badge className="p-2" pill variant="secondary">
                                                                    {d.name}
                                                                </Badge>{' '}
                                                            </>
                                                        )
                                                    })}
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                })}
                            </Tab>
                        </Tabs>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {setData([]);handleClose();}}>
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
            }{
                <Modal show={del} onHide={() => setDel(false)} centered backdrop='static'>
                    <Modal.Header>
                         <Modal.Title>Do you want to delete this event?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                         <Button variant="danger" onClick={() => setDel(false)}>
                              No
                         </Button>
                         <Button variant="success" onClick={() => {handleEventDelete();setDel(false);}}>
                              Yes
                         </Button>
                    </Modal.Footer>
               </Modal>
            }{
                <Modal show={duplicate} onHide={() => setDuplicate(false)} centered backdrop='static'>
                    <Modal.Body>
                        <Row>
                            <Col lg={11}>
                                <h3 className="text-capitalize">{event.title}</h3>
                            </Col>
                            <Col lg={1}>
                                <i className="fas fa-times fa-lg" onClick={(e) => { setDuplicate(false); setData([]) }} style={{ cursor: 'pointer' }}></i>
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
                                    <DaysInput val={event.day} type="transfer" onChange={onChange} id="duplicateWorkout"/>
                                </Col>
                            </Row>
                            <Row className="pt-3 align-items-center">
                                <Col>
                                    <TimeField title="Start Time: " onChange={handleStart} hr={event.hour} m={event.min}/>
                                </Col>
                            </Row>
                            <Row className="pt-3 align-items-center">
                                <Col>
                                    <TimeField title="End Time: " onChange={handleEnd} hr={event.endHour} m={event.endMin}/>
                                </Col>
                            </Row>
                    </Modal.Body>
                    <Modal.Footer>
                         <Button variant="danger" onClick={() => {setDuplicate(false); setData([]);}}>
                              Cancel
                         </Button>
                         <Button variant="success" onClick={() => {handleDuplicate(event, changedTime);setDuplicate(false); setData([]);}}>
                              Duplicate
                         </Button>
                    </Modal.Footer>
               </Modal>
            }{
                <Modal show={onDragAndDrop} onHide={() => setOnDragAndDrop(false)} centered backdrop='static'>
            <Modal.Header>
                    <Modal.Title>Do you want to save changes?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                    <Button variant="danger" onClick={() => {setOnDragAndDrop(false); setarr2([]); confirmVal = {};} }>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => {
                        confirm();
                        setOnDragAndDrop(false);
                    }}>
                        Confirm
                    </Button>
            </Modal.Footer>
        </Modal>
            }
            <CreateoreditWorkout ref={createEditWorkoutComponent}></CreateoreditWorkout>
            <ReplaceWorkout ref={replaceWorkoutComponent}></ReplaceWorkout>
        </>
    );
};


export default Schedular;