import React, { useImperativeHandle, useState } from 'react'
//import { useMutation } from "@apollo/client";
import ModalView from '../../../../../components/modal'
//import { ADD_CLIENT } from "./queries";
//import AuthContext from "../../../context/auth-context";
import { Subject } from 'rxjs'
import { schema, widgets } from './schema'

interface Operation {
    id: string
    type: 'create'
}

function CreateNutrition(props: any, ref: any) {
    //const auth = useContext(AuthContext);
    const GoalSchema: { [name: string]: any } = require('./forms/nutrition.json')
    //const uiSchema: {} = require("./schema.tsx");
    //const [messageDetails, setMessageDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation)

    //  const [createClient] = useMutation(ADD_CLIENT, {
    //       onCompleted: (r: any) => {
    //            modalTrigger.next(false);
    //       },
    //  });

    const modalTrigger = new Subject()

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg)

            if (msg && !msg.id) {
                modalTrigger.next(true)
            }
        }
    }))

    function CreateGoal(frm: any) {
        //   let userName = frm.firstname.slice(0, 1) + " " + frm.lastname;
        //   createClient({
        //        variables: {
        //             username: userName,
        //             firstname: frm.firstname,
        //             lastname: frm.lastname,
        //             email: frm.email,
        //             phone: frm.phone,
        //        },
        //   });
    }

    function OnSubmit(frm: any) {
        //   if (frm) {
        //        frm.user_permissions_user = auth.userid;
        //   }

        switch (operation.type) {
            case 'create':
                CreateGoal(frm)
                break
        }
    }

    return (
        <>
            {operation.type === 'create' && (
                <ModalView
                    name="New Nutrition"
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={GoalSchema}
                    //showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                        OnSubmit(frm)
                    }}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
            )}
        </>
    )
}

export default React.forwardRef(CreateNutrition)
