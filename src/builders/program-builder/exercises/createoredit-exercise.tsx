import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { FETCH_DATA, CREATE_EXERCISE, UPDATE_EXERCISE, DELETE_EXERCISE } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { schema, widgets } from './exerciseSchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const exerciseSchema: { [name: string]: any; } = require("./exercises.json");
    const [exerciseDetails, setExerciseDetails] = useState<any>({});
    // const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    

    const [createExercise] = useMutation(CREATE_EXERCISE, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log(msg);
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);

            // if (msg.type === "toggle-status" && "current_status" in msg)
            //     ToggleMessageStatus(msg.id, msg.current_status);
        }
    }));

    // function loadData(data: any) {
    //     messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
    //     messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
    //     messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
    //     messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
    // }

    function FillDetails(data: any) {
        let details: any = {};
        let msg = data.exercises;
        console.log(msg);
        details.exercise = msg[0].exercisename;
        details.level = msg.exerciselevel;
        details.discipline = msg[0].fitnessdisciplines.map((val: any) => {
            return val.id;
        });
        details.miniDescription = msg[0].exerciseminidescription;
        details.equipment = msg[0].equipment_lists.map((val: any) => {
            return val.name;
        });
        details.muscleGroup = msg[0].exercisemusclegroups.map((val: any) => {
            return val.name;
        })
        setExerciseDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        console.log('Fetch data', operation.id);
        useQuery(FETCH_DATA, { variables: { id: operation.id }, skip: (!operation.id || operation.type === 'toggle-status'), onCompleted: (e: any) => { FillDetails(e) } });
    }

    function CreateExercise(frm: any) {
        console.log('create message', frm);
        createExercise({ variables: frm });
    }

    function EditExercise(frm: any) {
        console.log('edit message');
        // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
        editExercise({variables: frm });
    }

    function ViewExercise(frm: any) {
        console.log('view message');
        //use a variable to set form to disabled/not editable
        useMutation(UPDATE_EXERCISE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function DeleteMessage(id: any) {
        console.log('delete message');
        deleteExercise({ variables: { id: id }});
    }

    
    // enum ENUM_EXERCISES_EXERCISELEVEL {
    //     Beginner,
    //     Intermediate,
    //     Advance,
    //     None
    // }

    function OnSubmit(frm: any) {
        console.log(frm);
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateExercise(frm);
                break;
            case 'edit':
                EditExercise(frm);
                break;
            case 'view':
                ViewExercise(frm);
                break;
            // case 'toggle-status':
            //     ToggleMessageStatus();
            //     break;
            // case 'delete':
            //     DeleteMessage(operation.id);
            //     break;
        }
    }

    FetchData();

    let name = "";
    if(operation.type === 'create'){
        name="Create New";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }

    return (
        <>
            {/* {render && */}
                <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={exerciseSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={exerciseDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}
             {operation.type ==="delete" && <StatusModal
             modalTitle="Delete"
             modalBody="Do you want to delete this message?"
             buttonLeft="Cancel"
             buttonRight="Yes"
             onClick={() => {DeleteMessage(operation.id)}}
             />}
        
            
        </>
    )
}

export default React.forwardRef(CreateEditMessage);