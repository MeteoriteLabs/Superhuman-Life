import React, { useContext, useImperativeHandle, useState } from 'react'
import SessionModal from '../../../components/SessionModal/SessionModal';
import authContext from '../../../context/auth-context';
import { schema, widgets } from './programSchema';
import { CREATE_TAG } from '../graphQL/mutation';
import { useMutation } from '@apollo/client';
import ClientModal from '../../../components/ClientModal/ClientModal';
import { Subject } from 'rxjs';



interface Operation {
    id: string;
    actionType: 'create' | 'manager' | 'details' | "allClients";
    type: "One-On-One" | 'Group Class' | 'Classic Class' | 'Custom Class';
    duration: number;
    rowData: any
}

function FitnessAction(props, ref: any) {

    const auth = useContext(authContext);

    const programSchema: { [name: string]: any; } = require("./program.json");

    const [programDetails, setProgramDetails] = useState<any>({});

    const [operation, setOperation] = useState<Operation>({} as Operation);
    
    const modalTrigger = new Subject();

    const [createTag] = useMutation(CREATE_TAG, {
        onCompleted: (data: any) => {
            // CreateProgramManager(data)
            modalTrigger.next(true);
        }
    });

    // const [createProgramManager] = useMutation(CREATE_PROGRAM_MANAGER);


    function CreateFitnessProgram(frm: any) {
        createTag({
            variables: {
                name: frm.batchName
            }
        })
        // createFitnessProgram({
        //     variables: {
        //         title: frm.programName,
        //         fitnessdisciplines: frm.discipline.split(","),
        //         duration_days: Number(operation.duration),
        //         level: frm.level,
        //         description: frm.details,
        //         Is_program: true,
        //         renewal_dt: 0,
        //         users_permissions_user: frm.user_permissions_user
        //     }
        // });
    }


    // const CreateProgramManager = (data) => {
    //     const { fitnessprogram } = data.createFitnessprogram;
    //     createProgramManager({
    //         variables: {
    //             fitnesspackages: operation.id,
    //             fitnessprograms: fitnessprogram.id
    //         }
    //     })
    // }


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);


            if (msg.actionType === "create") {
                const update: { duration: number } = { duration: 0 };
                update.duration = msg.duration;
                setProgramDetails(update);

            } else if (msg.actionType === "details") {
                setProgramDetails({ ...programDetails, ...msg.rowData })
            }
            modalTrigger.next(true);
  
        }
    }));




    function OnSubmit(frm: any) {
        //bind user id
        console.log(frm)
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


    let name = "";
    operation.actionType === 'create' ? name = "Create New Batch" : name = "Manager";




    return (
        <div>
            {(operation.actionType === "create" || operation.actionType === "details") &&
                <SessionModal
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={(frm: any) => { OnSubmit(frm) }}
                    formData={programDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
            }

            {operation.actionType === "allClients" &&
                <ClientModal
                    type={operation.type}
                    modalTrigger={modalTrigger}
                    id={operation.id}
                />
            }
        </div>
    )
}


export default React.forwardRef(FitnessAction)