import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from 'components/modal';
import {
    CREATE_INDUSTRY_SESSION,
    UPDATE_INDUSTRY_SESSION,
    DELETE_INDUSTRY_SESSION,
    GET_INDUSTRY_SESSION
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
    industry: any;
}

function CreateEditWorkout(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const workoutSchema: { [name: string]: any } = require('./workout.json');
    const [workoutDetails, setWorkoutDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [toastType, setToastType] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');

    const [createWorkout] = useMutation(CREATE_INDUSTRY_SESSION, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Session details created successfully');
        }
    });

    const [editWorkout] = useMutation(UPDATE_INDUSTRY_SESSION, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Session details has been updated successfully');
        }
    });

    const [deleteWorkout] = useMutation(DELETE_INDUSTRY_SESSION, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormSubmitted(!isFormSubmitted);
            setToastType('success');
            setToastMessage('Session details has been deleted successfully');
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

    useEffect(() => {
        if (operation.type === 'create') {
            setWorkoutDetails({});
        }
    }, [operation.type]);

    function FillDetails(data: any) {
        const flattenData = flattenObj({ ...data });
        const details: any = {};
        const msg = flattenData.industrySession;
        console.log(msg);
        details.workout = msg.title;
        details.pdfUpload = msg.document;
        details.agenda = msg.agenda;
        details.about = msg.about;
        details.url = msg.url && msg.url.length && msg.url.map((curr) => curr);
        details.equipment = msg.equipment_lists.map((val: any) => {
            return val;
        });

        setWorkoutDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_INDUSTRY_SESSION, {
            variables: { id: operation.id },
            skip: operation.type === 'create' || operation.type === 'delete' || !operation.id,
            onCompleted: (e: any) => {
                FillDetails(e);
            }
        });
    }

    function CreateWorkout(frm: any) {
        frm.equipment = frm.equipment ? JSON.parse(frm.equipment) : null;

        createWorkout({
            variables: {
                data: {
                    title: frm.workout,
                    industryId: `${operation.industry.industry.industry.id}`,
                    about: frm.about,
                    document: frm.pdfUpload,
                    agenda: frm.agenda,
                    url: frm.url ? JSON.parse(frm.url) : null,
                    equipment_lists: frm.equipment
                        .map((item: any) => {
                            return item.id;
                        })
                        .join(',')
                        .split(','),
                    users_permissions_user: frm.user_permissions_user
                }
            }
        });
    }

    function EditWorkout(frm: any) {
        frm.equipment = frm.equipment ? JSON.parse(frm.equipment) : null;

        editWorkout({
            variables: {
                id: operation.id,
                data: {
                    title: frm.title,
                    agenda: frm.agenda,
                    about: frm.about,
                    document: frm.pdfUpload,
                    url: frm.url,
                    equipment_lists:
                        frm.equipment &&
                        frm.equipment.length &&
                        frm.equipment
                            .map((item: any) => {
                                return item.id;
                            })
                            .join(',')
                            .split(','),
                    users_permissions_user: frm.user_permissions_user
                }
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
                formData={operation.type === 'create' ? {} : workoutDetails}
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
                    // EventConnectedDetails={programDetails}
                    // ExistingEventId={operation.id}
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
