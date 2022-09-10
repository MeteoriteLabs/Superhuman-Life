import React, { useContext, useImperativeHandle, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRIGGERS, ADD_MESSAGE, UPDATE_MESSAGE, GET_MESSAGE, DELETE_MESSAGE, UPDATE_STATUS } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./schema";
import { schemaView } from './notificationViewSchema';
import ModalView from "../../../components/modal";
import { flattenObj } from '../../../components/utils/responseFlatten';

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit" | "view" | "toggle-status" | "delete";
     current_status: boolean;
}
const notificationEmptyState = {
     title: '',
     prerecordedtype: '',
     prerecordedtrigger: '',
     description: '',
     minidesc: '',
     mediaurl: ''
}

function CreateEditMessage(props: any, ref: any) {
     const auth = useContext(AuthContext);
     const messageSchema: { [name: string]: any } = require("./message.json");
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createMessage] = useMutation(ADD_MESSAGE, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [editMessage] = useMutation(UPDATE_MESSAGE, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [deleteMessage] = useMutation(DELETE_MESSAGE, {
          refetchQueries: ["GET_TRIGGERS"],
          onCompleted: (e: any) => {
               props.callback();
               modalTrigger.next(false);
          }
     });

     const [updateStatus] = useMutation(UPDATE_STATUS, {
          onCompleted: (e: any) => {
               props.callback();
               modalTrigger.next(false);
          }
     });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);
               
               if (msg.type !== 'delete' && msg.type !== 'toggle-status') {
                    modalTrigger.next(true);
               }
          },
     }));

     function loadData(data: any) {
          const flattenData = flattenObj({ ...data });

          messageSchema["1"].properties.prerecordedtype.enum = [...flattenData.prerecordedtypes].map((n) => n.id);
          messageSchema["1"].properties.prerecordedtype.enumNames = [...flattenData.prerecordedtypes].map((n) => n.name);
          messageSchema["1"].properties.prerecordedtrigger.enum = [...flattenData.prerecordedtriggers].map((n) => n.id);
          messageSchema["1"].properties.prerecordedtrigger.enumNames = [...flattenData.prerecordedtriggers].map((n) => n.name);
     }

     function FillDetails(data: any) {
          let details: any = {};
          const flattenData = flattenObj({ ...data });
          let msg = flattenData.notifications[0];
          
          let o = { ...operation };
          details.name = o.type.toLowerCase();
          details.title = msg.title;
          details.prerecordedtype = msg.prerecordedtype?.id;
          details.prerecordedtrigger = msg.prerecordedtrigger?.id;
          details.description = msg.description;
          details.minidesc = msg.minidescription;
          details.mediaurl = msg.mediaurl;
          details.messageid = msg.id;

          setMessageDetails(details);
          setOperation({} as Operation);

          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     useQuery(GET_TRIGGERS, { onCompleted: loadData });

     useQuery(GET_MESSAGE, {
          variables: { id: operation.id },
          skip: !operation.id || operation.type === "toggle-status" || operation.type === "delete",
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

     let name="";
          if (operation.type === 'create') {
               name = "Create New Message";
          } else if (operation.type === 'edit') {
               name = "Edit";
          } else if (operation.type === 'view') {
               name = "View";
          }
     
     return (
          <>
               <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={operation.type === 'view' ? schemaView : schema}
                    formSchema={messageSchema}
                    showing={operation.modal_status}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={operation.type === 'create' ? notificationEmptyState : messageDetails}
                    modalTrigger={modalTrigger}
               />
               
               {operation.type === "toggle-status" && (
                    <StatusModal
                         modalTitle="Change Status"
                         modalBody="Do you want to change the status?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {
                              ToggleMessageStatus(operation.id, operation.current_status);
                         }}
                    />
               )}

               {operation.type === "delete" && (
                    <StatusModal
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
