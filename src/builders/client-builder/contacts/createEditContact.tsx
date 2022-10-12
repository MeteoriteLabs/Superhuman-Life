import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
// use this query if needed UPDATE_SEEN_NEW
import { ADD_CONTACT, DELETE_CONTACT, GET_CONTACTS, UPDATE_CONTACT } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
// import { schema } from "./schema";
import { flattenObj } from "../../../components/utils/responseFlatten";

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
     const [showDeleteModal, setShowDeleteModal] = useState(false);

     // let o = { ...operation };

     const [createContact] = useMutation(ADD_CONTACT, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [updateContact]: any = useMutation(UPDATE_CONTACT, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [deleteContact] = useMutation(DELETE_CONTACT, { onCompleted: (e: any) => { modalTrigger.next(false); props.callback(); } });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               // set show delete modal to render for delete operation
               if (msg.type === 'delete') {
                    setShowDeleteModal(true);
               }

               // restrict create modal to render for delete operation
               if (msg.type !== 'delete') {
                    modalTrigger.next(true);
               }

          },
     }));

    //  useQuery(GET_LEADS_ID_NEW, {
    //       variables: { id: operation.id },
    //       skip: !operation.id || operation.type === "delete",
    //       onCompleted: (e: any) => {
    //            FillDetails(e);
    //       },
    //  });

     // function FillDetails(data: any) {
     //      const flattenData = flattenObj({ ...data })
     //      let detail: any = { leadsdetails: {} };
     //      let msg: any = flattenData.websiteContactForms[0];

     //      let o = { ...operation };
     //      detail.name = o.type.toLowerCase();
     //      detail.status = msg.Details.status;
     //      detail.source = msg.Details.source;
     //      detail.notes = msg.Details.notes;
     //      detail.leadsdetails.email = msg.Details?.leadsdetails.email;
     //      detail.leadsdetails.name = msg.Details?.leadsdetails.name;
     //      detail.leadsdetails.phonenumber = msg.Details?.leadsdetails.phonenumber;
     //      detail.leadsdetails.leadsmesssage = msg.Details?.leadsdetails.leadsmesssage;
     //      detail.messageid = msg.id;

     //      setMessageDetails(detail);
     //      setOperation({} as Operation);

     //      if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
     //    //   else OnSubmit(null);
     // }

     function CreateContact(frm: any) {
          createContact({ variables: { data: frm } });
     }

     function EditContact(frm: any) {
          updateContact({ variables: { id: operation.id, data: frm} });
     }

     // if (o.type === "view") {
     //      updatateseen({ variables: { messageid: o.id, seen: true } });
     // }

     // function ViewMessage(frm: any) {
     //      updatateseen({ variables: { messageid: frm.messageid, seen: false } });
     // }

     function DeleteContact(id: string): void {
          deleteContact({ variables: { id: id } });
     }

    //  function OnSubmit(frm: any) {
    //       if (frm) frm.user_permissions_user = auth.userid;
    //       if (frm.name === "edit" || frm.name === "view") {
    //            if (frm.name === "edit") {
    //                 EditMessage(frm);
    //            }
    //       } else {
    //            CreateMessage(frm);
    //       }
    //  }

     return (
          <>
               {/* Create , Edit and View Modal */}
               <ModalView
                    name={operation.type}
                    isStepper={false}
                    // formUISchema={schema}
                    formSchema={contactSchema}
                    showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                        //  OnSubmit(frm);
                    }}
                    formData={operation.type === 'create' ? {} : contactDetails}
                    modalTrigger={modalTrigger}
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
                              console.log(operation.id);
                         }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateEditContact);
