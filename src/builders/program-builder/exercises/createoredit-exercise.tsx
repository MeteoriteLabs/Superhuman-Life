import React, { useContext, useImperativeHandle, useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import ModalView from '../../../components/modal'
import {
    FETCH_DATA,
    CREATE_EXERCISE,
    UPDATE_EXERCISE,
    DELETE_EXERCISE,
    FETCH_WORKOUTS
} from './queries'
import AuthContext from '../../../context/auth-context'
import StatusModal from '../../../components/StatusModal/exerciseStatusModal'
import { schema, widgets } from './exerciseSchema'
import { schemaView } from './exerciseSchemaForView'
import { Subject } from 'rxjs'
import { flattenObj } from '../../../components/utils/responseFlatten'
import Toaster from '../../../components/Toaster'

interface Operation {
    id: string
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete'
    current_status: boolean
}

function CreateEditExercise(props: any, ref: any) {
    const auth = useContext(AuthContext)
    const exerciseSchema: { [name: string]: any } = require('./exercises.json')
    const [exerciseDetails, setExerciseDetails] = useState<any>({})
    const [workoutDetails, setWorkoutDetails] = useState<any[]>([])
    const [operation, setOperation] = useState<Operation>({} as Operation)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [toastType, setToastType] = useState<string>('')
    const [toastMessage, setToastMessage] = useState<string>('')

    useQuery(FETCH_WORKOUTS, {
        variables: { id: auth.userid },
        skip: operation.type !== 'delete',
        onCompleted: (r: any) => {
            const flattenedData = flattenObj({ ...r })
            setWorkoutDetails(flattenedData.workouts)
        }
    })

    const [createExercise] = useMutation(CREATE_EXERCISE, {
        onCompleted: (r: any) => {
            modalTrigger.next(false)
            props.callback()
            setIsFormSubmitted(!isFormSubmitted)
            setToastType('success')
            setToastMessage('Exercise has been created successfully')
        }
    })

    const [editExercise] = useMutation(UPDATE_EXERCISE, {
        onCompleted: (r: any) => {
            modalTrigger.next(false)
            setIsFormSubmitted(!isFormSubmitted)
            props.callback()
            setToastType('success')
            setToastMessage('Exercise details has been updated successfully')
        }
    })

    const [deleteExercise] = useMutation(DELETE_EXERCISE, {
        onCompleted: (r: any) => {
            modalTrigger.next(false)
            props.callback()
            setToastType('success')
            setIsFormSubmitted(!isFormSubmitted)
            setToastMessage('Exercise details has been deleted successfully')
        }
    })

    const modalTrigger = new Subject()

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg)

            //show delete modal
            if (msg.type === 'delete') {
                setShowDeleteModal(true)
            }

            //restrict form to render on delete
            if (msg.type !== 'delete') {
                modalTrigger.next(true)
            }
        }
    }))

    enum ENUM_EXERCISE_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advance,
        All_Levels,
        None
    }

    useEffect(() => {
        if (operation.type === 'create') {
            setExerciseDetails({})
        }
    }, [operation.type])

    function FillDetails(data: any) {
        function handleAddExerciseShowUp(msg: any) {
            if (msg.exercisetext !== null) {
                return { AddExercise: 'Text', AddText: msg.exercisetext }
            } else if (msg.exerciseurl !== null) {
                return { AddExercise: 'Add URL', AddURL: msg.exerciseurl }
            } else if (msg.exerciseupload !== null) {
                return { AddExercise: 'Upload', Upload: msg.exerciseupload }
            }
        }

        const flattenedData = flattenObj({ ...data })
        const details: any = {}
        const msg = flattenedData.exercises
        details.exercise = msg[0].exercisename

        details.level = ENUM_EXERCISE_EXERCISELEVEL[msg[0].exerciselevel]
        details.discipline = msg[0].fitnessdisciplines
        details.miniDescription = msg[0].exerciseminidescription
        details.equipment = msg[0].equipment_lists.map((val: any) => {
            return val
        })
        details.muscleGroup = msg[0].muscle_groups.map((val: any) => {
            return val
        })
        details.user_permissions_user = msg[0].users_permissions_user.id
        details.addExercise = handleAddExerciseShowUp(msg[0])
        setExerciseDetails(details)

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true)
        else OnSubmit(null)
    }

    function FetchData() {
        useQuery(FETCH_DATA, {
            variables: { id: operation.id },
            skip: operation.type === 'create' || !operation.id,
            onCompleted: (e: any) => {
                FillDetails(e)
            }
        })
    }

    function CreateExercise(frm: any) {
        frm.discipline = JSON.parse(frm.discipline)
        frm.equipment = JSON.parse(frm.equipment)
        frm.muscleGroup = JSON.parse(frm.muscleGroup)
        createExercise({
            variables: {
                exercisename: frm.exercise,
                exerciselevel: ENUM_EXERCISE_EXERCISELEVEL[frm.level],
                fitnessdisciplines: frm.discipline
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                exerciseminidescription: frm.miniDescription,
                exercisetext: !frm.addExercise.AddText ? null : frm.addExercise.AddText,
                exerciseurl: !frm.addExercise.AddURL ? null : frm.addExercise.AddURL,
                exerciseupload: !frm.addExercise.Upload ? null : frm.addExercise.Upload,
                equipment_lists: frm.equipment
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                exercisemusclegroups: frm.muscleGroup
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                users_permissions_user: frm.user_permissions_user
            }
        })
    }

    function EditExercise(frm: any) {
        frm.discipline = JSON.parse(frm.discipline)
        frm.equipment = JSON.parse(frm.equipment)
        frm.muscleGroup = JSON.parse(frm.muscleGroup)
        editExercise({
            variables: {
                exerciseid: operation.id,
                exercisename: frm.exercise,
                exerciselevel: ENUM_EXERCISE_EXERCISELEVEL[frm.level],
                fitnessdisciplines: frm.discipline
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                exerciseminidescription: frm.miniDescription,
                exercisetext: !frm.addExercise.AddText ? null : frm.addExercise.AddText,
                exerciseurl: !frm.addExercise.AddURL ? null : frm.addExercise.AddURL,
                equipment_lists: frm.equipment
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                exercisemusclegroups: frm.muscleGroup
                    .map((item: any) => {
                        return item.id
                    })
                    .join(',')
                    .split(','),
                users_permissions_user: frm.user_permissions_user
            }
        })
    }

    function DeleteExercise(id: any) {
        deleteExercise({ variables: { id: id } })
    }

    function OnSubmit(frm: any) {
        if (frm) frm.user_permissions_user = auth.userid

        switch (operation.type) {
            case 'create':
                CreateExercise(frm)
                break
            case 'edit':
                EditExercise(frm)
                break
        }
    }

    let name = ''
    if (operation.type === 'create') {
        name = 'Create New Exercise'
    } else if (operation.type === 'edit') {
        name = 'Edit'
    } else if (operation.type === 'view') {
        name = 'View'
    }

    FetchData()

    return (
        <>
            {/* Create , edit and view Modal */}
            <ModalView
                name={name}
                isStepper={false}
                showErrorList={false}
                formUISchema={operation.type === 'view' ? schemaView : schema}
                formSchema={exerciseSchema}
                formSubmit={
                    name === 'View'
                        ? () => {
                              modalTrigger.next(false)
                          }
                        : (frm: any) => {
                              OnSubmit(frm)
                          }
                }
                formData={exerciseDetails}
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
                    EventConnectedDetails={workoutDetails}
                    ExistingEventId={operation.id}
                    modalBody="Do you want to delete this exercise?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteExercise(operation.id)
                    }}
                />
            )}

            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(false)}
                    type={toastType}
                    msg={toastMessage}
                />
            ) : null}
        </>
    )
}

export default React.forwardRef(CreateEditExercise)
