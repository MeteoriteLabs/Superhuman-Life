import React, { useImperativeHandle, useState } from 'react'
import ConfirmationModel from '../model/ConfirmationModel';
import RequestModel from '../model/RequestModel';


interface Operation {
    actionType: "confirmation" | 'request',
    formData: any
}

function ConfirmRequestAction(props, ref: any) {


    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);



    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            // console.log(msg);
            setRender(true);
            setOperation(msg)
        }
    }))



    return (
        <div>
            {(render && operation.actionType === "confirmation") &&
                <ConfirmationModel
                    render={render}
                    setRender={setRender}
                    formData = {operation.formData}
                   
                />}


            {(render && operation.actionType === "request") &&
                <RequestModel
                    render={render}
                    setRender={setRender} />}
        </div>
    )
}


export default React.forwardRef(ConfirmRequestAction)