import {useEffect, useState} from 'react';
import moment from 'moment';
import {Badge} from 'react-bootstrap';
import './styles.css';

const WeekScheduler = (props: any) => {

    const arr: any = [];
    const [show, setShow] = useState(false);
    const schedulerDay: any = require("./table.json");

    const hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const days: number[] = [];
    const dates: string[] = [];
    const min: number[] = [0, 15, 30, 45];

    function handleDays() {
        for (var l = 1; l <= props.days; l++) {
            days.push(l);
        }
        for(var j=0; j<props.days; j++){
            const t = moment(props.startDate).add(j, 'days').format("DD MMM YY");
            dates.push(t);
        }
    }

    handleDays();

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

    function handleDaysRowRender() {
        return (
            dates.map((val, index) => {
                return (
                    <>
                        <div key={index} className="cell" style={{ minHeight: '60px' }}>
                            <div className="event-dayOfWeek text-center mt-2">
                                <span style={{ fontSize: '14px'}}>{moment(val).format("dddd")}</span>
                            </div>
                            <div className="event-date text-center mt-1">
                                <span style={{ fontSize: '14px'}}>{moment(val).format("Do, MMM YY")}</span>
                            </div>
                            <div className="event-date text-center">
                                <Badge variant="success" className="ml-4 mr-4 mb-1" style={{ display: `${moment().format("Do, MMM YY") === moment(val).format("Do, MMM YY") ? 'block': 'none'}`}}>Today</Badge>
                            </div>
                        </div>
                    </>
                )
            })
        )
    }

    
    function handleTableRender(){
        const values = props.assignedEvents === null ? [] : [...props.assignedEvents];
        for (var d = 1; d <= props.days; d++) {
            arr[d] = JSON.parse(JSON.stringify(schedulerDay));
        }
        values.forEach((val) => {
            var startTimeHour: any = `${val.start_time === undefined ? '0' : val.start_time.split(':')[0]}`;
            var startTimeMinute: any = `${val.start_time === undefined ? '0' : val.start_time.split(':')[1]}`;
            var endTimeHour: any = `${val.end_time === undefined ? '0' : val.end_time.split(':')[0]}`;
            var endTimeMin: any = `${val.end_time === undefined ? '0' : val.end_time.split(':')[1]}`;
            if (!arr[moment(val.session_date).weekday() + 1][startTimeHour][startTimeMinute]) {
                arr[moment(val.session_date).weekday() + 1][startTimeHour][startTimeMinute] = [];
            }
            arr[moment(val.session_date).weekday() + 1][startTimeHour][startTimeMinute].push({
                "title": val.activity === null ? val.workout.workouttitle : val.activity.title, "color": "skyblue",
                "day": moment(val.session_date).weekday() + 1, "hour": startTimeHour, "min": startTimeMinute, "type": val.type,
                "endHour": endTimeHour, "endMin": endTimeMin, "id": val.activity === null ? val.workout.id : val.activity.id, "mode": val.mode, "tag": val.tag, "sessionId": val.id, "activityTarget": val.activity === null ? null : val.activity_target, "sessionDate": val.session_date,
            });
        })
    }

    handleTableRender();

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 500);
    }, [show]);

    if(!show) return <div style={{ color: 'red'}}>Loading...</div>
    else return (
        <>
            <div className="wrapper shadow-lg" style={{width: '90%', margin: 'auto'}}>
                <div className="schedular">
                    <div className="day-row">
                        <div className="cell" style={{ backgroundColor: 'white', position: 'relative', minHeight: '60px' }}></div>
                        {handleDaysRowRender()}
                    </div>
                    {hours.map((h, index) => {
                        return (
                            <div key={index} className="time-row" style={{ backgroundColor: 'white' }}>
                                <div className="cell" style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', lineHeight: '14px', top: '-8px', fontSize: '14px',
                                        width: '90%', backgroundColor: 'white', left: '0px', textAlign: 'right', paddingRight: '10px',
                                        zIndex: 999
                                    }}>{`${h}:00`}</span>
                                </div>
                                {days.map((d, index) => {
                                    return (
                                        <div key={index} className="cell container">
                                            {min.map((m, index) => {
                                                return (
                                                    <div key={index} className="time">
                                                        {(arr[d][h][m]) && arr[d][h][m].map((val, index: number) => {
                                                            val.index = index;
                                                            return (
                                                                <div
                                                                    key={index}
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
        </>
    );
};

export default WeekScheduler;