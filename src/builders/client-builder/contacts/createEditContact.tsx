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
  UPDATE_CONTACT
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

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "delete";
  current_status: boolean;
}

function CreateEditContact(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const contactSchema: { [name: string]: any } = require("./contact.json");
  const [contactDetails, setContactDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [modalLabel, setModalLabel] = useState<string>("");
  let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [createContact] = useMutation(ADD_CONTACT, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsFormSubmitted(!isFormSubmitted);
    },
  });

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
    }
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: (e: any) => {
      modalTrigger.next(false);
      props.callback();
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

    let detail: any = {};

    detail.id = flattenData && flattenData.id;
    detail.firstname = flattenData && flattenData.firstname;
    detail.lastname = flattenData && flattenData.lastname;
    detail.email = flattenData && flattenData.email;
    detail.phone = flattenData && flattenData.phone;
    detail.appDownloadStatus = flattenData && flattenData.appDownloadStatus === "Invited" ? true : false;
    detail.type = flattenData && flattenData.type;
    detail.isPayee = flattenData && flattenData.isPayee;
    detail.organisationDetails = flattenData && flattenData.organisationDetails && flattenData.organisationDetails ? true : false;
    detail.organisationName = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.organisationName;
    detail.gst = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.gst;
    detail.address1 = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.address1;
    detail.address2 = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.address2;
    detail.city = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.city;
    detail.state = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.state;
    detail.country = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.country;
    detail.zipcode = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.zipcode;
    detail.organisationEmail = flattenData && flattenData.organisationDetails && flattenData.organisationDetails.organisationEmail;

    setContactDetails(detail);

    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
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
     console.log(frm);
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
            organisationEmail: frm.organisationEmail,
            organisationName: frm.organisationName,
            gst: frm.gst,
            state: frm.state,
            zipcode: frm.zipcode,
            city: frm.city,
            country: frm.country,
            address1: frm.address1,
            address2: frm.address2,
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
    } else {
      CreateContact(frm);
    }
  }

  useEffect(() => {
    if (operation.type === "create") {
      setModalLabel("Create contact");
    } else if (operation.type === "edit") {
      setModalLabel("Edit contact");
    } else if (operation.type === "view") {
      setModalLabel("View");
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
        formSubmit={(frm: any, id: string) => {
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
      {isFormSubmitted ? (
        <Toaster
          handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
          type="success"
          msg="Contact has been created"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateEditContact);
