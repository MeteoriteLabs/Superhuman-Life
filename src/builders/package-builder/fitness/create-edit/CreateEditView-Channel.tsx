import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation, gql } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { GET_SCHEDULEREVENTS, CREATE_WORKOUT, CREATE_SESSION, GET_SESSIONS, UPDATE_TAG_SESSIONS, CREATE_SESSION_BOOKING } from "../../../program-builder/program-template/queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from './schema/channelSchema';
import {Subject} from 'rxjs';
import {flattenObj} from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import {AvailabilityCheck} from '../../../program-builder/program-template/availabilityCheck';
import { Modal, Button } from 'react-bootstrap';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditChannel(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./json/channel.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    // const [frmDetails, setFrmDetails] = useState<any>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    let frmDetails: any;
    const [sessionsIds, setSessionsIds] = useState<any>([]);
    // userId here is the new sessionID.
    const [userId, setUserId] = useState("");
    const [clientId, setClientId] = useState("")
    const [dropConflict, setDropConflict] = useState(false);

    const GET_SESSIONS_BY_DATE = gql`
        query getprogramdata($date: Date) {
            sessions(filters: {
                session_date: {
                    eq: $date
                }
            }){
                data{
                    id
                    attributes{
                        tag
                        start_time
                        end_time
                    }
                }
            }
        }      
`;  

    const query = useQuery(GET_SESSIONS_BY_DATE, {skip: true});

    useQuery(GET_SESSIONS, {variables: {id: program_id},onCompleted: (data: any) => {
        const flattenData = flattenObj({...data});
        setClientId(flattenData.tags[0]?.client_packages[0]?.users_permissions_user.id);
        const sessionsExistingValues = [...sessionsIds];
        for(var q=0; q<flattenData.tags[0].sessions.length; q++){
            sessionsExistingValues.push(flattenData.tags[0].sessions[q].id);
        }
        setSessionsIds(sessionsExistingValues);
    }});
    
    const [createWorkout] = useMutation(CREATE_WORKOUT, { onCompleted: (r: any) => { updateSchedulerEvents(frmDetails, r.createWorkout.data.id); modalTrigger.next(false); } });
    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    // const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { modalTrigger.next(false); } });
    const [createSessionBooking] = useMutation(CREATE_SESSION_BOOKING, { onCompleted: (data: any) => {modalTrigger.next(false)} })
    const [upateSessions] = useMutation(UPDATE_TAG_SESSIONS, { onCompleted: (data: any) => {
        createSessionBooking({
            variables: {
                session: userId,
                client: clientId,
            }
        });
    }})
    const [createSession] = useMutation(CREATE_SESSION, { onCompleted: (r: any) => { 
        const values = [...sessionsIds];
        setUserId(r.createSession.data.id);
        values.push(r.createSession.data.id);
        upateSessions({
            variables: {
                id: program_id,
                sessions_ids: values
            }
        });
     } });
    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
//     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    const modalTrigger =  new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        let details: any = {};
        // let msg = data;
        // console.log(msg);
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_SCHEDULEREVENTS, { variables: { id: program_id }, skip: (!operation.id || operation.type === 'toggle-status'), onCompleted: (e: any) => { FillDetails(e) } });
    }
    
    function handleTimeFormat(time: string) {
        let timeArray = time.split(':');
        let hours = timeArray[0];
        let minutes = timeArray[1];
        let timeString = (parseInt(hours) < 10 ? "0" + hours : hours) + ':' + (parseInt(minutes) === 0 ? "0" + minutes : minutes);
        return timeString.toString();
    }

    async function updateSchedulerEvents(frm: any, workout_id: any) {
        var existingEvents = (props.events === null ? [] : [...props.events]);
        // AvailabilityCheck({...frm})

        const variables = {
            date: moment(frm.day[0].day, 'Do, MMM YY').format('YYYY-MM-DD')
        }
        
        let result = await query.refetch(variables);
        let filterResult = await AvailabilityCheck({sessions: result.data.sessions, event: frm });
        if(filterResult){
            setDropConflict(true);
            return
        }

        if(frm.day){
            var eventJson: any = {};
            frm.day = JSON.parse(frm.day);
            frm.time = JSON.parse(frm.time);
            eventJson.type = 'workout';
            eventJson.name = frm.workout;
            eventJson.mode = frm.assignMode;
            eventJson.tag = frm.tag;
            eventJson.id = workout_id;
            eventJson.startTime = frm.time.startTime;
            eventJson.endTime = frm.time.endTime;
            eventJson.day = parseInt(frm.day[0].key);
            if (existingEvents.length === 0) {
                existingEvents.push(eventJson);
            } else {
                var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(frm.time.startTime));
                var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(frm.time.endTime));
                var diff1 = timeEnd - timeStart;
                for (var i = 0; i <= existingEvents.length - 1; i++) {
                    var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingEvents[i].startTime));
                    var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingEvents[i].endTime));
                    var diff2 = endTimeHour - startTimeHour;

                    if (diff2 < diff1) {
                        existingEvents.splice(i, 0, eventJson);
                        break;
                    }
                    if (i === existingEvents.length - 1) {
                        existingEvents.push(eventJson);
                        break;
                    }
                }
            }

        let lastEventDay: number = 0;

        for(var k=0; k<= existingEvents.length - 1; k++) {
            if(existingEvents[k].day > lastEventDay){
                lastEventDay = parseInt(existingEvents[k].day);
            }
        }

        createSession({
            variables: {
                start_time: eventJson.startTime,
                end_time: eventJson.endTime,
                workout: eventJson.id,
                tag: eventJson.tag,
                mode: eventJson.mode,
                type: eventJson.type,
                session_date: moment(frm.day[0].day, 'Da, MMM YY').format('YYYY-MM-DD'),
                changemaker: auth.userid
            }
        })
    }

        // updateProgram({ variables: {
        //     programid: program_id,
        //     events: existingEvents,
        //     renewal_dt: lastEventDay
        // } });
    }

    function UpdateProgram(frm: any) {
        debugger;
        console.log(frm);
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                UpdateProgram(frm);
                break;
        }
    }

    let name = "";
    if(operation.type === 'create'){
        name="New Workout";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }

    FetchData();

    return (
        <>
            {/* {render && */}
                <ModalView
                    name={name}
                    isStepper={true}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={programDetails}
                    widgets={widgets}
                    stepperValues={["Creator", "Details", "Program", "Schedule", "Pricing", "Config", "Review"]}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}
            {
                <Modal show={dropConflict} onHide={() => setDropConflict(false)} centered backdrop='static'>
                <Modal.Header>
                        <Modal.Title>Session Conflict</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>There is already an existing session at this time. Cannot add!</span>
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="success" onClick={() => {
                            setDropConflict(false);
                            modalTrigger.next(false);
                        }}>
                            Understood
                        </Button>
                </Modal.Footer>
            </Modal>
            }        
        </>
    )
}

export default React.forwardRef(CreateEditChannel);