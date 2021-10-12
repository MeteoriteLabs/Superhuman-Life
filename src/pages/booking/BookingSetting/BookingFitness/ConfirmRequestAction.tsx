import React, { useImperativeHandle, useState } from 'react'
import ConfirmationModel from '../model/ConfirmationModel';
import RequestModel from '../model/RequestModel';
import { Subject } from 'rxjs';


interface Operation {
    actionType: "confirmation" | 'request',
    formData: any
}

function ConfirmRequestAction(props, ref: any) {


    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);


    const modalTrigger = new Subject();


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            // console.log(msg);
            setOperation(msg)
            modalTrigger.next(true);
        }
    }))



    return (
        <div>
            {operation.actionType === "confirmation" &&
                <ConfirmationModel
                    formData={operation.formData}
                    modalTrigger={modalTrigger}
                />}


            {operation.actionType === "request" &&
                <RequestModel
                    render={render}
                    setRender={setRender} />}
        </div>
    )
}


export default React.forwardRef(ConfirmRequestAction)