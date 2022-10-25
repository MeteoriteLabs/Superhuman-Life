import React, { useEffect, useImperativeHandle, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_CONTACT, DELETE_CONTACT, GET_CONTACTS, UPDATE_CONTACT } from "./queries";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./contactsSchema";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";

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
     const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
     const [modalLabel, setModalLabel] = useState<string>('');

     const [createContact] = useMutation(ADD_CONTACT, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [updateContact] = useMutation(UPDATE_CONTACT, {
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

     useQuery(GET_CONTACTS, {
          variables: { id: operation.id },
          skip: !operation.id || operation.type === "delete",
          onCompleted: (e: any) => {
               FillDetails(e);

          },
     });

     function FillDetails(data: any) {
          const flattenData = flattenObj({ ...data });
          const contactToUpdate = flattenData.contacts && flattenData.contacts.length ? flattenData.contacts.find((currentValue) => Number(currentValue.id) === Number(operation.id)) : null;

          let detail: any = {};

          detail.id = contactToUpdate && contactToUpdate.id;
          detail.firstname = contactToUpdate && contactToUpdate.firstname;
          detail.lastname = contactToUpdate && contactToUpdate.lastname;
          detail.email = contactToUpdate && contactToUpdate.email;
          detail.phone = contactToUpdate && contactToUpdate.phone;
          detail.appDownloadStatus = contactToUpdate && contactToUpdate.appDownloadStatus === 'Invited' ? true : false;
          detail.type = contactToUpdate && contactToUpdate.type;
          detail.isPayee = contactToUpdate && contactToUpdate.isPayee;
          detail.organisationDetails = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.organisationName ? true : false;
          detail.organisationName = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.organisationName;
          detail.gst = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.gst;
          detail.address1 = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.address1;
          detail.address2 = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.address2;
          detail.city = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.city;
          detail.state = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.state;
          detail.country = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.country;
          detail.zipcode = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.zipcode;
          detail.organisationEmail = contactToUpdate && contactToUpdate.organisationDetails && contactToUpdate.organisationDetails.organisationEmail;

          setContactDetails(detail);

          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     function CreateContact(frm: any) {

          createContact({
               variables: {
                    data: {
                         firstname: frm.firstname ? frm.firstname : null,
                         lastname: frm.lastname ? frm.lastname : null,
                         email: frm.email ? frm.email : null,
                         phone: frm.phone ? frm.phone : null,
                         type: frm.type ? frm.type : null,
                         appDownloadStatus: frm.appDownloadStatus ? "Invited" : "NotInvited",
                         isPayee: frm.isPayee,
                         ownedBy: auth.userid,
                         organisationDetails: frm.organisationDetails ?
                              {
                                   organisationEmail: frm.organisationEmail,
                                   organisationName: frm.organisationName,
                                   gst: frm.gst,
                                   state: frm.state,
                                   zipcode: frm.zipcode,
                                   city: frm.city,
                                   country: frm.country,
                                   address1: frm.address1,
                                   address2: frm.address2
                              } : null
                    }
               }
          });
     }

     function EditContact(frm: any) {

          updateContact({
               variables: {
                    id: Number(operation.id),
                    data: {
                         firstname: frm.firstname ? frm.firstname : null,
                         lastname: frm.lastname ? frm.lastname : null,
                         email: frm.email ? frm.email : null,
                         phone: frm.phone ? frm.phone : null,
                         type: frm.type ? frm.type : null,
                         appDownloadStatus: frm.appDownloadStatus ? "Invited" : "NotInvited",
                         isPayee: frm.isPayee,
                         organisationDetails: frm.organisationDetails ?
                              {
                                   organisationEmail: frm.organisationEmail,
                                   organisationName: frm.organisationName,
                                   gst: frm.gst,
                                   state: frm.state,
                                   zipcode: frm.zipcode,
                                   city: frm.city,
                                   country: frm.country,
                                   address1: frm.address1,
                                   address2: frm.address2
                              } : null
                    }
               }
          });
     }

     function DeleteContact(id: any) {
          deleteContact({
               variables: {
                    id
               }
          });
     }

     function OnSubmit(frm: any) {

          if (modalLabel === 'Edit contact') {
               EditContact(frm);
          }
          else {
               CreateContact(frm);
          }

     }

     useEffect(() => {
          if (operation.type === 'create') {
               setModalLabel('Create contact');
          } else if (operation.type === 'edit') {
               setModalLabel('Edit contact');
          } else if (operation.type === 'view') {
               setModalLabel('View');
          }
     }, [operation])

     return (
          <>
               {/* Create , Edit and View Modal */}
               <ModalView
                    name={modalLabel}
                    isStepper={true}
                    showErrorList={false}
                    formUISchema={schema}
                    formSchema={contactSchema}
                    showing={operation.modal_status}
                    formSubmit={(frm: any, id: string) => {
                         OnSubmit(frm);
                    }}
                    stepperValues={["Basic Contact Details", "Organisation Settings"]}
                    formData={operation.type === 'create' ? {} : contactDetails}
                    modalTrigger={modalTrigger}
                    actionType={operation.type}
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
                         }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateEditContact);
