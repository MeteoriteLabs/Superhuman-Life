import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import { schemaView } from "./messageViewSchema";
import Toaster from "../../../components/Toaster";
import { flattenObj } from "../../../components/utils/responseFlatten";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "toggle-status" | "delete";
  current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const messageSchema: { [name: string]: any } = require("./mindset.json");
  const [messageDetails, setMessageDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [name, setName] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMessageCreated, setIsMessageCreated] = useState<boolean>(false);
  const [isMessageDeleted, setIsMessageDeleted] = useState<boolean>(false);
  const [isMessageUpdated, setIsMessageUpdated] = useState<boolean>(false);

  const [createMessage] = useMutation(ADD_MESSAGE, {
    onCompleted: (r: any) => {
      setIsMessageCreated(!isMessageCreated);
      modalTrigger.next(false);
      props.callback();
    },
  });

  const [editMessage] = useMutation(UPDATE_MESSAGE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsMessageUpdated(true);
    },
  });

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    onCompleted: (e: any) => {
      props.callback();
      setIsMessageDeleted(true);
    },
    refetchQueries: ["GET_TRIGGERS"],
  });

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: (d: any) => {
      props.callback();
    },
  });

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

    messageSchema["1"].properties.mindsetmessagetype.enum = [
      ...flattenData.prerecordedtypes,
    ].map((n) => n.id);
    messageSchema["1"].properties.mindsetmessagetype.enumNames = [
      ...flattenData.prerecordedtypes,
    ].map((n) => n.name);
  }

  function FillDetails(data: any) {
    const flattenData = flattenObj({ ...data });

    const details: any = {};
    const msg = flattenData.prerecordedMessage;

    function handleAddMediaShowUp(msg: any) {
      if (msg.Image_URL !== null) {
        return { AddMedia: "Add URL", mediaurl: msg.Image_URL };
      } else if (msg?.uploadID !== null) {
        return { AddMedia: "Upload", upload: msg.uploadID };
      }
    }

    const o = { ...operation };
    details.name = o.type.toLowerCase();

    details.title = msg.Title;
    details.mindsetmessagetype = msg.resourcetype?.id;
    details.description = msg.Description ? msg.Description : " ";
    details.minidesc = msg.minidescription;
    details.tags = msg.tags;
    details.addMedia = handleAddMediaShowUp(msg);
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
    createMessage({
      variables: {
        data: {
          Title: frm.title,
          tags: frm.tags,
          resourcetype: frm.mindsetmessagetype,
          Description: frm.description,
          minidescription: frm.minidesc,
          Image_URL: frm.addMedia.mediaurl,
          users_permissions_user: frm.user_permissions_user,
          uploadID: frm.addMedia.upload,
        },
      },
      onCompleted: () => {
        setIsMessageCreated(!isMessageCreated);
      },
    });
  }

  function EditMessage(frm: any) {
    editMessage({
      variables: {
        id: frm.messageid,
        data: {
          Title: frm.title,
          Description: frm.description,
          minidescription: frm.minidesc,
          Image_URL: frm.addMedia.mediaurl,
          tags: frm.tags,
          resourcetype: frm.mindsetmessagetype,
          users_permissions_user: frm.user_permissions_user,
          uploadID: frm.addMedia.upload,
        },
      },
    });
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

  useEffect(() => {
    if (operation.type === "create") {
      setMessageDetails({});
      setName("Create New Message");
    } else if (operation.type === "edit") {
      setName("Edit");
    } else if (operation.type === "view") {
      setName("View");
    }
  }, [operation.type]);

  return (
    <>
      {/* Create, Edit , View Modal */}
      <ModalView
        name={name}
        isStepper={false}
        showErrorList={false}
        formUISchema={name === "View" ? schemaView : schema}
        formSchema={messageSchema}
        showing={operation.modal_status}
        formSubmit={
          name === "View"
            ? () => {
                modalTrigger.next(false);
              }
            : (frm: any) => {
                OnSubmit(frm);
              }
        }
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

      {/* toaster notifications */}
      {isMessageCreated ? (
        <Toaster
          handleCallback={() => setIsMessageCreated(!isMessageCreated)}
          type="success"
          msg="New message has been created"
        />
      ) : null}

      {isMessageUpdated ? (
        <Toaster
          handleCallback={() => setIsMessageUpdated(!isMessageUpdated)}
          type="success"
          msg="Message has been updated"
        />
      ) : null}

      {isMessageDeleted ? (
        <Toaster
          handleCallback={() => setIsMessageDeleted(!isMessageDeleted)}
          type="success"
          msg="Message has been deleted"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateEditMessage);
