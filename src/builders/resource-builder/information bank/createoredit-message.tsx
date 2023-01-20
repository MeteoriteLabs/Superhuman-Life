import React, { useContext, useImperativeHandle, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import {
  GET_TRIGGERS,
  ADD_MESSAGE,
  UPDATE_MESSAGE,
  GET_MESSAGE,
  DELETE_MESSAGE,
  UPDATE_STATUS,
} from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

import { flattenObj } from "../../../components/utils/responseFlatten";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "toggle-status" | "delete";
  current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const messageSchema: {
    [name: string]: any;
  } = require("./informationbank.json");
  const [messageDetails, setMessageDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [createMessage] = useMutation(ADD_MESSAGE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
    },
  });

  const [editMessage] = useMutation(UPDATE_MESSAGE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
    },
  });

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    refetchQueries: ["GET_TRIGGERS"],
  });

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      // render status modal for toggle-status operation
      if (msg.type === "toggle-status") {
        setShowStatusModal(true);
      }

      // render delete modal for delete operation
      if (msg.type === "delete") {
        setShowDeleteModal(true);
      }

      // restrict modal to render for delete and toggle-status operation
      if (msg.type !== "delete" && msg.type !== "toggle-status") {
        modalTrigger.next(true);
      }
    },
  }));

  function loadData(data: any) {
    const flattenData = flattenObj({ ...data });
    messageSchema["1"].properties.infomessagetype.enum = [
      ...flattenData.prerecordedtypes,
    ].map((n) => n.id);
    messageSchema["1"].properties.infomessagetype.enumNames = [
      ...flattenData.prerecordedtypes,
    ].map((n) => n.type);
  }

  function FillDetails(data: any) {
    const flattenData = flattenObj({ ...data });
    let details: any = {};
    let msg: any = flattenData.informationbankmessages[0];

    let o = { ...operation };
    details.name = o.type.toLowerCase();
    details.title = msg.title;
    details.infomessagetype = msg.resourcetype.id;
    details.description = msg.description;
    details.minidesc = msg.minidescription;
    details.mediaurl = msg.mediaurl;
    details.upload = msg.uploadID;
    details.tags = msg.tags;
    details.messageid = msg.id;

    setMessageDetails(details);
    setOperation({} as Operation);

    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  useQuery(GET_TRIGGERS, { onCompleted: loadData });
  useQuery(GET_MESSAGE, {
    variables: { id: operation.id },
    skip:
      !operation.id ||
      operation.type === "toggle-status" ||
      operation.type === "delete",
    onCompleted: (e: any) => {
      FillDetails(e);
    },
  });

  function CreateMessage(frm: any) {
    createMessage({ variables: frm });
  }

  function EditMessage(frm: any) {
    editMessage({ variables: frm });
  }

  function ToggleMessageStatus(id: string, current_status: boolean) {
    updateStatus({ variables: { status: !current_status, messageid: id } });
  }

  function DeleteMessage(id: any) {
    deleteMessage({ variables: { id: id } });
  }

  function OnSubmit(frm: any) {
    if (frm) frm.user_permissions_user = auth.userid;
    if (frm.name === "edit" || frm.name === "view") {
      if (frm.name === "edit") {
        EditMessage(frm);
      }
      if (frm.name === "view") {
        modalTrigger.next(false);
      }
    } else {
      CreateMessage(frm);
    }
  }

  return (
    <>
      <ModalView
        name={operation.type}
        isStepper={false}
        formUISchema={schema}
        formSchema={messageSchema}
        showing={operation.modal_status}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        formData={messageDetails}
        widgets={widgets}
        modalTrigger={modalTrigger}
      />

      {/* Status Modal */}
      {showStatusModal && (
        <StatusModal
          show={showStatusModal}
          onHide={() => setShowStatusModal(false)}
          modalTitle="Change Status"
          modalBody="Do you want to change the status?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            ToggleMessageStatus(operation.id, operation.current_status);
          }}
        />
      )}

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
    </>
  );
}

export default React.forwardRef(CreateEditMessage);
