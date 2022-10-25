import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { FETCH_DATA, CREATE_WORKOUT, UPDATE_WORKOUT, DELETE_WORKOUT, FETCH_FITNESS_PROGRAMS } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/workoutStatusModal";
import { schema, widgets } from './workoutSchema';
import { schemaView } from './workoutSchemaView';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../components/utils/responseFlatten';
import Toaster from '../../../components/Toaster';

interface Operation {
  id: string;
  type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
  current_status: boolean;
}

function CreateEditWorkout(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const workoutSchema: { [name: string]: any; } = require("./workout.json");
  const [workoutDetails, setWorkoutDetails] = useState<any>({});
  const [programDetails, setProgramDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [toastType, setToastType] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  useQuery(FETCH_FITNESS_PROGRAMS, {
    variables: { id: operation.id?.toString() },
    skip: (operation.type !== 'delete'),
    onCompleted: (r: any) => {
      const flattenData = flattenObj({...r});
      setProgramDetails(flattenData);
    }
  });

  const [createWorkout] = useMutation(CREATE_WORKOUT, { 
    onCompleted: (r: any) => { 
      modalTrigger.next(false); 
      props.callback();
      setIsFormSubmitted(!isFormSubmitted);
      setToastType('success');
      setToastMessage('Workout details created successfully');
    } ,
    onError: (e: any) => {
      setToastType('error');
      setIsFormSubmitted(!isFormSubmitted);
      setToastMessage('Workout details has not been created');
    }
  });
  const [editWorkout] = useMutation(UPDATE_WORKOUT, { 
    onCompleted: (r: any) => { 
      modalTrigger.next(false); 
      props.callback(); 
      setIsFormSubmitted(!isFormSubmitted);
      setToastType('success');
      setToastMessage('Workout details has been updated successfully'); 
    } ,
    onError: (e: any) => {
      setToastType('error');
      setIsFormSubmitted(!isFormSubmitted);
      setToastMessage('Workout details has not been updated');
    }
  });
  const [deleteWorkout] = useMutation(DELETE_WORKOUT, { 
    onCompleted: (r: any) => { 
      modalTrigger.next(false); 
      props.callback(); 
      setIsFormSubmitted(!isFormSubmitted);
      setToastType('success');
      setToastMessage('Workout details has been deleted successfully');
    } ,
    onError: (e: any) => {
      setToastType('error');
      setIsFormSubmitted(!isFormSubmitted);
      setToastMessage('Workout details has not been deleted'); 
    }
  });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      // render delete modal for delete operation
      if (msg.type === 'delete') {
        setShowDeleteModal(true);
      }

      //restrict form to render on delete operation
      if (msg.type !== 'delete') {
        modalTrigger.next(true);
      }

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

  useEffect(() => {
    if (operation.type === 'create') {
      setWorkoutDetails({});
    }
  }, [operation.type]);

  function FillDetails(data: any) {
    console.log(data);
    const flattenData = flattenObj({ ...data });

    function handleOtherType(data: any){
      console.log(data);
      const tempObj: any = {};
      tempObj[data[0]?.type] = data[0].value;
      tempObj.type = data[0].type;
      return tempObj
    }

    function handleAddWorkout(data: any) {
      console.log(data);
      if (data.workout_URL !== null) {
        return { AddWorkout: "Add URL", AddURL: data.workout_URL };
      } else if (data.workout_text !== null) {
        return { AddWorkout: "Text", AddText: data.workout_text };
      } else if (data.Workout_Video_ID !== null) {
        return { AddWorkout: "Upload", Upload: data.Workout_Video_ID };
      } else {
        return {
          AddWorkout: "Build",
          warmup: data.warmup[0]?.type === "exercise" ? { "exercise": JSON.stringify(data.warmup) } : handleOtherType(data.warmup),
          cooldown: data.cooldown[0]?.type === "exercise" ? { "exercise": JSON.stringify(data.cooldown.exercise) } : handleOtherType(data.cooldown),
          mainmovement: data.mainmovement[0]?.type === "exercise" ? { "exercise": JSON.stringify(data.mainmovement.exercise) } : handleOtherType(data.mainmovement),
        };
      }
    }

    let details: any = {};
    let msg = flattenData.workouts;

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
    useQuery(FETCH_DATA, { variables: { id: operation.id }, skip: (operation.type === 'create' || operation.type === 'delete' || !operation.id), onCompleted: (e: any) => { FillDetails(e) } });
  }

  function CreateWorkout(frm: any) {
    frm.discipline = JSON.parse(frm.discipline);
    frm.equipment = JSON.parse(frm.equipment);
    frm.muscleGroup = JSON.parse(frm.muscleGroup);
    if (frm.addWorkout.AddWorkout === 'Build') {

      if (Object.keys(frm.addWorkout.warmup)[0] === "exercise") {
        frm.addWorkout.warmup = JSON.parse(frm.addWorkout.warmup.exercise);
      } else {
        frm.addWorkout.warmup.type = Object.keys(frm.addWorkout.warmup)[0];
        frm.addWorkout.warmup.value = frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
        delete frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
        frm.addWorkout.warmup = [frm.addWorkout.warmup]
      }
      if (Object.keys(frm.addWorkout.mainmovement)[0] === "exercise") {
        frm.addWorkout.mainmovement = JSON.parse(frm.addWorkout.mainmovement.exercise);
      } else {
        frm.addWorkout.mainmovement.type = Object.keys(frm.addWorkout.mainmovement)[0];
        frm.addWorkout.mainmovement.value = frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
        delete frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
        frm.addWorkout.mainmovement = [frm.addWorkout.mainmovement]
      }
      if (Object.keys(frm.addWorkout.cooldown)[0] === "exercise") {
        frm.addWorkout.cooldown = JSON.parse(frm.addWorkout.cooldown.exercise);
      } else {
        frm.addWorkout.cooldown.type = Object.keys(frm.addWorkout.cooldown)[0];
        frm.addWorkout.cooldown.value = frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
        delete frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
        frm.addWorkout.cooldown = [frm.addWorkout.cooldown]
      }
    }

    createWorkout({
      variables: {
        workouttitle: frm.workout,
        intensity: ENUM_WORKOUTS_INTENSITY[frm.intensity],
        level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
        fitnessdisciplines: frm.discipline.map((item: any) => { return item.id }).join(',').split(','),
        About: frm.about,
        Benifits: frm.benefits,
        warmup: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.warmup : null),
        mainmovement: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.mainmovement : null),
        cooldown: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.cooldown : null),
        workout_text: (frm.addWorkout.AddWorkout === "Text" ? frm.addWorkout.AddText : null),
        workout_URL: (frm.addWorkout.AddWorkout === "Add URL" ? frm.addWorkout.AddURL : null),
        Workout_Video_ID: (frm.addWorkout.AddWorkout === "Upload" ? frm.addWorkout.Upload : null),
        calories: frm.calories,
        equipment_lists: frm.equipment.map((item: any) => { return item.id }).join(',').split(','),
        muscle_groups: frm.muscleGroup.map((item: any) => { return item.id }).join(',').split(','),
        users_permissions_user: frm.user_permissions_user
      }
    });
  }

  function EditWorkout(frm: any) {

    frm.discipline = JSON.parse(frm.discipline);
    frm.equipment = JSON.parse(frm.equipment);
    frm.muscleGroup = JSON.parse(frm.muscleGroup);
    if (frm.addWorkout.AddWorkout === 'Build') {
      if (Object.keys(frm.addWorkout.warmup)[0] === "exercise") {
        frm.addWorkout.warmup = JSON.parse(frm.addWorkout.warmup.exercise);
      } else {
        frm.addWorkout.warmup.type = Object.keys(frm.addWorkout.warmup)[0];
        frm.addWorkout.warmup.value = frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
        delete frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
        frm.addWorkout.warmup = [frm.addWorkout.warmup]
      }
      if (Object.keys(frm.addWorkout.mainmovement)[0] === "exercise") {
        frm.addWorkout.mainmovement = JSON.parse(frm.addWorkout.mainmovement.exercise);
      } else {
        frm.addWorkout.mainmovement.type = Object.keys(frm.addWorkout.mainmovement)[0];
        frm.addWorkout.mainmovement.value = frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
        delete frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
        frm.addWorkout.mainmovement = [frm.addWorkout.mainmovement]
      }
      if (Object.keys(frm.addWorkout.cooldown)[0] === "exercise") {
        frm.addWorkout.cooldown = JSON.parse(frm.addWorkout.cooldown.exercise);
      } else {
        frm.addWorkout.cooldown.type = Object.keys(frm.addWorkout.cooldown)[0];
        frm.addWorkout.cooldown.value = frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
        delete frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
        frm.addWorkout.cooldown = [frm.addWorkout.cooldown]
      }
    }

    editWorkout({
      variables: {
        workoutid: operation.id,
        workouttitle: frm.workout,
        intensity: ENUM_WORKOUTS_INTENSITY[frm.intensity],
        level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
        fitnessdisciplines: frm.discipline.map((item: any) => { return item.id }).join(',').split(','),
        About: frm.about,
        Benifits: frm.benefits,
        warmup: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.warmup : null),
        mainmovement: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.mainmovement : null),
        cooldown: (frm.addWorkout.AddWorkout === "Build" ? frm.addWorkout.cooldown : null),
        workout_text: (frm.addWorkout.AddWorkout === "Text" ? frm.addWorkout.AddText : null),
        workout_URL: (frm.addWorkout.AddWorkout === "Add URL" ? frm.addWorkout.AddURL : null),
        Workout_Video_ID: (frm.addWorkout.AddWorkout === "Upload" ? frm.addWorkout.Upload : null),
        calories: frm.calories,
        equipment_lists: frm.equipment.map((item: any) => { return item.id }).join(',').split(','),
        muscle_groups: frm.muscleGroup.map((item: any) => { return item.id }).join(',').split(','),
        users_permissions_user: frm.user_permissions_user,
      },
    });
  }

  function ViewWorkout(frm: any) {

  }

  function DeleteWorkout(id: any) {
    deleteWorkout({ variables: { id: id } });
  }

  function OnSubmit(frm: any) {
    //bind user id
    if (frm)
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
  if (operation.type === 'create') {
    name = "Create New Workout";
  } else if (operation.type === 'edit') {
    name = "Edit";
  } else if (operation.type === 'view') {
    name = "View";
  }

  function handleToasCallback(){
    setIsFormSubmitted(false);
  }

  return (
    <>
      {/* Create , Edit and View Modal */}
      <ModalView
        name={name}
        isStepper={false}
        showErrorList={false}
        formUISchema={operation.type === 'view' ? schemaView : schema}
        formSchema={workoutSchema}
        formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
        formData={workoutDetails}
        widgets={widgets}
        modalTrigger={modalTrigger}
      />

      {/* Delete Modal */}
      {showDeleteModal && <StatusModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        modalTitle="Delete"
        EventConnectedDetails={programDetails}
        ExistingEventId={operation.id}
        modalBody="Do you want to delete this workout?"
        buttonLeft="Cancel"
        buttonRight="Yes"
        onClick={() => { DeleteWorkout(operation.id) }}
      />}
      {isFormSubmitted ?
                <Toaster handleCallback={handleToasCallback} type={toastType} msg={toastMessage} />
                : null}
    </>
  )
}

export default React.forwardRef(CreateEditWorkout);