import React, {useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import './styles.css';

const Schedular = (props: any) => {

    const [show, setShow] = useState(false)
    const [arr, setArr] = useState<any[]>([]);
    const schedulerDay: any = require("./scheduler-day.json");

function draganddrop() {
    const draggable: any = document.querySelectorAll('.schedular-content');
    const container: any = document.querySelectorAll('.container');
    const resizer: any = document.getElementById('dragMe');

// // Minimum resizable area
// var minWidth = 60;
// var minHeight = 40;

// // Thresholds
// var FULLSCREEN_MARGINS = -10;
// var MARGINS = 4;

// // End of what's configurable.
// var clicked: any = null;
// var onBottomEdge;

// var bottomScreenEdge;

// var preSnapped;

// var b, x, y;

// var redraw: any = false;

// var pane: any = document.getElementsByClassName('container');
// var ghostpane: any = document.getElementById('ghostpane');

// function setBounds(element, x, y, w, h) {
// 	element.style.left = x + 'px';
// 	element.style.top = y + 'px';
// 	element.style.width = w + 'px';
// 	element.style.height = h + 'px';
// }

// function hintHide() {
//   setBounds(ghostpane, b.left, b.top, b.width, b.height);
//   ghostpane.style.opacity = 0;

//   // var b = ghostpane.getBoundingClientRect();
//   // ghostpane.style.top = b.top + b.height / 2;
//   // ghostpane.style.left = b.left + b.width / 2;
//   // ghostpane.style.width = 0;
//   // ghostpane.style.height = 0;
// }


// // Mouse events
// pane.addEventListener('mousedown', onMouseDown);
// document.addEventListener('mousemove', onMove);
// document.addEventListener('mouseup', onUp);

// // Touch events	
// pane.addEventListener('touchstart', onTouchDown);
// document.addEventListener('touchmove', onTouchMove);
// document.addEventListener('touchend', onTouchEnd);


// function onTouchDown(e) {
//   onDown(e.touches[0]);
//   e.preventDefault();
// }

// function onTouchMove(e) {
//   onMove(e.touches[0]);		
// }

// function onTouchEnd(e) {
//   if (e.touches.length ==0) onUp(e.changedTouches[0]);
// }

// function onMouseDown(e) {
//   onDown(e);
//   e.preventDefault();
// }

// function onDown(e) {
//   calc(e);

//   var isResizing = onBottomEdge ;

//   clicked = {
//     x: x,
//     y: y,
//     cx: e.clientX,
//     cy: e.clientY,
//     w: b.width,
//     h: b.height,
//     isResizing: isResizing,
//     isMoving: !isResizing && canMove(),
//     onBottomEdge: onBottomEdge
//   };
// }

// function canMove() {
//   return x > 0 && x < b.width && y > 0 && y < b.height
//   && y < 30;
// }

// function calc(e) {
//   b = pane.getBoundingClientRect();
//   y = e.clientY - b.top;
//   onBottomEdge = y >= b.height - MARGINS;

//   bottomScreenEdge = window.innerHeight - MARGINS;
// }

// var e;

// function onMove(ee) {
//   calc(ee);

//   e = ee;

//   redraw = true;

// }

// function animate() {

//   requestAnimationFrame(animate);

//   if (!redraw) return;

//   redraw = false;

//   if (clicked && clicked.isResizing) {

//     if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

//     hintHide();

//     return;
//   }

//   // This code executes when mouse moves without clicking

//   // style cursor
//   if (onBottomEdge) {
//     pane.style.cursor = 'ns-resize';
//   } else {
//     pane.style.cursor = 'default';
//   }
// }

// animate();

// function onUp(e) {
//   calc(e);

//   if (clicked && clicked.isMoving) {
//     // Snap
//     var snapped = {
//       height: b.height
//     };

//     if (b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
//       // hintFull();
//       }else if (b.bottom > bottomScreenEdge) {
//       // hintBottom();
//       setBounds(pane, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
//       preSnapped = snapped;
//     } else {
//       preSnapped = null;
//     }

//     hintHide();

//   }

//   clicked = null;

// }

    
    // const prevSibling: any = resizer.previousElementSibling;
    // let prevSiblingHeight = 0;
    // let x = 0;
    // let y = 0;

    // const mouseUpHandler = function() {
    //     resizer.style.removeProperty('cursor');
    //     document.body.style.removeProperty('cursor');
    
    //     // Remove the handlers of `mousemove` and `mouseup`
    //     document.removeEventListener('mousemove', mouseMoveHandler);
    //     document.removeEventListener('mouseup', mouseUpHandler);
    // };

    // const mouseDownHandler = function(e) {
    //     x=e.clientX;
    //     y=e.clientY;
    //     const rect = prevSibling.getBoundingClientRect();
    //     prevSiblingHeight = rect.height;
    //     document.addEventListener('mousemove', mouseMoveHandler);
    //     document.addEventListener('mouseup', mouseUpHandler);
    // }

    // const mouseMoveHandler = function(e) {
    //     const dy = e.clientY - y;
    //     const h = (prevSiblingHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height;
    //     prevSibling.style.height = `${h}%`;
    //     resizer.style.cursor = 'row-resize';
    //     document.body.style.cursor = 'row-resize';
    // };

    // resizer.addEventListener('mousedown', mouseDownHandler);

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
    
function handleRenderTable() {
    for(var d=1; d<=props.days; d++){
        arr[d] = JSON.parse(JSON.stringify(schedulerDay));
        // for(var h=0; h<=23; h++){
        //     if(typeof arr[d] == 'undefined'){
        //         arr[d] = [];
        //     }
        //     for(var m=0; m<=59; m+=15){
        //         console.log(m);
        //         if(typeof arr[d][h] == 'undefined'){
        //             arr[d][h] = [];
        //         }
        //         if(d ===4 && h===4 && m===15){
        //             arr[d][h][m] = {"title": "event", "color": "crimson", "day": 4, "hour": 4, "min": 15};
        //         }else {
        //             arr[d][h][m] = null;
        //         }
        //     // console.log(arr[d]);
        //     // if(d===5 && h===3){
        //     //     arr[d][h] = {"title": "event", "color": "green"};
                
        //     // }
        //     // setArr(arr);
        //     }
        // }
    }
    
    arr[4][4][15] = {"title": "event", "color": "crimson", "day": 4, "hour": 4, "min": 15};
    console.log(arr);
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

useEffect(() => {
    handleRenderTable();
    setTimeout(() => {
        setShow(true);
    }, 100)
}, [show]);    


    // alert("day: " + d + "hour: " + h);

console.log(arr);

function handleChange(d: any, h: any,m: any, event: any){
    console.log(event);
    console.log(event.day, event.hour, event.min);
    const values = [...arr];
    values[event.day][event.hour][event.min] = null;
    values[d][h][m] = {"title": "event", "color": "crimson", "day": d, "hour": h, "min": m};
    setArr(values);
}

var changedDay;
var changedHour;
var changedEvent;
var changedMin;

if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>  
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
                                            e.preventDefault();
                                            changedEvent = JSON.parse(e.dataTransfer.getData('scheduler-event'));
                                            handleChange(changedDay, changedHour, changedMin, changedEvent);
                                        }}
                                        onDragLeave={(e) => {
                                            changedDay = e.currentTarget.getAttribute('data-day');
                                            changedHour = e.currentTarget.getAttribute('data-hour');
                                            changedMin = e.currentTarget.getAttribute('data-min');
                                        }}>
                                            <div
                                            id="dragMe" 
                                            className="schedular-content draggable" 
                                            draggable="true"
                                            onDragStart={(e) => {  e.dataTransfer.setData("scheduler-event", JSON.stringify(arr[d][h][m]))}}
                                            style={{ backgroundColor: `${(arr[d][h][m]) ? arr[d][h][m].color : 'none' }` }}>
                                                <Col>
                                                    <Row>
                                                        <span>{(arr[d][h][m]) ? `Day - ${arr[d][h][m].day}` : null}</span>
                                                    </Row>
                                                </Col>
                                            </div>
                                            <div id="ghostpane"></div>
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


export default Schedular;