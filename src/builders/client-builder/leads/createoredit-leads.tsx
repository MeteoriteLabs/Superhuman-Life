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

     let o = { ...operation };
     console.log(o.type);

     const [createLeads] = useMutation(ADD_LEADS, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [editMessage]: any = useMutation(UPDATE_LEADS, {
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
     // useQuery(GET_LEADS_ID, {
     //      variables: { id: operation.id },
     //      skip: !operation.id,
     //      onCompleted: (e: any) => {
     //           FillDetails(e);
     //      },
     // });
     useQuery(GET_LEADS_ID, {
          variables: { id: operation.id },
          skip: !operation.id || operation.type === "delete",
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });

     function FillDetails(data: any) {
          let detail: any = { leadsdetails: {} };
          let msg: any = data.websiteContactForms[0];

          let o = { ...operation };
          detail.name = o.type.toLowerCase();
          detail.status = msg.details.status;
          detail.source = msg.details.source;
          detail.notes = msg.details.notes;
          detail.leadsdetails.email = msg.details.leadsdetails.email;
          detail.leadsdetails.name = msg.details.leadsdetails.name;
          detail.leadsdetails.phonenumber = msg.details.leadsdetails.phonenumber;
          detail.leadsdetails.leadsmesssage = msg.details.leadsdetails.leadsmesssage;
          detail.messageid = msg.id;

          setMessageDetails(detail);
          setOperation({} as Operation);

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
          editMessage({ variables: { id: auth.userid, details: frm, messageid: frm.messageid } });
     }

     if (o.type === "view") {
          updatateseen({ variables: { messageid: o.id, seen: false } });
     }

     // function ViewMessage(frm: any) {
     //      updatateseen({ variables: { messageid: frm.messageid, seen: false } });
     // }

     function DeleteMessage(id: any) {
          console.log(id);
          deleteLeads({ variables: { id: id } });
     }

     function OnSubmit(frm: any) {
          console.log(frm);
          console.log(frm.name);
          if (frm) frm.user_permissions_user = auth.userid;
          if (frm.name === "edit" || frm.name === "view") {
               if (frm.name === "edit") {
                    EditMessage(frm);
               }
               // if (frm.name === "view") {
               //      ViewMessage(frm);
               //      // updatateseen({ variables: { messageid: frm.messageid, seen: false } });
               //      // modalTrigger.next(false);
               // }
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
