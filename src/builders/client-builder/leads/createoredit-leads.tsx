import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_LEADS, DELETE_LEAD } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./schema";
//import {widgets} from "./schema"

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit" | "view" | "delete";
     current_status: boolean;
}

function CreateEditMessage(props: any, ref: any) {
     const auth = useContext(AuthContext);
     const messageSchema: { [name: string]: any } = require("./leads.json");
     //const uiSchema: {} = require("./schema.tsx");
     //const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createLeads] = useMutation(ADD_LEADS, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     // const [editMessage] = useMutation(UPDATE_MESSAGE,{variables: {messageid: operation.id}, onCompleted: (r: any) => { modalTrigger.next(false); } });
     const [deleteLeads] = useMutation(DELETE_LEAD, { onCompleted: (e: any) => console.log(e) });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) modalTrigger.next(true);
          },
     }));

     //  function loadData(data: any) {
     //       // messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
     //       // messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
     //       // messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
     //       // messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
     //  }

     //  function FillDetails(data: any) {
     //       let details: any = {};
     //       let msg = data.prerecordedmessage;
     //       console.log(msg);
     //       //debugger
     //       details.title = msg.title;
     //       details.prerecordedtype = msg.prerecordedtype.id;
     //       details.prerecordedtrigger = msg.prerecordedtrigger.id;
     //       details.description = msg.description;
     //       details.minidesc = msg.minidescription;
     //       details.mediaurl = msg.mediaurl;
     //       details.file = msg.mediaupload.id;
     //       details.status = msg.status;
     //       details.image = msg.upload;

     //       setMessageDetails(details);

     //       if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
     //       else OnSubmit(null);
     //  }

     function CreateMessage(frm: any) {
          console.log(frm);
          createLeads({ variables: { id: auth.userid, details: frm } });
          // createMessage({ variables: frm });
     }

     function EditMessage(frm: any) {
          // editMessage({variables: frm });
     }

     function ViewMessage(frm: any) {
          // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
     }

     function DeleteMessage(id: any) {
          console.log(id);
          deleteLeads({ variables: { id: id } });
     }

     function OnSubmit(frm: any) {
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

     let name = "";
     if (operation.type === "create") {
          name = "Lead";
     } else if (operation.type === "edit") {
          name = "Edit";
     } else if (operation.type === "view") {
          name = "View";
     }

     return (
          <>
               {operation.type === "create" && (
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
                         //formData={messageDetails}
                         //widgets={widgets}
                         modalTrigger={modalTrigger}
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
