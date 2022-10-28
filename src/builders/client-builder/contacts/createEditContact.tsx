import React, {
  useEffect,
  useImperativeHandle,
  useState,
  useContext,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  GET_CONTACT,
  UPDATE_CONTACT,
  GET_CONTACTS
} from "./queries";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./contactsSchema";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import {
  phoneCustomFormats,
  phoneTransformErrors,
} from "../../../components/utils/ValidationPatterns";
import Toaster from "../../../components/Toaster";
import { PaymentDetails } from "./PaymentDetailsInterface";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "delete";
  current_status: boolean;
}

function CreateEditContact(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const contactSchema: {} = require("./contact.json");
  const [contactDetails, setContactDetails] = useState({} as PaymentDetails);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [modalLabel, setModalLabel] = useState<string>("");
  let [isCreated, setIsCreated] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const [createContact] = useMutation(ADD_CONTACT, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsCreated(!isCreated);
    },
  });

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsUpdated(!isUpdated);
    }, refetchQueries: [GET_CONTACT]
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: (e: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsDeleted(!isDeleted);
    },
  });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      // set show delete modal to render for delete operation
      if (msg.type === "delete") {
        setShowDeleteModal(true);
      }

      // restrict create modal to render for delete operation
      if (msg.type !== "delete") {
        modalTrigger.next(true);
      }
    },
  }));

  useQuery(GET_CONTACT, {
    variables: { id: operation.id },
    skip: !operation.id || operation.type === "delete",
    onCompleted: (e: any) => {
      FillDetails(e.contact);
    },
  });

  function FillDetails(data: any) {
    const flattenData = flattenObj({ ...data });

    let detail = {} as PaymentDetails;

    if (flattenData) {
      detail.id = flattenData.id;
      detail.firstname = flattenData.firstname;
      detail.lastname = flattenData.lastname;
      detail.email = flattenData.email;
      detail.phone = flattenData.phone;
      detail.appDownloadStatus = flattenData.appDownloadStatus === "Invited" ? true : false;
      detail.type = flattenData.type;
      detail.isPayee = flattenData.isPayee;
      if (flattenData.organisationDetails) {
        detail.organisationDetails = flattenData.organisationDetails.organisationName ? true : false;
        detail.organisationName = flattenData.organisationDetails.organisationName;
        detail.gst = flattenData.organisationDetails.gst;
        detail.address1 = flattenData.organisationDetails.address1 ? flattenData.organisationDetails.address1 : "";
        detail.address2 = flattenData.organisationDetails.address2 ? flattenData.organisationDetails.address2 : "";
        detail.city = flattenData.organisationDetails.city ? flattenData.organisationDetails.city : "";
        detail.state = flattenData.organisationDetails.state ? flattenData.organisationDetails.state : "";
        detail.country = flattenData.organisationDetails.country ? flattenData.organisationDetails.country : "";
        detail.zipcode = flattenData.organisationDetails.zipcode ? flattenData.organisationDetails.zipcode : "";
        detail.organisationEmail = flattenData.organisationDetails.organisationEmail;
      }
    }

    setContactDetails(detail);
  }

  function CreateContact(frm: any) {
    createContact({
      variables: {
        data: {
          firstname: frm.firstname ? frm.firstname : null,
          lastname: frm.lastname ? frm.lastname : null,
          email: frm.email ? frm.email : null,
          phone: frm.phone ? frm.phone : null,
          type: frm.type ? frm.type : null,
          appDownloadStatus: frm.appDownloadStatus ? "Invited" : "NotInvited",
          isPayee: frm.isPayee,
          ownedBy: auth.userid,
          organisationDetails: {
            organisationEmail: frm.organisationEmail
              ? frm.organisationEmail
              : null,
            organisationName: frm.organisationName
              ? frm.organisationName
              : null,
            gst: frm.gst ? frm.gst : null,
            state: frm.state ? frm.state : null,
            zipcode: frm.zipcode ? frm.zipcode : null,
            city: frm.city ? frm.city : null,
            country: frm.country ? frm.country : null,
            address1: frm.address1 ? frm.address1 : null,
            address2: frm.address2 ? frm.address2 : null,
          },
        },
      },
    });
  }

  function EditContact(frm: any) {
    updateContact({
      variables: {
        id: Number(operation.id),
        data: {
          firstname: frm.firstname ? frm.firstname : null,
          lastname: frm.lastname ? frm.lastname : null,
          email: frm.email ? frm.email : null,
          phone: frm.phone ? frm.phone : null,
          type: frm.type ? frm.type : null,
          appDownloadStatus: frm.appDownloadStatus ? "Invited" : "NotInvited",
          isPayee: frm.isPayee,
          organisationDetails: {
            organisationEmail: frm.organisationDetails
              ? frm.organisationEmail
              : null,
            organisationName: frm.organisationDetails
              ? frm.organisationName
              : null,
            gst: frm.organisationDetails ? frm.gst : null,
            state: frm.organisationDetails ? frm.state : null,
            zipcode: frm.organisationDetails ? frm.zipcode : null,
            city: frm.organisationDetails ? frm.city : null,
            country: frm.organisationDetails ? frm.country : null,
            address1: frm.organisationDetails ? frm.address1 : null,
            address2: frm.organisationDetails ? frm.address2 : null,
          },
        },
      },
    });
  }

  function DeleteContact(id: any) {
    deleteContact({
      variables: {
        id,
      },
    });
  }

  function OnSubmit(frm: any) {
    if (modalLabel === "Edit contact") {
      EditContact(frm);
    } else if (modalLabel === "Create contact") {
      CreateContact(frm);
    }
  }

  useEffect(() => {
    if (operation.type === "create") {
      setModalLabel("Create contact");
    } else if (operation.type === "edit") {
      setModalLabel("Edit contact");
    } else if (operation.type === "view") {
      setModalLabel("View contact");
    }
  }, [operation]);

  return (
    <>
      {/* Create , Edit and View Modal */}
      <ModalView
        name={modalLabel}
        isStepper={true}
        showErrorList={false}
        formUISchema={schema}
        formSchema={contactSchema}
        showing={operation.modal_status}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        stepperValues={["Basic Contact Details", "Organisation Settings"]}
        formData={operation.type === "create" ? {} : contactDetails}
        modalTrigger={modalTrigger}
        actionType={operation.type}
        customFormats={phoneCustomFormats}
        transformErrors={phoneTransformErrors}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <StatusModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          modalTitle="Delete"
          modalBody="Do you want to delete this contact?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            DeleteContact(operation.id);
          }}
        />
      )}

      {/* success toaster notification */}
      {isCreated && (
        <Toaster
          handleCallback={() => setIsCreated(!isCreated)}
          type="success"
          msg="Contact has been created successfully"
        />
      )}
      {isUpdated && (
        <Toaster
          handleCallback={() => setIsUpdated(!isUpdated)}
          type="success"
          msg="Contact has been updated successfully"
        />
      )}
      {isDeleted && (
        <Toaster
          handleCallback={() => setIsDeleted(!isDeleted)}
          type="success"
          msg="Contact has been deleted successfully"
        />
      )}
    </>
  );
}

export default React.forwardRef(CreateEditContact);
