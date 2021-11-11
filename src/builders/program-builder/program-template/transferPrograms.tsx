import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import TransferProgramsTable from './transferProgramTable';
import { UPDATE_FITNESSPROGRAMS, PROGRAM_EVENTS } from './queries';
import { useMutation, useQuery } from "@apollo/client";

const TransferPrograms = (props: any) => {

     const [show, setShow] = useState(false);
     const [data, setData] = useState<any[]>([]);
     const [existingEvents, setExistingEvents] = useState<any[]>([]);

     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);
     const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, { onCompleted: (r: any) => { handleClose(); } });
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
          const oldData = existingEvents[0].events[index];
          var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(oldData.startTime));
          var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(oldData.endTime));
          var diff1 = timeEnd - timeStart;
          const d = new Date("01/01/2007 " + handleTimeFormat(newStartTime));
          d.setMinutes(d.getMinutes() + (diff1/1000/60));
          return (d.getHours() + ":" + d.getMinutes()).toString();
     }

     function handleTransferEventsSubmit() {
          var allEvents: any[] = [...existingEvents[0].events];
          const eventsJson: any[] = [];
          data.forEach((e: any) => {
               if (e.day && e.startTimeHour) {
                    e.day = JSON.parse(e.day);
                    var startTime: any = e.startTimeHour + ":" + (e.startTimeMin === undefined ? '0' : e.startTimeMin);
                    var endTime: any = handleEndTime(startTime, e.transferId);
                    for (var i = 0; i < e.day.length; i++) {
                         eventsJson.push({
                              day: parseInt(e.day[i].day.substr(4)),
                              name: e.name,
                              id: e.id,
                              startTime: startTime,
                              endTime: endTime,
                              type: e.type,
                         });
                    }
               }
          });
          for (var j = 0; j < eventsJson.length; j++) {
               if (allEvents.length === 0) {
                    allEvents.push(eventsJson[j]);
                } else {
                    var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(eventsJson[j].startTime));
                    var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(eventsJson[j].endTime));
                    var diff1 = timeEnd - timeStart;
                    for (var i = 0; i <= allEvents.length - 1; i++) {
                        var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(allEvents[i].startTime));
                        var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(allEvents[i].endTime));
                        var diff2 = endTimeHour - startTimeHour;
    
                        if (diff2 < diff1) {
                         allEvents.splice(i, 0, eventsJson[j]);
                            break;
                        }
                        if (i === allEvents.length - 1) {
                              allEvents.push(eventsJson[j]);
                              break;
                        }
                    }
                }
          }
          updateProgram({
               variables: {
                    programid: program_id,
                    events: allEvents
               }
          });
     }

     function FetchData(_variables: {} = { id: program_id }) {
          useQuery(PROGRAM_EVENTS, { variables: _variables, onCompleted: loadData });
     }

     function loadData(data: any) {
          setExistingEvents(
               [...data.fitnessprograms].map((detail) => {
                    return {
                         events: (detail.events === null ? [] : detail.events),
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
                         <TransferProgramsTable events={props.events} onChange={handleCallbackTransfer} />
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