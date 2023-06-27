import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_TRIGGERS,
    ADD_MESSAGE,
    UPDATE_MESSAGE,
    GET_MESSAGE,
    DELETE_MESSAGE,
    UPDATE_STATUS
} from './queries';
import AuthContext from '../../../context/auth-context';
import StatusModal from '../../../components/StatusModal/StatusModal';
import { Subject } from 'rxjs';
import { schema } from './schema';
import { schemaView } from './notificationViewSchema';
import ModalView from '../../../components/modal';
import Toaster from '../../../components/Toaster';
import { flattenObj } from '../../../components/utils/responseFlatten';

interface Operation {
    id: string;
    modal_status: boolean;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

interface Message {
    messageid: string;
    minidesc: string;
    name: string;
    prerecordedtrigger: string;
    prerecordedtype: string;
    title: string;
}

interface Form {
    messageid: string;
    minidesc: string;
    name: string;
    prerecordedtrigger: string;
    prerecordedtype: string;
    title: string;
    user_permissions_user: string;
}

interface Notification {
    id: string;
    data: {
        attributes: {
            description: null | string;
            mediaurl: null | string;
            minidescription: string;
            prerecordedtrigger: {
                data: {
                    attributes: {
                        name: string;
                        __typename: string;
                    };
                    id: string;
                    __typename: string;
                };
                __typename: string;
            };
            prerecordedtype: {
                data: {
                    attributes: {
                        name: string;
                        __typename: string;
                    };
                    id: string;
                    __typename: string;
                };
                __typename: string;
            };
            status: boolean;
            title: string;
            updatedAt: string;
            users_permissions_user: {
                data: {
                    id: string;
                    __typename: string;
                };
                __typename: string;
            };
            __typename: string;
        };
        __typename: string;
    };
    length: number;
    meta: {
        pagination: {
            pageCount: number;
            total: number;
            __typename: string;
        };
        __typename: string;
    };
    __typename: string;
}

interface PrerecordedTrigger {
    id: string;
    attributes: {
        name: string;
        __typename: string;
    };
    __typename: string;
}

interface PrerecordedType {
    id: string;
    attributes: {
        name: string;
        __typename: string;
    };
    __typename: string;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const messageSchema: { [name: string]: any } = require('./message.json');
    const [messageDetails, setMessageDetails] = useState<Message>({} as Message);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [name, setName] = useState<string>('');
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isMessageCreated, setIsMessageCreated] = useState<boolean>(false);
    const [isMessageDeleted, setIsMessageDeleted] = useState<boolean>(false);
    const [isMessageUpdated, setIsMessageUpdated] = useState<boolean>(false);

    const [createMessage] = useMutation(ADD_MESSAGE, {
        onCompleted: () => {
            setIsMessageCreated(true);
            modalTrigger.next(false);
            props.callback();
        }
    });

    const [editMessage] = useMutation(UPDATE_MESSAGE, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsMessageUpdated(true);
        }
    });

    const [deleteMessage] = useMutation(DELETE_MESSAGE, {
        onCompleted: () => {
            props.callback();
            modalTrigger.next(false);
            setIsMessageDeleted(true);
        }
    });

    const [updateStatus] = useMutation(UPDATE_STATUS, {
        onCompleted: () => {
            props.callback();
            modalTrigger.next(false);
        }
    });

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            if (msg.type === 'toggle-status') {
                setShowStatusModal(true);
            }

            if (msg.type === 'delete') {
                setShowDeleteModal(true);
            }

            if (msg.type !== 'delete' && msg.type !== 'toggle-status') {
                modalTrigger.next(true);
            }
        }
    }));

    function loadData(data: PrerecordedTrigger[] & PrerecordedType[]) {
        const flattenData = flattenObj({ ...data });

        messageSchema['1'].properties.prerecordedtype.enum = [...flattenData.prerecordedtypes].map(
            (n) => n.id
        );
        messageSchema['1'].properties.prerecordedtype.enumNames = [
            ...flattenData.prerecordedtypes
        ].map((n) => n.name);
        messageSchema['1'].properties.prerecordedtrigger.enum = [
            ...flattenData.prerecordedtriggers
        ].map((n) => n.id);
        messageSchema['1'].properties.prerecordedtrigger.enumNames = [
            ...flattenData.prerecordedtriggers
        ].map((n) => n.name);
    }

    function FillDetails(data: Notification) {
        const details: Message = {} as Message;
        const flattenData = flattenObj({ ...data });
        const msg = flattenData.notifications[0];

        const operationObject = { ...operation };

        details.name = operationObject.type.toLowerCase();
        details.title = msg.title;
        details.prerecordedtype = msg.prerecordedtype?.id;
        details.prerecordedtrigger = msg.prerecordedtrigger?.id;
        details.minidesc = msg.minidescription;
        details.messageid = msg.id;

        setMessageDetails(details);
        setOperation({} as Operation);

        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit({} as Form);
    }

    useQuery<PrerecordedTrigger[] & PrerecordedType[]>(GET_TRIGGERS, { onCompleted: loadData });

    useQuery<Notification>(GET_MESSAGE, {
        variables: { id: operation.id },
        skip: !operation.id || operation.type === 'toggle-status' || operation.type === 'delete',
        onCompleted: (response) => {
            FillDetails(response);
        }
    });

    function CreateMessage(form: Form) {
        createMessage({ variables: form });
    }

    function EditMessage(form: Form) {
        editMessage({ variables: form });
    }

    function ToggleMessageStatus(id: string, current_status: boolean) {
        updateStatus({ variables: { status: !current_status, messageid: id } });
    }

    function DeleteMessage(id: string) {
        deleteMessage({ variables: { id: id } });
    }

    function OnSubmit(form: Form) {
        if (form) form.user_permissions_user = auth.userid;
        if (form.name === 'edit' || form.name === 'view') {
            if (form.name === 'edit') {
                EditMessage(form);
            }
            if (form.name === 'view') {
                modalTrigger.next(false);
            }
        } else {
            CreateMessage(form);
        }
    }

    useEffect(() => {
        if (operation.type === 'create') {
            setName('Create New Notification');
            setMessageDetails({} as Message);
        } else if (operation.type === 'edit') {
            setName('Edit');
        } else if (operation.type === 'view') {
            setName('View');
        }
    }, [operation.type]);

    return (
        <>
            {
                <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={name === 'View' ? schemaView : schema}
                    showErrorList={false}
                    formSchema={messageSchema}
                    showing={operation.modal_status}
                    formSubmit={
                        name === 'View'
                            ? () => {
                                  modalTrigger.next(false);
                              }
                            : (form: Form) => {
                                  OnSubmit(form);
                              }
                    }
                    formData={messageDetails}
                    modalTrigger={modalTrigger}
                />
            }

            {showStatusModal && (
                <StatusModal
                    show={showStatusModal}
                    onHide={() => setShowStatusModal(false)}
                    modalTitle="Change Status"
                    modalBody="Do you want to change the status?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        ToggleMessageStatus(operation.id, operation.current_status);
                    }}
                />
            )}

            {showDeleteModal && (
                <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this message?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteMessage(operation.id);
                    }}
                />
            )}
            {isMessageCreated ? (
                <Toaster
                    handleCallback={() => setIsMessageCreated(!isMessageCreated)}
                    type="success"
                    msg="New notification has been created"
                />
            ) : null}

            {isMessageUpdated ? (
                <Toaster
                    handleCallback={() => setIsMessageUpdated(!isMessageUpdated)}
                    type="success"
                    msg="Norification has been updated"
                />
            ) : null}

            {isMessageDeleted ? (
                <Toaster
                    handleCallback={() => setIsMessageDeleted(!isMessageDeleted)}
                    type="success"
                    msg="Notification has been deleted"
                />
            ) : null}
        </>
    );
}

export default React.forwardRef(CreateEditMessage);
