import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import PricingAssistEditIcon from '../../../components/customWidget/PricingAssistEditIcon';
import FinanceModal from '../../../components/financeModal/FinanceModal'
import authContext from '../../../context/auth-context';
import { CREATE_FITNESS_PRICING_ASSIT, UPDATE_FITNESS_PRICING_ASSITS } from "../graphQL/mutations"

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
            "ui:widget": () => <PricingAssistEditIcon rowData={operation.rowData} />
        }
    }

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            modalTrigger.next(true);
        }
    }));

    useEffect(() => {
        let updateFormData: any = {};
        updateFormData.mrp = operation?.rowData?.mrp;
        setFormData(updateFormData);
    }, [operation])

    // create price 
    const [createFitnessPricingAssist] = useMutation(CREATE_FITNESS_PRICING_ASSIT, { onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); } });

    const CreateFitnessPricingAssist = (form: any) => {
        createFitnessPricingAssist({
            variables: {
                data:{
                    fitness_package_type: operation.rowData.packageTypeID[0],
                    users_permissions_users:form.users_permissions_users,
                    Mode: operation.rowData.mode,
                    mrp: form.mrp
                }
            }
        })
    }

    // update price
    const [updateFitnessPricingAssist] = useMutation(UPDATE_FITNESS_PRICING_ASSITS, { onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); } });

    const UpdateFitnessPricingAssist = (form: any) => {
        console.log(form)
        updateFitnessPricingAssist({
            variables: {
                id: operation.id,
                mrp: form.mrp,
            }
        })
    }

    const OnSubmit = (frm: any) => {
        //bind user id
        if (frm) {
            frm.id = operation.id;
            frm.users_permissions_users = auth.userid;
        }

        switch (operation.actionType) {
            case 'edit':
                if (operation.id === "") {
                    CreateFitnessPricingAssist(frm)
                } else {
                    UpdateFitnessPricingAssist(frm);
                }
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
                formUISchema={uiSchema}
            />
        </div>
    )
}

export default React.forwardRef(PricingAssistAction)