import React, { useState, useEffect } from 'react';
import './styles.css';
import { Row } from 'react-bootstrap';
import TransferPrograms from './transferPrograms';
import Loader from '../../../components/Loader/Loader';
import moment from 'moment';

const SchedulerEvent = (props: any) => {
    const [arr, setArr] = useState<any>([]);
    const [show, setShow] = useState<boolean>(false);
    const schedulerDay: any = require('./json/scheduler-day.json');

    function draganddrop() {
        const draggable: any = document.querySelectorAll('.draggable-event');
        const container: any = document.querySelectorAll('.event-container');

        draggable.forEach((drag) => {
            drag.addEventListener('dragstart', () => {
                drag.classList.add('dragging');
            });

            drag.addEventListener('dragend', () => {
                drag.classList.remove('dragging');
            });
        });

        container.forEach((con) => {
            con.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                con.appendChild(draggable);
            });
        });
    }

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 300);
    }, [show]);

    function handleTemplteRenderTable(data: any) {
        const values = [...data];
        for (let d = 1; d <= props.programDays; d++) {
            values[d] = JSON.parse(JSON.stringify(schedulerDay));
        }

        if (props.programEvents) {
            props.programEvents.forEach((val) => {
                if (!values[val.day_of_program]) {
                    values[val.day_of_program] = [];
                }
                values[val.day_of_program].push({
                    import: 'importedEvent',
                    type: val.type,
                    mode: val.mode,
                    tag: val.tag,
                    type2: 'transferEvent',
                    title: val.activity === null ? val.workout?.workouttitle : val.activity.title,
                    color: 'skyblue',
                    id: val.activity === null ? val.workout.id : val.activity.id,
                    endHour: val.end_time.split(':')[0],
                    endMin: val.end_time.split(':')[1],
                    hour: val.start_time.split(':')[0],
                    min: val.start_time.split(':')[1],
                    activityTarget: val.activity === null ? null : val.activity_target,
                    activity: val.activity === null ? null : val.activity,
                    day: val.day_of_program,
                    sessionId: val.id,
                    sessionDate: val.session_date,
                    isProgram: val?.Is_program_template
                });
            });
            setArr(values);
        }
        draganddrop();
    }

    function handleRenderTable(data: any) {
        if (props.dayType === 'programs') {
            return handleTemplteRenderTable(data);
        }
        const values = [...data];
        for (let d = 1; d <= props.programDays; d++) {
            values[d] = JSON.parse(JSON.stringify(schedulerDay));
        }
        if (props.programEvents) {
            props.programEvents.forEach((val) => {
                if (!values[calculateDay(props.startDate, val.session_date)]) {
                    values[calculateDay(props.startDate, val.session_date)] = [];
                }

                values[calculateDay(props.startDate, val.session_date)].push({
                    import: 'importedEvent',
                    type: val.type,
                    mode: val.mode,
                    tag: val.tag,
                    type2: 'transferEvent',
                    title: val.activity === null ? val.workout?.workouttitle : val.activity.title,
                    color: 'skyblue',
                    id: val.activity === null ? val.workout.id : val.activity.id,
                    endHour: val.end_time.split(':')[0],
                    endMin: val.end_time.split(':')[1],
                    hour: val.start_time.split(':')[0],
                    min: val.start_time.split(':')[1],
                    activityTarget: val.activity === null ? null : val.activity_target,
                    activity: val.activity === null ? null : val.activity,
                    day: calculateDay(props.startDate, val.session_date),
                    sessionId: val.id,
                    sessionDate: val.session_date,
                    isProgram: val?.Is_program_template
                });
            });
            setArr(values);
        }
        draganddrop();
    }
    function calculateDay(startDate, sessionDate) {
        const startDateFormatted = moment(startDate);
        startDateFormatted.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
        const sessionDateFormatted = moment(sessionDate);
        sessionDateFormatted.set({
            hour: 12,
            minute: 0,
            second: 0,
            millisecond: 0
        });
        const diffDays = sessionDateFormatted.diff(startDateFormatted, 'days') + 1;
        return diffDays;
    }

    useEffect(() => {
        handleRenderTable([]);
    }, [props.programEvents]);

    if (!show) return <Loader />;
    else
        return (
            <>
                <div>
                    <div
                        style={{
                            overflow: 'auto',
                            border: '1px solid black',
                            maxHeight: '300px'
                        }}
                        className="schedular mt-5 mb-3"
                    >
                        <div className="day-row">
                            {props?.programDays?.map((val, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="cell"
                                        style={{ backgroundColor: 'white' }}
                                    >{`Day - ${val}`}</div>
                                );
                            })}
                        </div>
                        <div className="events-row">
                            {props.programDays.map((val, index) => {
                                return (
                                    <div className="event-cell" key={index}>
                                        {arr[val] &&
                                            arr[val].map((val, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            backgroundColor: `${val.color}`,
                                                            height: '50px',
                                                            borderRadius: '10px',
                                                            zIndex: 997,
                                                            minWidth: '120px'
                                                        }}
                                                        draggable="true"
                                                        className="draggable-event m-2"
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData(
                                                                'scheduler-event',
                                                                JSON.stringify(val)
                                                            );
                                                            const el: any = e.target;
                                                            el.id = 'rem';
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight: 'bold',
                                                                overflow: 'hidden',
                                                                fontSize: '10px'
                                                            }}
                                                        >
                                                            {val.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {props.type !== 'sessions' && (
                    <Row className="justify-content-end mr-1">
                        <TransferPrograms
                            callback={props.callback}
                            sessionIds={props.sessionIds}
                            program_id={props.program_id}
                            duration={props.programDays}
                            events={props.programEvents}
                        />
                    </Row>
                )}
            </>
        );
};

export default SchedulerEvent;
