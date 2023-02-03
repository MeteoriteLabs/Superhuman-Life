import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { GET_SCHEDULEREVENTS, GET_SCHEDULEREVENTS_PROGRAM_MANAGER, CREATE_SESSION, GET_SESSIONS, UPDATE_TAG_SESSIONS, CREATE_SESSION_BOOKING, GET_TEMPLATE_SESSIONS, UPDATE_FITNESSPORGRAMS_SESSIONS } from "../queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from '../schema/restDaySchema';
import {Subject} from 'rxjs';
import {flattenObj} from "../../../../components/utils/responseFlatten";
import moment from 'moment';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditRestDay(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("../json/restDay.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();

    const [sessionsIds, setSessionsIds] = useState<any>([]);
    const [sessions, setSessions] = useState<any>([]);
    const [templateSessionsIds, setTemplateSessionsIds] =  useState<any>([]);
    const [templateSessions, setTemplateSessions] = useState<any>([]);

    useQuery(GET_TEMPLATE_SESSIONS, {variables: {id: program_id}, skip: (window.location.pathname.split('/')[1] !== 'programs'), onCompleted: (data: any) => {
        const flattenData = flattenObj({...data});
        const templateExistingValues = [...templateSessionsIds];
        for(var q=0; q<flattenData.fitnessprograms[0].sessions.length; q++){
            templateExistingValues.push(flattenData.fitnessprograms[0].sessions[q].id);
        }
        setTemplateSessions(flattenData.fitnessprograms[0].sessions);
        setTemplateSessionsIds(templateExistingValues);
   }});

    useQuery(GET_SESSIONS, {variables: {id: program_id}, skip: (window.location.pathname.split('/')[1] === 'programs'),onCompleted: (data: any) => {
        const flattenData = flattenObj({...data});
        const sessionsExistingValues = [...sessionsIds];
        for(var q=0; q<flattenData.tags[0]?.sessions.length; q++){
            sessionsExistingValues.push(flattenData.tags[0].sessions[q].id);
        }
        setSessions(flattenData.tags[0]?.sessions);
        setSessionsIds(sessionsExistingValues);
    }});
    
    const [createSessionBooking] = useMutation(CREATE_SESSION_BOOKING, { onCompleted: (data: any) => {modalTrigger.next(false)} })
    const [upateSessions] = useMutation(UPDATE_TAG_SESSIONS, { onCompleted: (data: any) => {modalTrigger.next(false);}})
    const [createSession] = useMutation(CREATE_SESSION);

    const [updateTemplateSessions] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, { onCompleted: (data: any) => {modalTrigger.next(false);} });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {

            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;
            schema.type = window.location.pathname.split('/')[1] === "programs" ? 'day' : '';

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        const flattenData = flattenObj({...data});
        let details: any = {};
        let restDays: any[] = [];
        let msg = flattenData;
        if(window.location.pathname.split('/')[1] === "programs" ){
            msg?.fitnessprograms[0]?.sessions?.map(
                // eslint-disable-next-line array-callback-return
                (val: any) => {
                    if(val.Is_restday){
                        return restDays.push({ key: val.day_of_program, day: `Day - ${val.day_of_program}` });
                    }
                }
            );
        }
        else {
            msg.tags[0]?.sessions?.map(
                // eslint-disable-next-line array-callback-return
                (val: any) => {
                    if(val.Is_restday){
                        return restDays.push({ key: val.day_of_program, day: `${moment(val.session_date).format("Do, MMM YY")}`});
                    }
                }
            )
        }
        details.day = [...restDays] 
    
    setProgramDetails(details);

    //if message exists - show form only for edit and view
    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
    }

    function FetchData() {
        useQuery(window.location.pathname.split('/')[1] === "programs" ? GET_SCHEDULEREVENTS : GET_SCHEDULEREVENTS_PROGRAM_MANAGER, { variables: { id: program_id }, onCompleted: (e: any) => { FillDetails(e) } });
    }

    function UpdateProgram(frm: any) {
        frm.day = JSON.parse(frm.day);

        const sessionIds_new: any = [];
        const sessionIds_old: string[] = [...sessionsIds];
        const templateIds_old: string[] = [...templateSessionsIds];
        const restDays_old: any = [];

        function updateSessionFunc(id: any){
            sessionIds_new.push(id);
            if(frm.day.length === sessionIds_new.length){
                upateSessions({
                    variables: {
                        id: program_id,
                        sessions_ids: sessionIds_old.concat(sessionIds_new)
                    }
                });
            }
        }

        function updateTemplateSessionsFunc(id: any){
            if(id === null){
                updateTemplateSessions({
                    variables: {
                         id: program_id,
                         sessions_ids: templateIds_old.concat(sessionIds_new)
                    }
               })
            }
            sessionIds_new.push(id);
            if(frm.day.length === sessionIds_new.length){
                 updateTemplateSessions({
                      variables: {
                           id: program_id,
                           sessions_ids: templateIds_old.concat(sessionIds_new)
                      }
                 })
            }
       }

       if(window.location.pathname.split('/')[1] === 'programs'){
            for(var k=0; k<templateSessions.length; k++){
                for(var j=0; j<frm.day.length; j++){
                    if(templateSessions[k].day_of_program === frm.day[j].key && templateSessions[k].Is_restday === true){
                        frm.day.splice(j, 1);
                        restDays_old.push(templateSessions[k].id);
                    }
                }
            }
       }else if(window.location.pathname.split('/')[1] === 'client'){
            for(var x=0; x<sessions.length; x++){
                for(var y=0; y<frm.day.length; y++){
                    if(sessions[x].day_of_program === frm.day[y].key && sessions[x].Is_restday === true){
                        frm.day.splice(y, 1);
                    }
                }
            }
       }

       // eslint-disable-next-line array-callback-return
       templateSessions.map((item: any, index: number) => {
        if(!restDays_old.includes(item.id) && item.Is_restday){
            templateSessions.splice(index, 1);
            templateIds_old.splice(index, 1);
        }
       });

        if(frm.day.length > 0){
               for(var i=0; i<frm.day.length; i++){
                    createSession({
                        variables: {
                            type: "restday",
                            Is_restday: true,
                            day_of_program: frm.day[i].key,
                            session_date: moment(frm.day[i].day, 'Do, MMM YY').format('YYYY-MM-DD'),
                            changemaker: auth.userid
                        },
                        onCompleted: (data: any) => {
                            if(window.location.pathname.split('/')[1] === 'client'){
                                createSessionBooking({
                                    variables: {
                                        session: data.createSession.data.id,
                                        client: program_id
                                    }
                                })
                            }else {
                                if(window.location.pathname.split('/')[1] === 'programs'){
                                    return updateTemplateSessionsFunc(data.createSession.data.id);
                               }else {
                                    return updateSessionFunc(data.createSession.data.id);
                               }
                            }
                        }
                    });
               }
        }else {
            return updateTemplateSessionsFunc(null);
        }
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
        name="Rest Day";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }

    FetchData();

    return (
        <>
                <ModalView
                    name={name}
                    isStepper={false}
                    showErrorList={false}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={programDetails}
                    stepperValues={["Schedule", "Workout"]}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
        </>
    )
}

export default React.forwardRef(CreateEditRestDay);