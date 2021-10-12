import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import CreateVoucherModal from '../../components/CreateVoucherModal/CreateVoucherModal';



interface Operation {
    id: string;
    actionType: 'createVoucher' | 'edit' | 'view' | 'toggle-status' | 'delete';
    type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    current_status: boolean;
}

function FinanceActions(props, ref) {

    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            
            //render form if no message id
            if (msg && !msg.id) {
                modalTrigger.next(true);
            }
        }
    }));


    return (
        <div>
            <CreateVoucherModal
                modalTrigger={modalTrigger}
            />
        </div>
    )
}


export default React.forwardRef(FinanceActions)