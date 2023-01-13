import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation, gql } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { GET_SCHEDULEREVENTS, CREATE_SESSION, UPDATE_TAG_SESSIONS, CREATE_SESSION_BOOKING, GET_TEMPLATE_SESSIONS, UPDATE_FITNESSPORGRAMS_SESSIONS } from "../queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from '../schema/workoutTemplateSchema';
import { Subject } from 'rxjs';
import {flattenObj} from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import {AvailabilityCheck} from './availabilityCheck';
import { Modal, Button } from 'react-bootstrap';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditWorkoutTemplate(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require(window.location.pathname.includes("session") ? "../json/sessionManager/workoutTemplate.json" : "../json/workoutTemplate.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    // const [sessionsIds, setSessionsIds] = useState<any>(props);
    const [templateSessionsIds, setTemplateSessionsIds] = useState<any>([]);
    // userId here is the new sessionID.
    const [userId, setUserId] = useState("");
    const [dropConflict, setDropConflict] = useState(false);

    const GET_SESSIONS_BY_DATE = gql`
        query getprogramdata($date: Date) {
            sessions(filters: {
                session_date: {
                    eq: $date
                },
                type: {
                  ne: "restday"
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

    useQuery(GET_TEMPLATE_SESSIONS, {variables: {id: program_id}, skip: (window.location.pathname.split('/')[1] !== 'programs'), onCompleted: (data: any) => {
        const flattenData = flattenObj({...data});
        const templateExistingValues = [...templateSessionsIds];
        for(var q=0; q<flattenData.fitnessprograms[0].sessions.length; q++){
            templateExistingValues.push(flattenData.fitnessprograms[0].sessions[q].id);
        }
        setTemplateSessionsIds(templateExistingValues);
    }});

    const [updateFitenssProgram] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, { onCompleted: (data: any) => {
        modalTrigger.next(false);
        props.callback();
    }})

    const [createSessionBooking] = useMutation(CREATE_SESSION_BOOKING, { onCompleted: (data: any) => {modalTrigger.next(false); props.callback()} })
    const [upateSessions] = useMutation(UPDATE_TAG_SESSIONS, { onCompleted: (data: any) => {
        if(props?.clientIds.length > 0){
            for(var i=0; i<props?.clientIds.length; i++){
                createSessionBooking({
                    variables: {
                        session: userId,
                        client: props.clientIds[i]
                    }
                });
            }
        }else {
            modalTrigger.next(false);
            props.callback();
        }
    }})
    const [createSession] = useMutation(CREATE_SESSION, { onCompleted: (r: any) => { 
        
        
        if(window.location.pathname.split('/')[1] === 'programs'){
            const templateValues = [...templateSessionsIds];
            setUserId(r.createSession.data.id);
            templateValues.push(r.createSession.data.id);
            updateFitenssProgram({
                variables: {
                    id: program_id,
                    sessions_ids: templateValues
                }
            })
        }
        if(window.location.pathname.split('/')[1] === 'client'){
            createSessionBooking({
                variables: {
                    session: r.createSession.data.id,
                    client: program_id
                }
            });
        }else if(window.location.pathname.split('/')[1] !== 'client' && window.location.pathname.split('/')[1] !== 'programs') {
            const values = [...props.sessionIds];
            // here userId refers to the sessionID
            setUserId(r.createSession.data.id);
            values.push(r.createSession.data.id);
            upateSessions({
                variables: {
                    id: program_id,
                    sessions_ids: values
                }
            });
        }
     } });

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;
            schema.type = window.location.pathname.split('/')[1] === "programs" ? 'day' : window.location.pathname.includes('classic') ? 'day' : '';

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        let details: any = {};

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

    async function UpdateProgram(frm: any) {
        var existingEvents: any = (props.events === null ? [] : [...props.events]);
        if (frm.day) {
            frm.day = JSON.parse(frm.day);
        }

        if(window.location.pathname.split('/')[1] !== 'programs'){
            const variables = {
                date: moment(frm.day[0].day, 'Do, MMM YY').format('YYYY-MM-DD')
            }
    
            let result = await query.refetch(variables);
            let filterResult = await AvailabilityCheck({sessions: result.data.sessions, event: frm });
            if(filterResult){
                setDropConflict(true);
                return
            }
        }

        var eventJson: any = {};
        if (frm.workoutEvent) {
            frm.workoutEvent = JSON.parse(frm.workoutEvent);
            frm.time = JSON.parse(frm.time);
            eventJson.type = 'workout';
            eventJson.mode = frm.assignMode;
            eventJson.tag = frm.tag;
            eventJson.name = frm.workoutEvent[0].name;
            eventJson.id = frm.workoutEvent[0].id;
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
        }

        let lastEventDay: number = 0;

        for(var k=0; k<= existingEvents.length - 1; k++) {
            if(existingEvents[k].day > lastEventDay){
                lastEventDay = parseInt(existingEvents[k].day);
            }
        }

        let data: {} = {};

        if(window.location.pathname.split('/')[1] === 'programs'){
            data = {
                start_time: eventJson.startTime,
                end_time: eventJson.endTime,
                workout: eventJson.id,
                type: eventJson.type,
                day_of_program: eventJson.day,
                changemaker: auth.userid,
                session_date: null,
                isProgram: true
            }
        }else {
            data = {
                start_time: eventJson.startTime,
                end_time: eventJson.endTime,
                workout: eventJson.id,
                tag: eventJson.tag,
                mode: eventJson.mode,
                type: eventJson.type,
                session_date: moment(frm.day[0].day, 'Do, MMM YY').format('YYYY-MM-DD'),
                changemaker: auth.userid,
                isProgram: false
            }
        }

        createSession({
            variables: data
        });
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm)
            frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                UpdateProgram(frm);
                break;
        }
    }

    let name = "";
    if (operation.type === 'create') {
        name = "Workout Template";
    } else if (operation.type === 'edit') {
        name = "Edit";
    } else if (operation.type === 'view') {
        name = "View";
    }

    FetchData();

    return (
        <>
            {/* {render && */}
            <ModalView
                name={name}
                isStepper={true}
                showErrorList={false}
                formUISchema={schema}
                formSchema={programSchema}
                formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                formData={programDetails}
                stepperValues={["Schedule", "Workout"]}
                widgets={widgets}
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

export default React.forwardRef(CreateEditWorkoutTemplate);