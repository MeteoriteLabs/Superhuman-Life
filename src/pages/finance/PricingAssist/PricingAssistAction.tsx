import { useMutation } from '@apollo/client';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import PricingAssistEditIcon from '../../../components/customWidget/PricingAssistEditIcon';
import FinanceModal from '../../../components/financeModal/FinanceModal'


import authContext from '../../../context/auth-context';
import { UPDATE_FITNESS_PRICING_ASSITS } from "../graphQL/mutations"

interface Operation {
    id: string;
    actionType: 'edit'
    rowData: any
}

function PricingAssistAction(props, ref) {

    const auth = useContext(authContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [formData, setFormData] = useState<any>();
    const formSchema = require("../PricingAssist/Fitness/fitness.json");


    const uiSchema: any = {
        "type": {
            "ui:widget": (props) => <PricingAssistEditIcon rowData={operation.rowData} />
        }
    }


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            modalTrigger.next(true);
        }
    }));


    console.log('operation', operation);

    const [updateFitnessPricingAssist] = useMutation(UPDATE_FITNESS_PRICING_ASSITS, { onCompleted: (r: any) => { modalTrigger.next(false); } });

    const UpdateFitnessPricingAssist = (form: any) => {
        updateFitnessPricingAssist({
            variables: {
                id: operation.id,
                mrp: form.mrp
            }
        })
    }

    const OnSubmit = (frm: any) => {
        //bind user id
        if (frm) {
            frm.id = operation.id;
            frm.user_permissions_user = auth.userid;
        }

        switch (operation.actionType) {
            case 'edit':
                UpdateFitnessPricingAssist(frm);
                break;
        }
    }



    return (
        <div>
            <FinanceModal
                modalTrigger={modalTrigger}
                formSchema={formSchema}
                name="Pricing Assist"
                formSubmit={(frm: any) => OnSubmit(frm)}
                actionType={operation.actionType}
                formData={operation.id && formData}
                widgets={null}
                formUISchema={uiSchema}
            />
        </div>
    )
}


export default React.forwardRef(PricingAssistAction)