import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from 'components/modal';
import {
    FETCH_DATA,
    CREATE_WORKOUT,
    UPDATE_WORKOUT,
    DELETE_WORKOUT,
    FETCH_FITNESS_PROGRAMS
} from './queries';
import AuthContext from 'context/auth-context';
import StatusModal from 'components/StatusModal/workoutStatusModal';
import { schema, widgets } from './workoutSchema';
import { schemaView } from './workoutSchemaView';
import { Subject } from 'rxjs';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditWorkout(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const workoutSchema: { [name: string]: any } = require('./workout.json');
    const [workoutDetails, setWorkoutDetails] = useState<any>({});
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [toastType, setToastType] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');

    useQuery(FETCH_FITNESS_PROGRAMS, {
        variables: { id: operation.id?.toString() },
        skip: operation.type !== 'delete',
        onCompleted: (response: any) => {
            const flattenData = flattenObj({ ...response });
            setProgramDetails(flattenData);
        }
    });

    const [createWorkout] = useMutation(CREATE_WORKOUT, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Workout details created successfully');
        }
    });

    const [editWorkout] = useMutation(UPDATE_WORKOUT, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Workout details has been updated successfully');
        }
    });

    const [deleteWorkout] = useMutation(DELETE_WORKOUT, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Workout details has been deleted successfully');
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
        const flattenData = flattenObj({ ...data });

        function handleOtherType(data: any) {
            const tempObj: any = {};
            tempObj[data[0]?.type] = data[0].value;
            tempObj.type = data[0].type;
            return tempObj;
        }

        function handleAddWorkout(data: any) {
            if (data.workout_URL !== null) {
                return { AddWorkout: 'Add URL', AddURL: data.workout_URL };
            } else if (data.workout_text !== null) {
                return { AddWorkout: 'Text', AddText: data.workout_text };
            } else if (data.Workout_Video_ID !== null) {
                return { AddWorkout: 'Upload', Upload: data.Workout_Video_ID };
            } else {
                return {
                    AddWorkout: 'Build',
                    warmup:
                        data.warmup[0]?.type === 'exercise'
                            ? { exercise: JSON.stringify(data.warmup) }
                            : handleOtherType(data.warmup),
                    cooldown:
                        data.cooldown[0]?.type === 'exercise'
                            ? { exercise: JSON.stringify(data.cooldown.exercise) }
                            : handleOtherType(data.cooldown),
                    mainmovement:
                        data.mainmovement[0]?.type === 'exercise'
                            ? { exercise: JSON.stringify(data.mainmovement.exercise) }
                            : handleOtherType(data.mainmovement)
                };
            }
        }

        const details: any = {};
        const msg = flattenData.workouts;

        details.workout = msg[0].workouttitle;
        details.benefits = msg[0].Benifits;
        details.about = msg[0].About;
        details.equipment = msg[0].equipment_lists.map((val: any) => {
            return val;
        });
        details.discipline = msg[0].fitnessdisciplines.map((val: any) => {
            return val;
        });
        details.muscleGroup = msg[0].muscle_groups.map((val: any) => {
            return val;
        });
        details.intensity = ENUM_WORKOUTS_INTENSITY[msg[0].intensity];
        details.level = ENUM_EXERCISES_EXERCISELEVEL[msg[0].level];
        details.calories = msg[0].calories;
        details.addWorkout = handleAddWorkout(msg[0]);
        setWorkoutDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function FetchData() {
        useQuery(FETCH_DATA, {
            variables: { id: operation.id },
            skip: operation.type === 'create' || operation.type === 'delete' || !operation.id,
            onCompleted: (e: any) => {
                FillDetails(e);
            }
        });
    }

    function CreateWorkout(frm: any) {
        frm.equipment = JSON.parse(frm.equipment);

        createWorkout({
            variables: {
                workouttitle: frm.workout,

                About: frm.about,

                workout_text: frm.agenda,
                // workout_URL: frm.addWorkout.AddWorkout === 'Add URL' ? frm.addWorkout.AddURL : null,

                equipment_lists: frm.equipment
                    .map((item: any) => {
                        return item.id;
                    })
                    .join(',')
                    .split(','),
                users_permissions_user: frm.user_permissions_user
            }
        });
    }

    function EditWorkout(frm: any) {
        frm.equipment = JSON.parse(frm.equipment);

        editWorkout({
            variables: {
                workoutid: operation.id,
                workouttitle: frm.workout,

                About: frm.about,

                // workout_URL: frm.addWorkout.AddWorkout === 'Add URL' ? frm.addWorkout.AddURL : null,

                equipment_lists: frm.equipment
                    .map((item: any) => {
                        return item.id;
                    })
                    .join(',')
                    .split(','),

                users_permissions_user: frm.user_permissions_user
            }
        });
    }

    function DeleteWorkout(id: any) {
        deleteWorkout({ variables: { id: id } });
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateWorkout(frm);
                break;
            case 'edit':
                EditWorkout(frm);
                break;
        }
    }

    FetchData();

    let name = '';
    if (operation.type === 'create') {
        name = 'Create New Session';
    } else if (operation.type === 'edit') {
        name = 'Edit';
    } else if (operation.type === 'view') {
        name = 'View';
    }

    function handleToasCallback() {
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
                formSubmit={
                    name === 'View'
                        ? () => {
                              modalTrigger.next(false);
                          }
                        : (frm: any) => {
                              OnSubmit(frm);
                          }
                }
                formData={workoutDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
                actionType={operation.type}
            />

            {/* Delete Modal */}
            {showDeleteModal && (
                <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    EventConnectedDetails={programDetails}
                    ExistingEventId={operation.id}
                    modalBody="Do you want to delete this session?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteWorkout(operation.id);
                    }}
                />
            )}
            {isFormSubmitted ? (
                <Toaster handleCallback={handleToasCallback} type={toastType} msg={toastMessage} />
            ) : null}
        </>
    );
}

export default React.forwardRef(CreateEditWorkout);
