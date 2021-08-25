import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { UPDATE_FITNESSPROGRAMS, GET_SCHEDULEREVENTS, CREATE_WORKOUT } from "../queries";
import AuthContext from "../../../../context/auth-context";
import StatusModal from '../../../../components/StatusModal/StatusModal';
import { schema, widgets } from '../schema/newWorkoutSchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("../json/newWorkout.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [frmDetails, setFrmDetails] = useState<any>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    
    const [createWorkout] = useMutation(CREATE_WORKOUT, { onCompleted: (r: any) => { updateSchedulerEvents(frmDetails, r.createWorkout.workout.id); console.log(r.createWorkout.workout.id); modalTrigger.next(false); } });
    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
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

    function updateSchedulerEvents(frm: any, workout_id: any) {
        var existingEvents = (props.events === null ? [] : [...props.events]);
        if(frm.day){
            var eventJson: any = {};
            frm.day = JSON.parse(frm.day);
            eventJson.name = frm.workout;
            eventJson.id = workout_id;
            eventJson.startTime = frm.startTime;
            eventJson.endTime = frm.endTime;
            eventJson.day = parseInt(frm.day[0].day.substr(4));
            existingEvents.push(eventJson);
        }
        updateProgram({ variables: {
            programid: program_id,
            events: existingEvents
        } });
    }

    function CreateProgram(frm: any) {
        setFrmDetails(frm);
        if(frm.addWorkout.build){
            frm.addWorkout.build = JSON.parse(frm.addWorkout.build);
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
                CreateProgram(frm);
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