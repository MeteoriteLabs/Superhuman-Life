import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { UPDATE_FITNESSPROGRAMS, GET_SCHEDULEREVENTS } from "../queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from '../schema/newActivitySchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("../json/newActivity.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    

    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { modalTrigger.next(false); } });
    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
//     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        let details: any = {};
        // let msg = data;
        // console.log(details);
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

    function UpdateProgram(frm: any) {
        var existingEvents = (props.events === null ? [] : [...props.events]);
        var daysArray: any = [];
        if(frm.day && frm.newActivity){
            frm.day = JSON.parse(frm.day);
            frm.time = JSON.parse(frm.time);
            frm.newActivity = JSON.parse(frm.newActivity);
            var name: any = frm.newActivity[0].activity;
            var id: any = frm.newActivity[0].id;
            delete frm.newActivity[0].activity;
            delete frm.newActivity[0].id;
            for(var i = 0; i < frm.day.length; i++){
                daysArray.push({
                    day: parseInt(frm.day[i].day.substr(4)), 
                    name: name,
                    id: id,
                    type: 'activity',
                    startTime: frm.time.startTime,
                    endTime: frm.time.endTime, 
                    activityTarget: frm.newActivity[0]
                });
            }
            for(var j=0 ;j<daysArray.length;j++){
                if (existingEvents.length === 0) {
                    existingEvents.push(daysArray[j]);
                } else {
                    var timeStart: any = new Date("01/01/2007 " + handleTimeFormat(frm.time.startTime));
                    var timeEnd: any = new Date("01/01/2007 " + handleTimeFormat(frm.time.endTime));
                    var diff1 = timeEnd - timeStart;
                    for (var k = 0; k <= existingEvents.length - 1; k++) {
                        var startTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingEvents[k].startTime));
                        var endTimeHour: any = new Date("01/01/2007 " + handleTimeFormat(existingEvents[k].endTime));
                        var diff2 = endTimeHour - startTimeHour;
    
                        if (diff2 < diff1) {
                            existingEvents.splice(k, 0, daysArray[j]);
                            break;
                        }
                        if (k === existingEvents.length - 1) {
                            existingEvents.push(daysArray[j]);
                            break;
                        }
                    }
                }
            }
        }
        updateProgram({ variables: {
            programid: program_id,
            events: existingEvents
        } });
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
        name="New Activity";
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
                    stepperValues={["Schedule", "Activity"]}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                    type={operation.type}
                />
                
            {/* } */}            
        </>
    )
}

export default React.forwardRef(CreateEditMessage);