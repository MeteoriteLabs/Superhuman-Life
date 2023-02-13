import { useMutation } from "@apollo/client";
import React, { useImperativeHandle, useState } from "react";
import StatusModal from "../../../components/StatusModal/StatusModal";
import {
  CREATE_USER_PACKAGE,
  UPDATE_BOOKING_STATUS,
} from "../GraphQL/mutation";
import { Subject } from "rxjs";

interface Operation {
  id: string;
  actionType: "manage" | "view" | "request" | "accept" | "reject";
  formData: any;
}

function BookingAction(props, ref: any) {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const modalTrigger = new Subject();
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: any) => {
      modalTrigger.next(true);
      setOperation(msg);
      if (msg.actionType === "accept" || msg.actionType === "reject") {
        setShowStatusModal(true);
      }
    },
  }));

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: (data) => {
      createUserPackage({
        variables: {
          data: {
            users_permissions_user:
              data.updateClientBooking.data.attributes.users_permissions_users.data
                .map((curr) => curr.id)
                .toString(),
            fitnesspackages:
              data.updateClientBooking.data.attributes.fitnesspackages.data.map(
                (item) => item.id
              ),
            accepted_date:
              data.updateClientBooking.data.attributes.booking_date,
            package_duration:
              data.updateClientBooking.data.attributes.package_duration,
            effective_date:
              data.updateClientBooking.data.attributes.effective_date,
          },
        },
      });
      props.refetchBookings();
    },
  });

  const [createUserPackage] = useMutation(CREATE_USER_PACKAGE, {
    onCompleted: () => {
      props.refetchBookings();
    },
  });

  const statusChangeHandler = () => {
    const updateValue = {
      id: operation.id,
      booking_status:
        operation.actionType === "accept" ? "accepted" : "rejected",
    };

    updateBookingStatus({
      variables: updateValue,
    });
  };

  return (
    <div>
      {showStatusModal && (
        <StatusModal
          show={showStatusModal}
          onHide={() => setShowStatusModal(false)}
          modalTitle="Change Status"
          modalBody={`Are you sure you want to ${operation.actionType.toUpperCase()} the booking? Once ${
            operation.actionType
          }, it cant be change. So are you sure ?`}
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={statusChangeHandler}
        />
      )}
    </div>
  );
}

export default React.forwardRef(BookingAction);
