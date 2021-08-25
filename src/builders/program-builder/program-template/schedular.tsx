import React, {useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import './styles.css';
import { GET_SCHEDULEREVENTS } from './queries';
import { useQuery } from "@apollo/client";
import ProgramList from "../../../components/customWidgets/programList";
import FloatingButton from './FloatingButtons'

const Schedular = (props: any) => {

    const [show, setShow] = useState(false)
    const [arr, setArr] = useState<any[]>([]);
    const [program, setProgram] = useState('none');
    const schedulerDay: any = require("./json/scheduler-day.json");

    function Fetchdata(_variables: any) {
        useQuery(GET_SCHEDULEREVENTS, {variables: _variables ,onCompleted: handleRenderTable});
    }

function draganddrop() {
    const draggable: any = document.querySelectorAll('.schedular-content');
    const container: any = document.querySelectorAll('.container');
    // const resizer: any = document.getElementById('dragMe');

    

    draggable.forEach(drag => {
        drag.addEventListener('dragstart', () => {
            drag.classList.add('dragging');
        });

        drag.addEventListener('dragend', () =>{
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
                con.insertBefore(draggable, afterElement);
            }
            con.appendChild(draggable);
        });
    })

    function getDragAfterElement(container, y){
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

        draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height /2;
            if (offset < 0 && offset > closest.offset){
                return { offset: offset, element: child }
            }else {
                return closest;
            }
        }, { offset: Number.POSITIVE_INFINITY })
    }
}

setTimeout(() => {
    draganddrop();
}, 200)

function handleRenderTable(data: any) {
    for(var d=1; d<=props.days; d++){
        arr[d] = JSON.parse(JSON.stringify(schedulerDay));
    }
    if(data.fitnessprograms[0].events){
        data.fitnessprograms[0].events.map((val) => {
            var startTimeHour: any = val.startTime.split(':')[0];
            var startTimeMinute: any = val.startTime.split(':')[1];
            // var endTimeHour: any = val.endTime.split(':')[0];
            // var endTimeMinute: any = val.endTime.split(':')[1];
            return (
                arr[val.day][startTimeHour][startTimeMinute] = {"title":  val.name, "color": "skyblue", "day": val.day, "hour": startTimeHour, "min": startTimeMinute}
            )
        })
    }
}

const hours: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
const days: number[] = [];
const min: number[] = [0,15,30,45];

function handleDays() {
    for(var i=1; i<=props.days; i++){
        days.push(i);
    }
}

handleDays();
Fetchdata({ id: props.programId});

useEffect(() => {
    setTimeout(() => {
        setShow(true);
    }, 300)
}, [show]);    

console.log(arr);

function handleDropElement(event: any){
    console.log(event);
    var data = event.title;
    if(data){
        // @ts-ignore: Object is possibly 'null'
        var el: any = document.getElementById("rem");
        console.log(el);
        // el.remove(el);
    }
}

function handleChange(d: any, h: any,m: any, event: any){
    console.log(event);
    console.log(event.day, event.hour, event.min);
    const values = [...arr];
    if(event.day){
        values[event.day][event.hour][event.min] = null;
    }
    values[d][h][m] = {"title": event.title, "color": event.color, "day": d, "hour": h, "min": m};
    setArr(values);
    if(event.day === undefined){
        handleDropElement(event);
    }
}

function handleFloatingActionProgramCallback(event: any){
    setProgram(`${event}`);
}


var changedDay;
var changedHour;
var changedEvent;
var changedMin;

if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>
        <div className="mb-5 shadow-lg p-3" style={{ display: `${program}`,  borderRadius: '20px'}}>
            <ProgramList callback={handleFloatingActionProgramCallback}/>
        </div>

        {/* <div className="mb-5 shadow-lg p-3" style={{ borderRadius: '20px', display: `${program}`}}>
            <ProgramList callback={handleFloatingActionProgramCallback}/>
            <div className="schedular mt-5 mb-3 shadow-lg" style={{ overflow: 'scroll', border: '1px solid black'}}>
                <SchedulerEvent days={days}/>
            </div>            
        </div> */}
        
        <div className="wrapper shadow-lg">
            <div className="schedular">
                <div className="day-row">
                    <div className="cell" style={{ backgroundColor: 'white'}}></div>
                    {days.map(val => {
                        return (
                            <div className="cell" style={{ backgroundColor: 'white'}}>{`Day ${val}`}</div>
                        )
                    })}
                </div>
                {hours.map(h => {
                    return (
                    <div className="time-row">
                        <div className="cell">{`${h}:00`}</div>
                        {days.map(d => {
                            return (
                                <div className="cell container">
                                        {min.map(m => {
                                            return (
                                        <div className="time"
                                        data-day={d}
                                        data-hour={h}
                                        data-min={m} 
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
                                            <div
                                            onClick={(e) => {
                                                console.log('div clicked');
                                            }}
                                            id="dragMe" 
                                            className="schedular-content draggable" 
                                            draggable="true"
                                            onDragStart={(e) => {  e.dataTransfer.setData("scheduler-event", JSON.stringify(arr[d][h][m]))}}
                                            style={{ backgroundColor: `${(arr[d][h][m]) ? arr[d][h][m].color : 'none' }` }}>
                                                <Col>
                                                    <Row>
                                                        <span>{(arr[d][h][m]) ? `title - ${arr[d][h][m].title}` : null}</span>
                                                    </Row>
                                                </Col>
                                            </div>
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
        <FloatingButton callback={handleFloatingActionProgramCallback}/>
        </>
    );
};


export default Schedular;