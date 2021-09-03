import React, { useImperativeHandle, useState } from 'react'
import SessionModal from '../../../components/SessionModal/SessionModal';


// Build Assign Edit View Details

interface Operation {
    id: string;
    actionType: 'addNew' | 'manager' | 'details';
    type: 'Personal Training' | 'Group Class' | 'Classic Class' | 'Custom Class'
    rowData: {
        programName: string
    }
}

function FitnessAction(props, ref: any) {


    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [packageId, setPackageId] = useState('')
    // const [opertion, setOperation] = useState<any>({} as Operation);





    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log('msg', msg)
            setOperation(msg);
            setRender(true);
            setPackageId(msg.id)
        }
    }));





    return (
        <div>
            {render &&
                <SessionModal
                    render={render}
                    setRender={setRender}
                    rowData={operation.rowData}
                    actionType={operation.actionType}
                    packageId = {packageId}
                    type={operation.type}
                />}

        </div>
    )
}


export default React.forwardRef(FitnessAction)