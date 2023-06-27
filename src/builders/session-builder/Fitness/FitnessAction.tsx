import React, { useContext, useImperativeHandle, useState } from 'react';
import SessionModal from '../../../components/SessionModal/SessionModal';
import authContext from '../../../context/auth-context';
import { schema, widgets } from './programSchema';
import { CREATE_TAG } from '../graphQL/mutation';
import { useMutation } from '@apollo/client';
import ClientModal from '../../../components/ClientModal/ClientModal';
import { Subject } from 'rxjs';

interface Operation {
    id: string;
    actionType: 'create' | 'manager' | 'details' | 'allClients';
    type: 'One-On-One' | 'Group Class' | 'Classic Class' | 'Custom Class';
    duration: number;
    rowData: any;
}

function FitnessAction(props: { callback: () => void }, ref: any) {
    const auth = useContext(authContext);
    const programSchema: { [name: string]: any } = require('./program.json');
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [showClientModal, setShowClientModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

    const [createTag] = useMutation(CREATE_TAG, {
        onCompleted: () => {
            // CreateProgramManager(data)
            modalTrigger.next(false);
            props.callback();
        }
    });

    // const [createProgramManager] = useMutation(CREATE_PROGRAM_MANAGER);

    function CreateFitnessProgram(frm: any) {
        createTag({
            variables: {
                name: frm.batchName,
                fitnessPackageID: operation.id
            }
        });
    }

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // render delete modal for delete operation
            if (msg.actionType === 'allClients') {
                setShowClientModal(true);
            }

            if (msg.actionType === 'create') {
                const update: { duration: number } = { duration: 0 };
                update.duration = msg.duration;
                setProgramDetails(update);
                setShowDetailsModal(true);
            } else if (msg.actionType === 'details') {
                setProgramDetails({ ...programDetails, ...msg.rowData });
                setShowDetailsModal(true);
            }
            //restrict form to render on delete operation
            if (msg.actionType !== 'allClients') {
                modalTrigger.next(true);
            }
            // modalTrigger.next(true);
        }
    }));

    function OnSubmit(frm: any) {
        //bind user id

        if (frm) {
            frm.user_permissions_user = auth.userid;
            frm.duration = operation.duration;
        }

        switch (operation.actionType) {
            case 'create':
                CreateFitnessProgram(frm);
                break;
            case 'details':
                // viewDetails(frm);
                break;
        }
    }

    let name = '';
    operation.actionType === 'create' ? (name = 'Create New Batch') : (name = 'Manager');

    return (
        <div>
            {showDetailsModal && (
                <SessionModal
                    show={showDetailsModal}
                    onHide={() => setShowDetailsModal(false)}
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={(frm: any) => {
                        OnSubmit(frm);
                    }}
                    formData={programDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
            )}

            {showClientModal && (
                <ClientModal
                    show={showClientModal}
                    onHide={() => setShowClientModal(false)}
                    type={operation.type}
                    modalTrigger={modalTrigger}
                    id={operation.id}
                />
            )}
        </div>
    );
}

export default React.forwardRef(FitnessAction);
