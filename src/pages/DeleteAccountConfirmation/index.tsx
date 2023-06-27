import React, { useState, useContext } from 'react'
import { Modal, Button, Row } from 'react-bootstrap'
import Form from '@rjsf/core'
import AuthContext from '../../context/auth-context'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_USER_PROFILE_DATA, CREATE_DELETE_ACCOUNT, FETCH_USER_PROFILE_DATA } from './queries'

const emptyAccountDeleteState = {
    Reason_to_Delete: '',
    username: '',
    typeDelete: ''
}

const DeleteAccountConfirmation: React.FC<{ show: boolean; onHide: () => void }> = (props) => {
    const auth = useContext(AuthContext)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const deleteAccountJson: { [name: string]: any } = require('./DeleteAccountVerification.json')
    const [show, setShow] = useState<boolean>(false)

    const uiSchema: any = {
        typeDelete: {
            'ui:help': 'Hint: Enter DELETE in capital letters.'
        },
        username: {
            'ui:help': 'Hint: Enter your username'
        }
    }

    const logout = () => {
        auth.logout()
    }

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: () => {
            // logout from session
            logout()
            // redirect to deactivation page
            window.location.assign('/deactiveaccount')
        }
    })

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            setUsername(response.usersPermissionsUser.data.attributes.username)
            setEmail(response.usersPermissionsUser.data.attributes.email)
        }
    })

    function Validate(frm: any, errors: any) {
        if (frm.typeDelete !== 'DELETE') {
            errors.typeDelete.addError('Need to enter delete in capital')
        } else if (frm.username !== username) {
            errors.username.addError('Enter correct username')
        }
        return errors
    }

    const [createDeleteAccount] = useMutation(CREATE_DELETE_ACCOUNT, {
        onCompleted: () => {
            updateProfile({
                variables: {
                    id: auth.userid,
                    data: {
                        confirmed: false
                    }
                }
            })
        }
    })

    // delete account function
    function deleteAccount(frm: any) {
        if (frm.formData.typeDelete === 'DELETE' && frm.formData.username === username) {
            createDeleteAccount({
                variables: {
                    data: {
                        Reason_to_Delete: frm.formData.Reason_to_Delete,
                        email: email
                    }
                }
            })
        }
    }

    function OnSubmit(frm: any) {
        deleteAccount(frm)
    }

    return (
        <>
            {/* Confirmation modal */}
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wish to delete the account?</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShow(true)}>
                        Yes
                    </Button>
                    <Button variant="danger" onClick={props.onHide}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Deleting account modal */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Account Deletion- Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Are you sure you want to delete your account?</h5>
                    <Form
                        schema={deleteAccountJson}
                        onSubmit={(frm: any) => {
                            OnSubmit(frm)
                        }}
                        formData={emptyAccountDeleteState}
                        uiSchema={uiSchema}
                        validate={Validate}
                    >
                        <Row className="mb-2" style={{ justifyContent: 'center' }}>
                            <Button type="submit" size="sm" variant="danger">
                                Delete Permanently
                            </Button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DeleteAccountConfirmation
