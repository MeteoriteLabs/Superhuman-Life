import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import TransferProgramsTable from './transferProgramTable';
import { UPDATE_FITNESSPORGRAMS_SESSIONS, PROGRAM_EVENTS, CREATE_SESSION } from './queries';
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from '../../../components/utils/responseFlatten';

const TransferPrograms = (props: any) => {

     console.log(props);

     const [show, setShow] = useState(false);
     const [data, setData] = useState<any[]>([]);
     const [existingEvents, setExistingEvents] = useState<any[]>([]);

     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);
     const [updateProgram] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, { onCompleted: (r: any) => { handleClose(); } });
     const program_id = window.location.pathname.split('/').pop();

     function handleCallbackTransfer(e: any) {
          setData(e);
     }

     function handleTimeFormat(time: string) {
          let timeArray = time.split(':');
          let hours = timeArray[0];
          let minutes = timeArray[1];
          let timeString = (parseInt(hours) < 10 ? "0" + hours : hours) + ':' + (parseInt(minutes) === 0 ? "0" + minutes : minutes);
          return timeString.toString();
      }

     function handleEndTime(newStartTime: any, index: any){
          const oldData = existingEvents[0].events.find((e: any) => e.id === index);
          var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(oldData.start_time));
          var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(oldData.end_time));
          var diff1 = timeEnd - timeStart;
          const d = new Date("01/01/2007 " + handleTimeFormat(newStartTime));
          d.setMinutes(d.getMinutes() + (diff1/1000/60));
          return (d.getHours() + ":" + d.getMinutes()).toString();
     }

     const [createSession] = useMutation(CREATE_SESSION, {onCompleted: (r: any) => { 
          const values = existingEvents[0].events.map((e: any) => {return e.id}).join(",").split(",");
          values.push(r.createSession.data.id);
          updateProgram({
               variables: {
                    id: program_id,
                    sessions_ids: values
               }
          })
      }});

     function handleTransferEventsSubmit() {
          // var allEvents: any[] = [...existingEvents[0].events];
          const eventsJson: any[] = [];
          console.log(data);
          debugger;
          data.forEach((e: any) => {
               const oldData = existingEvents[0].events.find((val: any) => val.id === e.id);
               if (e.day && e.startTime && (oldData.start_time !== e.startTime)) {
                    e.day = JSON.parse(e.day);
                    var startTime: any = e.startTime;
                    var endTime: any = handleEndTime(e.startTime, e.id);
                    for (var i = 0; i < e.day.length; i++) {
                         eventsJson.push({
                              day: parseInt(e.day[i].key),
                              name: e.name,
                              id: e.id,
                              startTime: startTime,
                              endTime: endTime,
                              type: e.type,
                              Is_restday: e.Is_restday,
                              activity: e.activity,
                              activity_target: e.activity_target,
                              changemaker: e.changemaker,
                              day_of_program: e.day_of_program,
                              mode: e.mode,
                              tag: e.tag,
                              workout: e.workout   
                         });
                    }
               }
          });

          for(var i=0; i<eventsJson.length; i++){
               if(eventsJson[i].type === 'workout'){
                    createSession({
                         variables: {
                             start_time: eventsJson[i].startTime,
                             end_time: eventsJson[i].endTime,
                             workout: eventsJson[i].workout.id,
                             tag: eventsJson[i].tag,
                             mode: eventsJson[i].mode,
                             type: eventsJson[i].type,
                             day_of_program: parseInt(eventsJson[i].day),
                             changemaker: eventsJson[i].changemaker,
                         }
                     })
               }else {
                    createSession({
                         variables: {
                             day_of_program: parseInt(eventsJson[i].day),
                             start_time: eventsJson[i].startTime,
                             end_time: eventsJson[i].endTime,
                             activity: eventsJson[i].activity.id,
                             activity_target: eventsJson[i].activity_target,
                             tag: eventsJson[i].tag,
                             mode: eventsJson[i].mode,
                             type: eventsJson[i].type,
                             changemaker: eventsJson[i].changemaker
                         }
                     })
               }
          }
     }

     function FetchData(_variables: {} = { id: program_id }) {
          useQuery(PROGRAM_EVENTS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          const flattenData = flattenObj({...data});
          setExistingEvents(
               [...flattenData.fitnessprograms].map((detail) => {
                    return {
                         events: (detail.sessions === null ? [] : detail.sessions),
                    }
               })
          )
     }

     FetchData({ id: program_id });

     function handleValidation() {
          // @ts-ignore: Object is possibly 'null'.
          const el = document.getElementsByClassName("is-invalid");
          if (el.length === 0) {
               return false;
          }
          return true;
     }

     return (
          <>
               <Button variant="outline-info" onClick={handleShow} style={{ cursor: 'pointer'}} disabled={props.events === null ? true : false}>Transfer all</Button>
               <Modal show={show} onHide={handleClose} centered size="xl">
                    <Modal.Header closeButton>
                         <Modal.Title>Transfer programs</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '500px', overflow: 'auto' }}>
                         <TransferProgramsTable duration={props.duration} dayType={window.location.pathname.split('/')[1] === 'programs' ? 'day' : ''} events={props.events} onChange={handleCallbackTransfer} />
                    </Modal.Body>
                    <Modal.Footer>
                         <Button variant="danger" onClick={handleClose}>
                              Close
                         </Button>
                         <Button variant="success" onClick={() => { handleTransferEventsSubmit(); }} disabled={handleValidation()}>
                              Transfer
                         </Button>
                    </Modal.Footer>
               </Modal>
          </>
     );
}

export default TransferPrograms;