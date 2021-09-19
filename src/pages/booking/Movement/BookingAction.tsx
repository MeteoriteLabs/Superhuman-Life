import { useMutation } from '@apollo/client';
import React, { useImperativeHandle, useState } from 'react'
import AcceptRejectModal from '../../../components/AcceptRejectModal/AcceptRejectModal';
import { UPDATE_BOOKING_STATUS } from '../graphQL/mutation';

interface Operation {
    id: string,
    actionType: "manage" | "view" | "request" | "accept" | "reject",
    formData:any
}

function BookingAction(props, ref: any) {


    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);



    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: any) => {
            setRender(true);
            setOperation(msg)
        }
    }),
    )

    const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS)


    console.log(operation)
    const onClick = () => {
        const updateValue = {
            id: operation.id,
            booking_status: operation.actionType === "accept" ? "accepted" : "rejected"
        };

        updateBookingStatus({
            variables: updateValue
        })

    }

    return (
        <div>
            {(render && (operation.actionType === "accept" || operation.actionType === "reject")) &&
                <AcceptRejectModal
                    render={render}
                    setRender={setRender}
                    modalTitle="Change Status"
                    modalBody={`Are you sure you want to ${operation.actionType.toUpperCase()} the booking?`}
                    modalBodyDetail={`Once ${operation.actionType}, it cant be change. So are you sure ?`}
                    buttonRight="Close"
                    buttonLeft="Submit"
                    onClick={onClick} />
            }
        </div>
    )
}


export default React.forwardRef(BookingAction)