import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_LEADS, DELETE_LEAD, GET_LEADS_ID, UPDATE_LEADS, UPDATE_SEEN } from "./queries";
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
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createLeads] = useMutation(ADD_LEADS, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [editMessage]: any = useMutation(UPDATE_LEADS, {
          variables: { messageid: operation.id },
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });

     const [updatateseen]: any = useMutation(UPDATE_SEEN, {
          onCompleted: (r: any) => {
               console.log(r);
          },
     });

     const [deleteLeads] = useMutation(DELETE_LEAD, { onCompleted: (e: any) => console.log(e) });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) modalTrigger.next(true);
          },
     }));
     useQuery(GET_LEADS_ID, {
          variables: { id: operation.id },
          skip: !operation.id,
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });
     //  function loadData(data: any) {
     //       // messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
     //       // messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
     //       // messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
     //       // messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
     //  }

     function FillDetails(data: any) {
          let detail: any = { leadsdetails: {} };
          let msg: any = data.websiteContactForms[0];

          detail.status = msg.details.status;
          detail.source = msg.details.source;
          detail.notes = msg.details.notes;
          detail.leadsdetails.email = msg.details.leadsdetails.email;
          detail.leadsdetails.name = msg.details.leadsdetails.name;
          detail.leadsdetails.phonenumber = msg.details.leadsdetails.phonenumber;
          detail.leadsdetails.leadsmesssage = msg.details.leadsdetails.leadsmesssage;

          setMessageDetails(detail);

          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     function CreateMessage(frm: any) {
          console.log(frm);
          createLeads({ variables: { id: auth.userid, details: frm } });
          // createMessage({ variables: frm });
     }

     function EditMessage(frm: any) {
          console.log(frm);
          editMessage({ variables: { id: auth.userid, details: frm } });
     }

     if (operation.type === "view") {
          updatateseen({ variables: { messageid: operation.id, seen: false } });
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
                    //ViewMessage();
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
                    //widgets={widgets}
                    modalTrigger={modalTrigger}
               />

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
