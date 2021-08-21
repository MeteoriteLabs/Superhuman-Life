import React, {useState, useEffect} from 'react';
import './styles.css';

const SchedulerEvent = (props: any) => {

     const [arr, setArr] = useState<any[]>([]);
     const [show, setShow] = useState(false);
     const schedulerDay: any = require("./json/scheduler-day.json");
     
     function draganddrop(){
          const draggable: any = document.querySelectorAll('.draggable-event');
          const container: any = document.querySelectorAll('.event-container');

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
                   con.appendChild(draggable);
               });
          })
     }

     function handleRenderTable(){
          for(var d=1; d<=props.programDays; d++){
               arr[d] = JSON.parse(JSON.stringify(schedulerDay));
          }
          if(props.programEvents){
               props.programEvents.map((val) => {
                    return arr[val.day] = {"title": val.name, "color": "skyblue"}
               })
          }
          draganddrop();
     }

     useEffect(() => {
          setTimeout(() => {
              setShow(true);
          }, 300)
     }, [show]); 

     handleRenderTable();
     
     if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
     else return (
          <>
               <div>
                    <div style={{ overflow: 'auto', border: '1px solid black'}} className="schedular mt-5 mb-3">
                    <div className="day-row">
                         {props.programDays.map(val => {
                              return (
                                   <div className="cell" style={{ backgroundColor: 'white'}}>{`Day ${val}`}</div>
                              )
                         })}
                    </div>
                    <div className="events-row" >
                         {props.programDays.map(val => {
                              return (
                                   <div className="event-cell"
                                        onDragLeave={(e) => {
                                             console.log(e.currentTarget);
                                        }}
                                   >
                                   <div 
                                        style={{ backgroundColor: `${(arr[val] ? arr[val].color : 'none')}`, height: '50px',borderRadius: '10px', zIndex: 997, minWidth: '120px'}}
                                        draggable="true"
                                        className="draggable-event m-2"
                                   >{(arr[val] ? `title-${arr[val].title}` : null)}</div>
                                   </div>
                              )
                         })}
                    </div>
               </div>
               </div>
        </>
     )
}

export default SchedulerEvent;