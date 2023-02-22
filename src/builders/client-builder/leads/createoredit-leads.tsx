import React, {
  useContext,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import {
  ADD_LEADS_NEW,
  DELETE_LEAD_NEW,
  GET_LEADS_ID_NEW,
  UPDATE_LEADS_NEW,
  CREATE_NOTIFICATION,
} from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./schema";
import { flattenObj } from "../../../components/utils/responseFlatten";
import Toaster from "../../../components/Toaster";
import moment from "moment";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "delete";
  current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const messageSchema: { [name: string]: any } = require("./leads.json");
  const [messageDetails, setMessageDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLeadUpdated, setIsLeadUpdated] = useState<boolean>(false);
  const [isLeadCreated, setIsLeadCreated] = useState<boolean>(false);
  const [isLeadDeleted, setIsLeadDeleted] = useState<boolean>(false);
  const [name, setName] = useState("");

  const [createLeads] = useMutation(ADD_LEADS_NEW, {
    onCompleted: (data: any) => {
      const flattenData = flattenObj({ ...data });

      createLeadNotification({
        variables: {
          data: {
            type: "Users",
            Title: "New lead",
            OnClickRoute: "/clients",
            users_permissions_user: auth.userid,
            Body: `New lead ${flattenData.createWebsiteContactForm.Details.leadsdetails.name} has been added`,
            DateTime: moment().format(),
            IsRead: false,
            ContactID: flattenData.createWebsiteContactForm.id,
          },
        },
      });
      modalTrigger.next(false);
      props.callback();
      setIsLeadCreated(!isLeadCreated);
    },
  });

  const [editMessage]: any = useMutation(UPDATE_LEADS_NEW, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsLeadUpdated(!isLeadUpdated);
    },
  });

  const [deleteLeads] = useMutation(DELETE_LEAD_NEW, {
    onCompleted: (e: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsLeadDeleted(!isLeadDeleted);
    },
  });

  const [createLeadNotification] = useMutation(CREATE_NOTIFICATION);

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

  useQuery(GET_LEADS_ID_NEW, {
    variables: { id: operation.id },
    skip: !operation.id || operation.type === "delete",
    onCompleted: (e: any) => {
      FillDetails(e);
    },
  });

  function FillDetails(data: any) {
    const flattenData = flattenObj({ ...data });
    let detail: any = { leadsdetails: {} };
    let msg: any = flattenData.websiteContactForms[0];

    let o = { ...operation };
    detail.name = o.type.toLowerCase();
    detail.status = msg.Details.status;
    detail.source = msg.Details.source;
    detail.notes = msg.Details.notes;
    detail.leadsdetails.email = msg.Details?.leadsdetails.email;
    detail.leadsdetails.name = msg.Details?.leadsdetails.name;
    detail.leadsdetails.phonenumber = msg.Details?.leadsdetails.phonenumber;
    detail.leadsdetails.leadsmesssage = msg.Details?.leadsdetails.leadsmesssage;
    detail.messageid = msg.id;

    setMessageDetails(detail);
    setOperation({} as Operation);

    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  function CreateMessage(frm: any) {
    createLeads({
      variables: { id: auth.userid, details: frm },
    });
  }

  function EditMessage(frm: any) {
    editMessage({
      variables: { id: auth.userid, details: frm, messageid: frm.messageid },
    });
  }

  function DeleteMessage(id: any) {
    deleteLeads({ variables: { id: id } });
  }

  function OnSubmit(frm: any) {
    if (frm) frm.user_permissions_user = auth.userid;
    if (frm.name === "edit" || frm.name === "view") {
      if (frm.name === "edit") {
        EditMessage(frm);
      }
    } else {
      CreateMessage(frm);
    }
  }

  useEffect(() => {
    if (operation.type === "create") {
      setName("Create New Lead");
    } else if (operation.type === "edit") {
      setName("Edit lead");
    } else if (operation.type === "view") {
      setName("View Lead");
    }
  }, [operation.type]);

  return (
    <>
      {/* Create , Edit and View Modal */}
      <ModalView
        name={name}
        isStepper={false}
        formUISchema={schema}
        formSchema={messageSchema}
        showing={operation.modal_status}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        formData={operation.type === "create" ? {} : messageDetails}
        modalTrigger={modalTrigger}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <StatusModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          modalTitle="Delete"
          modalBody="Do you want to delete this message?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            DeleteMessage(operation.id);
          }}
        />
      )}

      {isLeadCreated ? (
        <Toaster
          handleCallback={() => setIsLeadCreated(!isLeadCreated)}
          type="success"
          msg="New lead detail has been created"
        />
      ) : null}

      {isLeadUpdated ? (
        <Toaster
          handleCallback={() => setIsLeadUpdated(!isLeadUpdated)}
          type="success"
          msg="Lead detail has been updated"
        />
      ) : null}

      {isLeadDeleted ? (
        <Toaster
          handleCallback={() => setIsLeadDeleted(!isLeadDeleted)}
          type="success"
          msg="Lead detail has been deleted"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateEditMessage);
