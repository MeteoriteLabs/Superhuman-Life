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
     const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, { onCompleted: (r: any) => { console.log(r); handleClose(); } });
     const program_id = window.location.pathname.split('/').pop();


     function handleCallbackTransfer(e: any) {
          setData(e);
     }

     function handleTransferEventsSubmit() {
          var allEvents: any[] = [...existingEvents[0].events];
          const eventsJson: any[] = [];
          data.forEach((e: any) => {
               if (e.day && e.startTimeHour) {
                    e.day = JSON.parse(e.day);
                    var startTime: any = e.startTimeHour + ":" + (e.startTimeMin === undefined ? '0' : e.startTimeMin);
                    for (var i = 0; i < e.day.length; i++) {
                         eventsJson.push({
                              day: parseInt(e.day[i].day.substr(4)),
                              name: e.name,
                              id: e.id,
                              startTime: startTime,
                              type: e.type,
                         });
                    }
               }
          });
          for (var j = 0; j < eventsJson.length; j++) {
               allEvents.push(eventsJson[j]);
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
          console.log(data);
          setExistingEvents(
               [...data.fitnessprograms].map((detail) => {
                    return {
                         events: (detail.events === null ? [] : detail.events)
                    }
               })
          )
     }

     FetchData({ id: program_id });

     function handleValidation() {
          // @ts-ignore: Object is possibly 'null'.
          const el = document.getElementsByClassName("inputError");
          if (el.length === 0) {
               return false;
          }
          return true;
     }

     return (
          <>
               <Button variant="outline-info" onClick={handleShow}>Transfer all</Button>
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