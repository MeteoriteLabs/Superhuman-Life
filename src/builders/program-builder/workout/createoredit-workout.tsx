import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { FETCH_DATA, CREATE_WORKOUT, UPDATE_WORKOUT, DELETE_WORKOUT } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { schema, widgets } from './workoutSchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const workoutSchema: { [name: string]: any; } = require("./workout.json");
    const [workoutDetails, setWorkoutDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    

    const [createWorkout] = useMutation(CREATE_WORKOUT, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [editWorkout] = useMutation(UPDATE_WORKOUT,{variables: {workoutid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [deleteWorkout] = useMutation(DELETE_WORKOUT, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

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
        // let msg = data.workouts;
        // console.log(msg);
        // details.workout = msg[0].workouttitle;
        setWorkoutDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        useQuery(FETCH_DATA, { variables: { id: operation.id }, skip: (!operation.id || operation.type === 'toggle-status'), onCompleted: (e: any) => { FillDetails(e) } });
    }

    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advanced,
        None
    }

    enum ENUM_WORKOUTS_INTENSITY {
        Low,
        Medium,
        High
    }

    function CreateWorkout(frm: any) {
        if(frm.addWorkout.build){
            frm.addWorkout.build = JSON.parse(frm.addWorkout.build);
        }
        createWorkout({ variables: {
            workouttitle: frm.workout,
            intensity: ENUM_WORKOUTS_INTENSITY[frm.intensity],
            level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
            fitnessdisciplines: frm.discipline.split(","),
            About: frm.about,
            Benifits: frm.benefits,
            warmup: (frm.addWorkout.AddWorkout === "Build" ? (frm.addWorkout.build.warmup ? frm.addWorkout.build.warmup : null) : null),
            mainmovement: (frm.addWorkout.AddWorkout === "Build" ? (frm.addWorkout.build.mainMovement ? frm.addWorkout.build.mainMovement : null) : null),
            cooldown: (frm.addWorkout.AddWorkout === "Build" ? (frm.addWorkout.build.coolDown ? frm.addWorkout.build.coolDown : null) : null),
            workout_text: (frm.addWorkout.AddWorkout === "Text" ? frm.addWorkout.AddText : null),
            workout_URL: (frm.addWorkout.AddWorkout === "Add URL" ? frm.addWorkout.AddURL : null),
            calories: frm.calories,
            equipment_lists: frm.equipment.split(","),
            muscle_groups: frm.muscleGroup.split(","),
            users_permissions_user: frm.user_permissions_user
        }});
    }

    function EditWorkout(frm: any) {
        console.log('edit message');
        // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
        editWorkout({variables: frm });
    }

    function ViewWorkout(frm: any) {
        console.log('view message');
        //use a variable to set form to disabled/not editable
        useMutation(UPDATE_WORKOUT, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function DeleteWorkout(id: any) {
        console.log('delete message');
        deleteWorkout({ variables: { id: id }});
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateWorkout(frm);
                break;
            case 'edit':
                EditWorkout(frm);
                break;
            case 'view':
                ViewWorkout(frm);
                break;
        }
    }

    FetchData();

    let name = "";
    if(operation.type === 'create'){
        name="Create New Workout";
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
                    formSchema={workoutSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={workoutDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}
             {operation.type ==="delete" && <StatusModal
             modalTitle="Delete"
             modalBody="Do you want to delete this message?"
             buttonLeft="Cancel"
             buttonRight="Yes"
             onClick={() => {DeleteWorkout(operation.id)}}
             />}
        
            
        </>
    )
}

export default React.forwardRef(CreateEditMessage);