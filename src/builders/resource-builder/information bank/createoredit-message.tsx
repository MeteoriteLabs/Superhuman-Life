import React, { useContext, useImperativeHandle, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { GET_TRIGGERS, ADD_MESSAGE, UPDATE_MESSAGE, GET_MESSAGE, DELETE_MESSAGE, UPDATE_STATUS } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit" | "view" | "toggle-status" | "delete";
     current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
     const auth = useContext(AuthContext);
     const messageSchema: { [name: string]: any } = require("./informationbank.json");
     //const uiSchema: {} = require("./schema.json");
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createMessage] = useMutation(ADD_MESSAGE, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [editMessage] = useMutation(UPDATE_MESSAGE, {
          variables: { messageid: operation.id },
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [deleteMessage] = useMutation(DELETE_MESSAGE, {
          onCompleted: (e: any) => console.log(e),
          refetchQueries: ["GET_TRIGGERS"],
     });
     const [updateStatus] = useMutation(UPDATE_STATUS, {
          onCompleted: (d: any) => {
               console.log(d);
          },
     });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) modalTrigger.next(true);
          },
     }));

     function loadData(data: any) {
          messageSchema["1"].properties.infomessagetype.enum = [...data.informationbankmessagestypes].map((n) => n.id);
          messageSchema["1"].properties.infomessagetype.enumNames = [...data.informationbankmessagestypes].map(
               (n) => n.type
          );
     }

     function FillDetails(data: any) {
          let details: any = {};
          let msg = data.informationbankmessages;
          details.title = msg.title;
          details.infomessagetype = msg.infomessagetype.id;
          details.description = msg.description;
          details.minidesc = msg.minidescription;
          details.mediaurl = msg.mediaurl;
          details.file = msg.mediaupload.id;
          details.status = msg.status;
          setMessageDetails(details);

          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     function FetchData() {
          useQuery(GET_TRIGGERS, { onCompleted: loadData });
          useQuery(GET_MESSAGE, {
               variables: { id: operation.id },
               skip: !operation.id || operation.type === "toggle-status",
               onCompleted: (e: any) => {
                    FillDetails(e);
               },
          });
     }

     function CreateMessage(frm: any) {
          createMessage({ variables: frm });
     }

     function EditMessage(frm: any) {
          editMessage({ variables: frm });
     }

     function ViewMessage(frm: any) {
          useMutation(UPDATE_MESSAGE, {
               variables: frm,
               onCompleted: (d: any) => {
                    console.log(d);
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

          switch (operation.type) {
               case "create":
                    CreateMessage(frm);
                    break;
               case "edit":
                    EditMessage(frm);
                    break;
               case "view":
                    ViewMessage(frm);
                    break;
          }
     }

     FetchData();

     let name = "";
     if (operation.type === "create") {
          name = "Create New";
     } else if (operation.type === "edit") {
          name = "Edit";
     } else if (operation.type === "view") {
          name = "View";
     }

     return (
          <>
               <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={schema}
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
