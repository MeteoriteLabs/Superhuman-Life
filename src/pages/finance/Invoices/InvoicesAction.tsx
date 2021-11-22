
import React, { useContext, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import FinanceModal from '../../../components/financeModal/FinanceModal';
import authContext from '../../../context/auth-context';
import InvoiceModal from './InvoiceModal';




interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete' | 'bank' | 'upi';
    current_status: boolean;
    rowData: any
}

function InvoicesAction(props, ref) {

    const auth = useContext(authContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [formData, setFormData] = useState<any>();
    const widgets = null;
    const formSchema = require("../Invoices/Fintess/fitness.json");


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            //render form if no message id
            if (msg && !msg.id) {
                modalTrigger.next(true);
            }
        }
    }));

    const uiSchema: any = {
        "invoices": {
            "ui:widget": (props) => <InvoiceModal rowData={operation.rowData} />
        }
    }




  

    const OnSubmit = (frm: any) => {
        console.log(frm)
        //bind user id
        if (frm) {
            frm.id = operation.id;
            frm.user_permissions_user = auth.userid;
        }

        switch (operation.actionType) {
            // case 'create':
            //     CreateVoucher(frm);
            //     break;
            // case 'edit':
            //     EditVoucher(frm);
            //     break;
        }
    }



    return (
        <div>
            <FinanceModal
                modalTrigger={modalTrigger}
                formSchema={formSchema}
                name=""
                formSubmit={(frm: any) => OnSubmit(frm)}
                actionType={operation.actionType}
                formData={operation.id && formData}
                formUISchema={uiSchema}
            />
           
        </div>
    )
}


export default React.forwardRef(InvoicesAction)