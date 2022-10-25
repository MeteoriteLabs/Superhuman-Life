import React, { useContext, useImperativeHandle, useState } from 'react';
import ModalView from "../../../components/modal/index";
// import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { schema } from './PayeeSchema';
// import { schemaView } from './schemaView';
import {Subject} from 'rxjs';
// import {flattenObj} from '../../../../components/utils/responseFlatten';

interface Operation {
    id: string;
    packageType: 'Cohort' | 'Live Stream Channel',
    type: 'create' | 'edit' | 'view' | 'pause' | 'all transactions' | 'close account';
    current_status: boolean;
}

const emptyPayeeDetailsState = {
    PayeeCategory: "All contacts",
    TypeofPayee: "Individual",
    PaymentMode: "UPI",
    FrequencyOfPayment:"One Time",
    provideBreakdown: "No"

}

function CreateEditPayee(props: any, ref: any) {
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const auth = useContext(AuthContext);
    const payeeJson: { [name: string]: any; } = require("./Payee.json");

    const modalTrigger =  new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // if(msg.type !== 'delete' && msg.type !== 'toggle-status'){
                modalTrigger.next(true);
            // }
        }
    }));

  return (
    <ModalView
                    name={'Create Payee'}
                    isStepper={true}
                    showErrorList={false}
                    formUISchema={schema}
                    formSchema={payeeJson}
                    // formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={emptyPayeeDetailsState}
                    stepperValues={["Payee Basic Details", "Payment Settings", "Payment Mode"]}
                    // widgets={widgets}
                    modalTrigger={modalTrigger}
                />
  )
}

export default React.forwardRef(CreateEditPayee);
