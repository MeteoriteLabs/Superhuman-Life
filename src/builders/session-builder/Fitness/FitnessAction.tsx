import React, { useImperativeHandle, useState } from 'react'
import SessionModal from '../../../components/SessionModal/SessionModal';


// Build Assign Edit View Details

interface Operation {
    id: string;
    actionType: 'build' | 'assign' | 'edit' | 'view' | 'details';
    type: 'Personal Training'
}

function FitnessAction(props, ref: any) {
    console.log(ref)

    const [render, setRender] = useState<boolean>(false);
    // const [opertion, setOperation] = useState<Operation>({} as Operation);
    const [opertion, setOperation] = useState<any>({} as Operation);




    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log('msg', msg)
            setOperation(msg);


            setRender(true)
        }
    }))


    return (
        <div>
            {render &&
                <SessionModal
                    render={render}
                    setRender= {setRender}
                />}

        </div>
    )
}


export default React.forwardRef(FitnessAction)