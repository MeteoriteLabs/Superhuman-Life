import React, { useImperativeHandle, useState } from 'react'
import { useMutation } from '@apollo/client'
import ModalView from '../../../components/modal'
import { ADD_CLIENT_NEW } from './queries'
import StatusModal from '../../../components/StatusModal/StatusModal'
import { Subject } from 'rxjs'
import { schema, widgets } from './schema'

interface Operation {
    id: string
    modal_status: boolean
    type: 'create' | 'delete'
}

function CreateClient(props: any, ref: any) {
    const ClientSchema: { [name: string]: any } = require('./client.json')
    const [operation, setOperation] = useState<Operation>({} as Operation)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [createClient] = useMutation(ADD_CLIENT_NEW, {
        onCompleted: (r: any) => {
            modalTrigger.next(false)
            props.callback()
        }
    })

    const modalTrigger = new Subject()

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg)

            // set show delete modal for delete operation
            if (msg.type === 'delete') {
                setShowDeleteModal(true)
            }

            // restrict create modal to render for delete operation
            if (msg.type !== 'delete') {
                modalTrigger.next(true)
            }
        }
    }))

    function CreateClient(frm: any) {
        const userName = frm.firstname.slice(0, 1) + ' ' + frm.lastname
        createClient({
            variables: {
                username: userName,
                firstname: frm.firstname,
                lastname: frm.lastname,
                email: frm.email,
                phone: frm.phone
            }
        })
    }

    function DeleteClient(id: any) {
        // deleteClient({ variables: { id: id } });
    }

    function OnSubmit(frm: any) {
        switch (operation.type) {
            case 'create':
                CreateClient(frm)
                break
        }
    }

    //FetchData();
    // mutation client($username: String!, $firstname: String, $lastname: String, $email: String!, $phone: String) {
    //      createUser(
    //           input: {
    //                data: {
    //                     username: $username
    //                     Firstname: $firstname
    //                     Lastname: $lastname
    //                     email: $email
    //                     Phone: $phone
    //                     role: "2"
    //                }
    //           }
    //      ) {
    //           user {
    //                id
    //                createdAt
    //                updatedAt
    //                username
    //                Phone
    //                email
    //           }
    //      }
    // }

    return (
        <>
            {/* Create Modal */}
            {operation.type === 'create' && (
                <ModalView
                    name="New Client"
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={ClientSchema}
                    showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                        OnSubmit(frm)
                    }}
                    //  formData={messageDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this message?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteClient(operation.id)
                    }}
                />
            )}
        </>
    )
}

export default React.forwardRef(CreateClient)
