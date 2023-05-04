import { useMutation, useQuery } from "@apollo/client";
import React, { useImperativeHandle, useState, useContext } from "react";
import StatusModal from "../../../components/StatusModal/StatusModal";
import {
  CREATE_USER_PACKAGE,
  UPDATE_BOOKING_STATUS,
  UPDATE_TAG,
  CREATE_TAG,
} from "../GraphQL/mutation";
import { GET_TAGS } from "../GraphQL/queries";
import authContext from "../../../context/auth-context";
import { Subject } from "rxjs";
import { flattenObj } from "../../../components/utils/responseFlatten";

interface Operation {
  id: string;
  type: string;
  actionType: "manage" | "view" | "request" | "accept" | "reject";
  formData: any;
}

const BookingAction = (props:{refetchBookings: () => void;}, ref: any) => {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const modalTrigger = new Subject();
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const auth = useContext(authContext);
  const [tagsDetails, setTagsDetails] = useState<any>([]);

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: any) => {
      modalTrigger.next(true);
      setOperation(msg);
      if (msg.actionType === "accept" || msg.actionType === "reject") {
        setShowStatusModal(true);
      }
    },
  }));

  // eslint-disable-next-line
  const { data: get_tags } = useQuery(GET_TAGS, {
    variables: {
      id: auth.userid,
    },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setTagsDetails(flattenData.tags);
    },
  });

  const [updateTag] = useMutation(UPDATE_TAG);
  const [createTag] = useMutation(CREATE_TAG);

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
        onCompleted: (data) => {
          const flattenData = flattenObj({ ...data });

          if (
            operation.type === "On-Demand PT" ||
            operation.type === "One-On-One" ||
            operation.type === "Custom Fitness"
          ) {
            createTag({
              variables: {
                name: `${flattenData?.createClientPackage.users_permissions_user?.username}_${flattenData?.createClientPackage.fitnesspackages[0]?.packagename}`,
                fitnessPackageID:
                  flattenData?.createClientPackage.fitnesspackages[0]?.id,
              },
            });
          } else {
            const tag =
              tagsDetails &&
              tagsDetails.length &&
              tagsDetails.filter(
                (currentValue) =>
                  currentValue.fitnesspackage.packagename ===
                  flattenData.createClientPackage.fitnesspackages[0].packagename
              );

            for (let i = 0; i < tag.length; i++) {
              updateTag({
                variables: {
                  id: tag[i].id,
                  data: {
                    client_packages: [flattenData.createClientPackage.id],
                  },
                },
              });
            }
          }
        },
      });
      props.refetchBookings();
    },
  });

  const [createUserPackage] = useMutation(CREATE_USER_PACKAGE, {
    onCompleted: (data) => {
      props.refetchBookings();
    },
  });

  const statusChangeHandler = () => {
    const updateValue = {
      id: operation.id,
      Booking_status:
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
