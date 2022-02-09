import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { UPDATE_FITNESSPROGRAMS, GET_SCHEDULEREVENTS } from "../queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from '../schema/restDaySchema';
import {Subject} from 'rxjs';
import {flattenObj} from "../../../../components/utils/responseFlatten";

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
    

    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { modalTrigger.next(false); } });
    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
//     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            // console.log(msg);
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        const flattenData = flattenObj({...data});
        let details: any = {};
        let msg = flattenData;
        details.day = msg.fitnessprograms[0].rest_days?.map(
            (val: any) => {
                return { id: val.day, day: `Day-${val.day}` };
            }
        );
    setProgramDetails(details);

    //if message exists - show form only for edit and view
    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_SCHEDULEREVENTS, { variables: { id: program_id }, skip: (!operation.id || operation.type === 'toggle-status'), onCompleted: (e: any) => { FillDetails(e) } });
    }

    function UpdateProgram(frm: any) {
        var existingRestDays = (props.restDays === null ? [] : [...props.restDays]);
        var daysArray: any = [];
        if(frm.day){
               frm.day = JSON.parse(frm.day);
               for(var i=0; i<frm.day.length; i++){
                    daysArray.push({
                         day: parseInt(frm.day[i].key),
                         type: 'restday'
                    });
               }
               for(var j=0; j<daysArray.length; j++){
                    existingRestDays.push(daysArray[j]);
               }
        }
        updateProgram({ variables: {
            programid: program_id,
            rest_days: existingRestDays
        }})
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
            {/* {render && */}
                <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={programDetails}
                    stepperValues={["Schedule", "Workout"]}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}
        </>
    )
}

export default React.forwardRef(CreateEditRestDay);