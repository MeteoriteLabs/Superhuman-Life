import React, { useContext, useImperativeHandle, useState } from 'react'
import SessionModal from '../../../components/SessionModal/SessionModal';
import { Subject } from 'rxjs';
import authContext from '../../../context/auth-context';
import { schema, widgets } from './programSchema';
import { CREATE_PROGRAM, CREATE_PROGRAM_MANAGER } from '../graphQL/mutation';
import { useMutation } from '@apollo/client';
import ClientModal from '../../../components/ClientModal/ClientModal';



interface Operation {
    id: string;
    actionType: 'create' | 'manager' | 'details' | "allClients";
    type: 'Personal Training' | 'Group Class' | 'Classic Class' | 'Custom Class';
    duration: number;
    rowData: any
}

function FitnessAction(props, ref: any) {

    const auth = useContext(authContext);
    const [render, setRender] = useState<boolean>(false);

    const programSchema: { [name: string]: any; } = require("./program.json");

    const [programDetails, setProgramDetails] = useState<any>({});

    const [operation, setOperation] = useState<Operation>({} as Operation);

    const [createFitnessProgram] = useMutation(CREATE_PROGRAM, {
        onCompleted: (data: any) => {
            CreateProgramManager(data)
            // modalTrigger.next(false);
            setRender(false)
        }
    });

    const [createProgramManager] = useMutation(CREATE_PROGRAM_MANAGER);


    function CreateFitnessProgram(frm: any) {
        console.log(frm);
        createFitnessProgram({
            variables: {
                title: frm.programName,
                fitnessdisciplines: frm.discipline.split(","),
                duration_days: Number(operation.duration),
                level: frm.level,
                description: frm.details,
                Is_program: true,
                users_permissions_user: frm.user_permissions_user
            }
        });
    }


    const CreateProgramManager = (data) => {
        const { fitnessprogram } = data.createFitnessprogram;
        createProgramManager({
            variables: {
                fitnesspackages: operation.id,
                fitnessprograms: fitnessprogram.id
            }
        })
    }


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            // console.log(msg)
            setOperation(msg);



            if (msg.actionType === "create") {
                const update: { duration: number } = { duration: 0 };
                update.duration = msg.duration;
                setProgramDetails(update);

            } else if (msg.actionType === "details") {
                setProgramDetails({ ...programDetails, ...msg.rowData })
            }
            setRender(true)
            // if (msg.actionType === "allClients") {
            // }
            //render form if no message id
            // if (msg && !msg.id)
        }
    }));


    // function FillDetails(data: any) {
    //     let details: any = {};
    //     let msg = data.exercises;
    //     console.log(msg);
    //     // setExerciseDetails(details);

    //     //if message exists - show form only for edit and view
    //     if (['edit', 'view'].indexOf(operation.type) > -1) {
    //         modalTrigger.next(true);
    //     }
    //     else {
    //         // OnSubmit(null);
    //     }
    // }


    // function viewDetails(frm: any) {
    //     console.log('detail message');
    //     // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
    //     // editExercise({variables: frm });
    //     console.log(operation)
    //     // setProgramDetails({...programDetails})
    // }


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
    operation.actionType === 'create' ? name = "Create New Program" : name = "Manager";




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
                    render={render}
                    setRender={setRender}
                />
            }

            {operation.actionType === "allClients" &&
                <ClientModal
                    type={operation.type}
                    render={render}
                    setRender={setRender}
                    id={operation.id}
                />
            }
        </div>
    )
}


export default React.forwardRef(FitnessAction)