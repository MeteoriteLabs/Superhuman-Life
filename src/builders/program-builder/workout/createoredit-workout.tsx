import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { FETCH_DATA, CREATE_WORKOUT, UPDATE_WORKOUT, DELETE_WORKOUT, FETCH_FITNESS_PROGRAMS } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/workoutStatusModal";
import { schema, widgets } from './workoutSchema';
import {Subject} from 'rxjs';
import {flattenObj} from '../../../components/utils/responseFlatten';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditWorkout(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const workoutSchema: { [name: string]: any; } = require("./workout.json");
    const [workoutDetails, setWorkoutDetails] = useState<any>({});
    const [programDetails, setProgramDetails] = useState<any[]>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    
    useQuery(FETCH_FITNESS_PROGRAMS, {
        variables: {id: auth.userid},
        onCompleted: (r: any) => {
            setProgramDetails(r.fitnessprograms);
        }
    });

    const [createWorkout] = useMutation(CREATE_WORKOUT, { onCompleted: (r: any) => { modalTrigger.next(false); props.callback()} });
    const [editWorkout] = useMutation(UPDATE_WORKOUT,{ onCompleted: (r: any) => { modalTrigger.next(false); props.callback();}});
    const [deleteWorkout] = useMutation(DELETE_WORKOUT, { refetchQueries: ["GET_TABLEDATA"], onCompleted: (r: any) => { modalTrigger.next(false); props.callback();}});

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

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

    function FillDetails(data: any) {
        const flattenData = flattenObj({...data});
        console.log(flattenData);
        function handleAddWorkout(data: any) {
            if (data.workout_URL !== null) {
              return { AddWorkout: "Add URL", AddURL: data.workout_URL };
            } else if (data.workout_text !== null) {
              return { AddWorkout: "Text", AddText: data.workout_text };
            } else if (data.Workout_Video_ID !== null){
              return { AddWorkout: "Upload", Upload: data.Workout_Video_ID };
            } else {
              return {
                AddWorkout: "Build",
                build: {
                  warmup: data.warmup,
                  cooldown: data.cooldown,
                  mainmovement: data.mainmovement,
                },
              };
            }
          }
      
          let details: any = {};
          let msg = flattenData.workouts;
          console.log(msg);
          details.workout = msg[0].workouttitle;
          details.benefits = msg[0].Benifits;
          details.about = msg[0].About;
          details.equipment = msg[0].equipment_lists.map(
            (val: any) => {
              return val;
            }
          );
          details.discipline = msg[0].fitnessdisciplines.map(
            (val: any) => {
              return val
            }
          );
          details.muscleGroup = msg[0].muscle_groups.map(
            (val: any) => {
              return val;
            }
          );
          details.intensity = ENUM_WORKOUTS_INTENSITY[msg[0].intensity];
          details.level = ENUM_EXERCISES_EXERCISELEVEL[msg[0].level];
          details.calories = msg[0].calories;
          details.addWorkout = handleAddWorkout(msg[0]);
          setWorkoutDetails(details);
      
          //if message exists - show form only for edit and view
          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
    }

    function FetchData() {
      useQuery(FETCH_DATA, { variables: { id: operation.id },skip: (operation.type === 'create' || operation.type === 'delete'), onCompleted: (e: any) => { FillDetails(e) } });
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
            Workout_Video_ID: (frm.addWorkout.AddWorkout === "Upload" ? frm.addWorkout.Upload : null),
            calories: frm.calories,
            equipment_lists: frm.equipment.split(","),
            muscle_groups: frm.muscleGroup.split(","),
            users_permissions_user: frm.user_permissions_user
        }});
    }

    function EditWorkout(frm: any) {
        // console.log('edit message');
        // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
        if (frm.addWorkout.build) {
            frm.addWorkout.build = JSON.parse(frm.addWorkout.build);
          }
          editWorkout({
            variables: {
              workoutid: operation.id,
              workouttitle: frm.workout,
              intensity: ENUM_WORKOUTS_INTENSITY[frm.intensity],
              level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
              fitnessdisciplines: frm.discipline.split(","),
              About: frm.about,
              Benifits: frm.benefits,
              warmup:
                frm.addWorkout.AddWorkout === "Build"
                  ? frm.addWorkout.build.warmup
                    ? frm.addWorkout.build.warmup
                    : null
                  : null,
              mainmovement:
                frm.addWorkout.AddWorkout === "Build"
                  ? frm.addWorkout.build.mainMovement
                    ? frm.addWorkout.build.mainMovement
                    : null
                  : null,
              cooldown:
                frm.addWorkout.AddWorkout === "Build"
                  ? frm.addWorkout.build.coolDown
                    ? frm.addWorkout.build.coolDown
                    : null
                  : null,
              workout_text:
                frm.addWorkout.AddWorkout === "Text" ? frm.addWorkout.AddText : null,
              workout_URL:
                frm.addWorkout.AddWorkout === "Add URL"
                  ? frm.addWorkout.AddURL
                  : null,
              Workout_Video_ID: (frm.addWorkout.AddWorkout === "Upload" ? frm.addWorkout.Upload : null),
              calories: frm.calories,
              equipment_lists: frm.equipment.split(","),
              muscle_groups: frm.muscleGroup.split(","),
              users_permissions_user: frm.user_permissions_user,
            },
          });
    }

    function ViewWorkout(frm: any) {
        // console.log('view message');
        //use a variable to set form to disabled/not editable
        useMutation(UPDATE_WORKOUT, { variables: frm,onCompleted: (d: any) => { console.log(d); } })
    }

    function DeleteWorkout(id: any) {
        // console.log('delete message');
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
             EventConnectedDetails={flattenObj({...programDetails})}
             ExistingEventId={operation.id}
             modalBody="Do you want to delete this message?"
             buttonLeft="Cancel"
             buttonRight="Yes"
             onClick={() => {DeleteWorkout(operation.id)}}
             />}
        
            
        </>
    )
}

export default React.forwardRef(CreateEditWorkout);