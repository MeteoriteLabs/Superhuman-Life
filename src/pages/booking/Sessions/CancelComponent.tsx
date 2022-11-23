import React, { useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_STATUS } from "./queries";
import StatusModal from "../../../components/StatusModal/StatusModal";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "reschedule" | "cancel";
  current_status: boolean;
}

function CancelComponent(props: any, ref: any) {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: (d: any) => {
      props.callback();
    },
  });

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      // render delete modal for delete operation
      if (msg.type === "cancel") {
        setShowCancelModal(true);
      }
    },
  }));

  const CancelStatus = (id: string) => {
    updateStatus({
      variables: { id: id, data: { Session_booking_status: "Canceled" } },
    });
  };

  return (
    <>
      {/* Cancel Modal */}
      {showCancelModal && (
        <StatusModal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          modalTitle="Cancel Booking"
          modalBody="Are you sure you want to cancel the booking?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            CancelStatus(operation.id);
          }}
        />
      )}
    </>
  );
}

export default React.forwardRef(CancelComponent);
