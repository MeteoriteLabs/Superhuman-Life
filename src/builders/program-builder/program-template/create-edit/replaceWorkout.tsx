import React, { useContext, useImperativeHandle, useState } from 'react';
import { useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { REPLACE_SESSION_WORKOUT } from "../queries";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from '../schema/replaceWorkoutSchema';
import {Subject} from 'rxjs';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
    details: any;
    title: string;
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("../json/replaceWorkout.json");
    const [programDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);

    const [updateSession] = useMutation(REPLACE_SESSION_WORKOUT, {onCompleted: (r: any) => { modalTrigger.next(false); } });

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function UpdateProgram(frm: any) {
        frm.workoutEvent = JSON.parse(frm.workoutEvent);
        updateSession({
            variables: {
                id: operation.details.sessionId,
                workoutId: frm.workoutEvent[0].id,
            }
        });
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                UpdateProgram(frm);
                break;
            case 'edit':
                UpdateProgram(frm);
                break;
        }
    }

    let name = "";
    if(operation.type === 'create'){
        name="Rest Day";
    }else if(operation.type === 'edit'){
        name=`Replace ${operation.title}`;
    }else if(operation.type === 'view'){
        name="View";
    }

    return (
        <>
            {/* {render && */}
                <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={programDetails}
                    stepperValues={["Schedule", "Workout"]}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}
        </>
    )
}

export default React.forwardRef(CreateEditMessage);