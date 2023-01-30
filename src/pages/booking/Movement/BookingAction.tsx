import { useMutation } from "@apollo/client";
import React, { useImperativeHandle, useState } from "react";
import AcceptRejectModal from "../../../components/AcceptRejectModal/AcceptRejectModal";
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

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: any) => {
      modalTrigger.next(true);
      setOperation(msg);
    },
  }));

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: (data) => {

      createUserPackage({
        variables: {data: {
          users_permissions_user:
          data.updateClientBooking.data.attributes.users_permissions_users.data.map(curr => curr.id).toString(),
        fitnesspackages: data.updateClientBooking.data.attributes.fitnesspackages.data.map(
          (item) => item.id
        ),
        accepted_date: data.updateClientBooking.data.attributes.booking_date,
        package_duration: data.updateClientBooking.data.attributes.package_duration,
        effective_date: data.updateClientBooking.data.attributes.effective_date,
        }},
      });
    },
  });

  const [createUserPackage] = useMutation(CREATE_USER_PACKAGE);

  const onClick = () => {
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
      {(operation.actionType === "accept" ||
        operation.actionType === "reject") && (
        <AcceptRejectModal
          modalTitle="Change Status"
          modalBody={`Are you sure you want to ${operation.actionType.toUpperCase()} the booking?`}
          modalBodyDetail={`Once ${operation.actionType}, it cant be change. So are you sure ?`}
          buttonRight="Close"
          buttonLeft="Submit"
          onClick={onClick}
          modalTrigger={modalTrigger}
        />
      )}
    </div>
  );
}

export default React.forwardRef(BookingAction);
