import React, { useContext, useImperativeHandle, useState } from 'react'
import SessionModal from '../../../components/SessionModal/SessionModal';
import { Subject } from 'rxjs';
import authContext from '../../../context/auth-context';
import { schema, widgets } from './programSchema';
import { CREATE_PROGRAM } from '../graphQL/mutation';
import { useMutation } from '@apollo/client';



interface Operation {
    id: string;
    actionType: 'create' | 'manager' | 'details';
    type: 'Personal Training' | 'Group Class' | 'Classic Class' | 'Custom Class'

}

function FitnessAction(props, ref: any) {

    const auth = useContext(authContext);
    const [render, setRender] = useState<boolean>(false);
    const programSchema: { [name: string]: any; } = require("./program.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);

    const [createProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });

    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    function CreateProgram(frm: any) {
        console.log(frm);
        createProgram({
            variables: {
                title: frm.programName,
                fitnessdisciplines: frm.discipline.split(","),
                duration_days: frm.duration,
                level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
                description: frm.details,
                users_permissions_user: frm.user_permissions_user
            }
        });
    }


    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log(msg)
            setOperation(msg);

            modalTrigger.next(true);
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


    function ManageProgram(frm: any) {
        console.log('edit message');
        // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
        // editExercise({variables: frm });
    }


    function OnSubmit(frm: any) {
        //bind user id
        if (frm)
            frm.user_permissions_user = auth.userid;

        switch (operation.actionType) {
            case 'create':
                CreateProgram(frm);
                break;
            case 'manager':
                ManageProgram(frm);
                break;

        }
    }


    let name = "";
    if (operation.actionType === 'create') {
        name = "Create New Program";
    } else if (operation.actionType === 'manager') {
        name = "Manager";
    }




    return (
        <div>

            <SessionModal
                name={name}
                isStepper={false}
                formUISchema={schema}
                formSchema={programSchema}
                formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                formData={programDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
            />

        </div>
    )
}


export default React.forwardRef(FitnessAction)