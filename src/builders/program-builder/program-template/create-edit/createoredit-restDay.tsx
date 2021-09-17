import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { UPDATE_FITNESSPROGRAMS, GET_SCHEDULEREVENTS } from "../queries";
import AuthContext from "../../../../context/auth-context";
import StatusModal from '../../../../components/StatusModal/StatusModal';
import { schema, widgets } from '../schema/restDaySchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("../json/restDay.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    

    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
//     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log(msg);
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        let details: any = {};
        let msg = data;
        console.log(msg);
        // setExerciseDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        // useQuery(GET_SCHEDULEREVENTS, { variables: { id: program_id }, skip: (!operation.id || operation.type === 'toggle-status'), onCompleted: (e: any) => { setExistingEvents(e) } });
    }

    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advanced,
        None
    }


    function UpdateProgram(frm: any) {
        var existingRestDays = (props.restDays === null ? [] : [...props.restDays]);
        var daysArray: any = [];
        if(frm.day){
               frm.day = JSON.parse(frm.day);
               for(var i=0; i<frm.day.length; i++){
                    daysArray.push({
                         day: parseInt(frm.day[i].day.substr(4)),
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

    function EditExercise(frm: any) {
        console.log('edit message');
        // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
        // editExercise({variables: frm });
    }

    function ViewExercise(frm: any) {
        console.log('view message');
        //use a variable to set form to disabled/not editable
        // useMutation(UPDATE_EXERCISE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function DeleteExercise(id: any) {
        console.log('delete message');
        // deleteExercise({ variables: { id: id }});
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                UpdateProgram(frm);
                break;
            case 'edit':
                EditExercise(frm);
                break;
            case 'view':
                ViewExercise(frm);
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
             {operation.type ==="delete" && <StatusModal
             modalTitle="Delete"
             modalBody="Do you want to delete this message?"
             buttonLeft="Cancel"
             buttonRight="Yes"
             onClick={() => {DeleteExercise(operation.id)}}
             />}
        
            
        </>
    )
}

export default React.forwardRef(CreateEditMessage);