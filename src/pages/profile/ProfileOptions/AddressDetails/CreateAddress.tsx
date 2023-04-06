import React, {
  useImperativeHandle,
  useState,
  useContext,
  useEffect,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {
  FETCH_USER_PROFILE_DATA,
  UPDATE_ADDRESS_DATA,
  UPDATE_USER_PROFILE_DATA,
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  FETCH_USERS_PROFILE_DATA,
} from "../../queries/queries";
import { Subject } from "rxjs";
import { schema, widgets } from "../../profileSchema";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import StatusModal from "../../../../components/StatusModal/StatusModal";
import {
  zipcodeCustomFormats,
  zipcodeTransformErrors,
} from "../../../../components/utils/ValidationPatterns";
import Toaster from "../../../../components/Toaster/index";

export interface BasicAddressDetails {
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  type_address: string;
  House_Number: string;
  Title: string;
}

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "delete";
}

function CreateAddress(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const addressJson: {} = require("./Address.json");
  const [addressData, setAddressData] = useState<any>([]);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [addressDetails, setAddressDetails] = useState(
    {} as BasicAddressDetails
  );
  const [prefill, setPrefill] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  let [isAddressDeleted, setIsAddressDeleted] = useState<boolean>(false);
  let [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false);

  const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      const flattenData = flattenObj({ ...r });
      const addressIds =
        flattenData.usersPermissionsUser.addresses &&
        flattenData.usersPermissionsUser.addresses?.length
          ? flattenData.usersPermissionsUser.addresses.map(
              (currentValue: any) => currentValue.id
            )
          : null;
      setAddressData(addressIds);
      closeForm();
      setPrefill(flattenData.usersPermissionsUser.addresses);
    },
  });

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => {
      props.callback();
      fetch.refetch();
    },
    refetchQueries: [FETCH_USERS_PROFILE_DATA],
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
    onCompleted: (r: any) => {
      props.callback();
      modalTrigger.next(false);
      fetch.refetch();
      setIsAddressUpdated(!isAddressUpdated);
    },
    refetchQueries: [FETCH_USERS_PROFILE_DATA],
  });

  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: (data: any) => {
      fetch.refetch();
      setIsAddressDeleted(!isAddressDeleted);
    },
    refetchQueries: [FETCH_USERS_PROFILE_DATA],
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: (r: any) => {
      setIsFormSubmitted(!isFormSubmitted);
      modalTrigger.next(false);
      fetch.refetch();

      // concatenate previously stored address ids with currently added address id
      let contatenatedAddressIdArray =
        addressData && addressData.length
          ? addressData.concat([r.createAddress.data.id])
          : [r.createAddress.data.id];

      updateProfile({
        variables: {
          id: auth.userid,
          data: {
            addresses: contatenatedAddressIdArray,
          },
        },
      });
    },
  });

  // modal trigger
  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      //show delete modal
      if (msg.type === "delete") {
        setShowDeleteModal(true);
      }

      //restrict form to render on delete
      if (msg.type !== "delete") {
        modalTrigger.next(true);
      }
    },
  }));

  useEffect(() => {
    let selectedAddress =
      prefill && prefill.length
        ? prefill.find((currValue: any) => currValue.id === operation.id)
        : null;

    let details = {} as BasicAddressDetails;
    details.address1 = selectedAddress ? selectedAddress.address1 : "";
    details.address2 = selectedAddress ? selectedAddress.address2 : "";
    details.city = selectedAddress ? selectedAddress.city : "";
    details.country = selectedAddress ? selectedAddress.country : "";
    details.state = selectedAddress ? selectedAddress.state : "";
    details.zipcode = selectedAddress ? selectedAddress.zipcode : "";
    details.type_address = selectedAddress ? selectedAddress.type_address : "";
    details.House_Number = selectedAddress ? selectedAddress.House_Number : "";
    details.Title = selectedAddress ? selectedAddress.Title : "";

    setAddressDetails(details);
  }, [operation.id, prefill]);

  //close form on update
  function closeForm() {
    if (["edit"].indexOf(operation.type) > -1) modalTrigger.next(false);
  }

  // create address function
  function CreateUserAddress(frm: any) {
    createAddress({
      variables: {
        data: {
          address1: frm.address1,
          address2: frm.address2,
          city: frm.city,
          country: frm.country,
          state: frm.state,
          zipcode: frm.zipcode,
          type_address: frm.type_address,
          House_Number: frm.House_Number,
          Title: frm.Title,
        },
      },
    });
  }

  // update address function
  function UpdateUserAddress(frm: any) {
    updateAddress({
      variables: {
        id: operation.id,
        data: {
          address1: frm.address1,
          address2: frm.address2 ? frm.address2 : null,
          city: frm.city,
          country: frm.country,
          state: frm.state,
          zipcode: frm.zipcode,
          type_address: frm.type_address,
          House_Number: frm.House_Number,
          Title: frm.Title,
        },
      },
    });
  }

  function DeleteAddress(id: any) {
    deleteAddress({ variables: { id: id } });
  }

  // submit function
  function OnSubmit(frm: any) {
    switch (operation.type) {
      case "create":
        CreateUserAddress(frm);
        break;
      case "edit":
        UpdateUserAddress(frm);
        break;
    }
  }

  return (
    <>
      {/* Create and Edit Modal */}
      <ModalView
        name={
          operation.type === "create"
            ? "Create New Address"
            : "Edit Address Details"
        }
        isStepper={false}
        formUISchema={schema}
        formSchema={addressJson}
        showing={operation.modal_status}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        widgets={widgets}
        modalTrigger={modalTrigger}
        formData={operation.type === "create" ? {} : addressDetails}
        showErrorList={false}
        customFormats={zipcodeCustomFormats}
        transformErrors={zipcodeTransformErrors}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <StatusModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          modalTitle="Delete"
          modalBody="Do you want to delete this address detail?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            DeleteAddress(operation.id);
          }}
        />
      )}

      {/* success toaster notification */}
      {isFormSubmitted ? (
        <Toaster
          handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
          type="success"
          msg="Address has been added successfully"
        />
      ) : null}

      {isAddressDeleted ? (
        <Toaster
          handleCallback={() => setIsAddressDeleted(!isAddressDeleted)}
          type="success"
          msg="Address has been deleted successfully"
        />
      ) : null}

      {isAddressUpdated ? (
        <Toaster
          handleCallback={() => setIsAddressUpdated(!isAddressUpdated)}
          type="success"
          msg="Address has been updated successfully"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateAddress);
