import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_LEADS_NEW, DELETE_LEAD_NEW, GET_LEADS_ID_NEW, UPDATE_LEADS_NEW, UPDATE_SEEN_NEW } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./schema";
import { flattenObj } from "../../../components/utils/responseFlatten";
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
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     let o = { ...operation };

     const [createLeads] = useMutation(ADD_LEADS_NEW, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });
     const [editMessage]: any = useMutation(UPDATE_LEADS_NEW, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [updatateseen]: any = useMutation(UPDATE_SEEN_NEW, {
          onCompleted: (r: any) => {
               console.log(r);
          },
     });

     const [deleteLeads] = useMutation(DELETE_LEAD_NEW, { onCompleted: (e: any) => props.callback() });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) modalTrigger.next(true);
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
          const flattenData = flattenObj({ ...data })
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
          createLeads({ variables: { id: auth.userid, details: frm } });
          // createMessage({ variables: frm });
     }

     function EditMessage(frm: any) {
          editMessage({ variables: { id: auth.userid, details: frm, messageid: frm.messageid } });
     }

     if (o.type === "view") {
          updatateseen({ variables: { messageid: o.id, seen: false } });
     }

     // function ViewMessage(frm: any) {
     //      updatateseen({ variables: { messageid: frm.messageid, seen: false } });
     // }

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
