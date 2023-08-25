import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import TransferProgramsTable from './transferProgramTable';
import { UPDATE_FITNESSPORGRAMS_SESSIONS, PROGRAM_EVENTS, CREATE_SESSION } from './queries';
import { useMutation, useQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster';

const TransferPrograms = (props: any) => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [existingEvents, setExistingEvents] = useState<any[]>([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [updateProgram] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, {
        onCompleted: () => {
            handleClose();
            props.callback();
        }
    });
    const program_id = window.location.pathname.split('/').pop();
    const [isCreated, setIsCreated] = useState<boolean>(false);

    function handleCallbackTransfer(e: any) {
        setData(e);
    }

    function handleTimeFormat(time: string) {
        const timeArray = time.split(':');
        const hours = timeArray[0];
        const minutes = timeArray[1];
        const timeString =
            (parseInt(hours) < 10 ? `0${hours}` : hours) +
            ':' +
            (parseInt(minutes) < 10 ? `0${minutes}` : minutes);
        return timeString.toString();
    }

    function handleEndTime(newStartTime: any, index: any) {
        const oldData = existingEvents[0].events.find((e: any) => e.id === index);
        const timeStart: any = new Date('01/01/2007 ' + oldData.start_time);
        const timeEnd: any = new Date('01/01/2007 ' + oldData.end_time);
        const diff1 = timeEnd - timeStart;
        const d = new Date('01/01/2007 ' + handleTimeFormat(newStartTime));
        d.setMinutes(d.getMinutes() + diff1 / 1000 / 60);

        return ((d.getHours() < 10? `0${d.getHours()}` : d.getHours()) + ':' + (Number(d.getMinutes()) < 10 ? `0${d.getMinutes()}` : d.getMinutes())).toString();
    }

    const [createSession] = useMutation(CREATE_SESSION, {
        onCompleted: (response: any) => {
            setIsCreated(!isCreated);
            const values = [...props.sessionIds];
            values.push(response.createSession.data.id);
            updateProgram({
                variables: {
                    id: program_id,
                    sessions_ids: values
                }
            });
        }
    });

    function handleTransferEventsSubmit() {
        // var allEvents: any[] = [...existingEvents[0].events];
        const eventsJson: any[] = [];
        data.forEach((e: any) => {
            // const oldData = existingEvents[0].events.find((val: any) => val.id === e.id);
            if (e.day && e.startTime) {
                e.day = JSON.parse(e.day);
                const startTime: any = handleTimeFormat(e.startTime);
                const endTime: any = handleEndTime(e.startTime, e.id);
                
                for (let i = 0; i < e.day.length; i++) {
                    eventsJson.push({
                        day: parseInt(e.day[i].key),
                        session_date: e.day[i].value,
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

        for (let i = 0; i < eventsJson.length; i++) {
            
            if (eventsJson[i].type === 'workout') {
                createSession({
                    variables: {
                        session_date: eventsJson[i].session_date,
                        start_time: eventsJson[i].startTime,
                        end_time: eventsJson[i].endTime,
                        workout: eventsJson[i].workout.id,
                        tag: eventsJson[i].tag,
                        mode: eventsJson[i].mode,
                        type: eventsJson[i].type,
                        day_of_program: parseInt(eventsJson[i].day),
                        changemaker: eventsJson[i].changemaker
                    }
                });
            } else {
                createSession({
                    variables: {
                        session_date: eventsJson[i].session_date,
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
                });
            }
        }
    }

    function FetchData(_variables: Record<string, unknown> = { id: props.program_id }) {
        useQuery(PROGRAM_EVENTS, { variables: _variables, onCompleted: loadData });
    }

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });
        setExistingEvents(
            [...flattenData.fitnessprograms].map((detail) => {
                return {
                    events: detail.sessions === null ? [] : detail.sessions
                };
            })
        );
    }

    FetchData({ id: props.program_id });

    function handleValidation() {
        const el = document.getElementsByClassName('is-invalid');
        if (el.length === 0) {
            return false;
        }
        return true;
    }

    return (
        <>
            <Button
                variant="outline-info"
                onClick={handleShow}
                style={{ cursor: 'pointer' }}
                disabled={props.events === null ? true : false}
            >
                Transfer all
            </Button>
            <Modal show={show} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Transfer programs</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "50vh" ,maxHeight: '500vh', overflow: 'auto' }}>
                    <TransferProgramsTable
                        duration={props.duration}
                        dayType={window.location.pathname.split('/')[1] === 'programs' ? 'day' : ''}
                        events={props.events}
                        onChange={handleCallbackTransfer}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            handleTransferEventsSubmit();
                        }}
                        disabled={handleValidation()}
                    >
                        Transfer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* import toaster */}
            {isCreated && (
                <Toaster
                    handleCallback={() => setIsCreated(!isCreated)}
                    type="success"
                    msg="Program has been transported successfully"
                />
            )}
        </>
    );
};

export default TransferPrograms;
