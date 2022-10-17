import React, { useContext, useEffect, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
// use this query if needed UPDATE_SEEN_NEW
import { ADD_CONTACT, DELETE_CONTACT, GET_CONTACTS, UPDATE_CONTACT, ADD_PAYMENT_SCHEDULE, GET_PAYMENT_SCHEDULES } from "./queries";
import { FETCH_USERS_PROFILE_DATA } from "../../../pages/profile/queries/queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./contactsSchema";
import { flattenObj } from "../../../components/utils/responseFlatten";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit" | "view" | "delete";
     current_status: boolean;
}

// interface PayeeDetail {
//      PaymentCategory: string;
//      Destination_Contacts_ID: number;
//      Destination_User_ID: number;
//      Source_User_ID: number;
//      frequency: number;
//      Payment_Cycle: number;
//      Total_Amount: number;
//      Payment_DateTime: Date;
//      Reminder_DateTime: Date;
//      Total_Amount_Breakdown: {}
// }

function CreateEditContact(props: any, ref: any) {
     const auth = useContext(AuthContext);
     const contactSchema: { [name: string]: any } = require("./contact.json");
     const [contactDetails, setContactDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
     const [usersDetails, setUserDetails] = useState<any>([]);
     const [paymentScheduleDetails, setPaymentScheduleDetails] = useState<any>([]);
     const [modalLabel, setModalLabel] = useState<string>('');

     const { data: userData } = useQuery(FETCH_USERS_PROFILE_DATA, {
          onCompleted: (r: any) => {
               const flattenUserData = flattenObj(r);
               setUserDetails(flattenUserData.usersPermissionsUsers)
          }
     });

     const { data: getPaymentSchedule } = useQuery(GET_PAYMENT_SCHEDULES, {
          onCompleted: (r: any) => {
               const flattenPaymentScheduleData = flattenObj(r);
               setPaymentScheduleDetails(flattenPaymentScheduleData.paymentSchedules)
          }
     });


     const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE);

     const [createContact] = useMutation(ADD_CONTACT);

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

     useQuery(GET_CONTACTS, {
          variables: { id: operation.id },
          skip: !operation.id || operation.type === "delete",
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });

     function FillDetails(data: any) {
          const flattenData = flattenObj({ ...data });
          const contactsArrayToUpdate = flattenData.contacts && flattenData.contacts.length ? flattenData.contacts.filter((currentValue) => Number(currentValue.id) === Number(operation.id)) : null;
          const contactsId = contactsArrayToUpdate && contactsArrayToUpdate.length ? contactsArrayToUpdate[0].id : null;
          const contactsEmail = contactsArrayToUpdate[0].email;
          const findDestinationUsersArray = usersDetails && usersDetails.length ? usersDetails.filter((currentValue) => currentValue.email === contactsEmail) : null;
          console.log('findDestinationUsersArray', findDestinationUsersArray)
          const destinationUsersId = findDestinationUsersArray && findDestinationUsersArray.length ? findDestinationUsersArray[0].id : null;
          console.log('destinationUsersId', destinationUsersId);
          const paymentScheduleArrayToUpdate = paymentScheduleDetails && paymentScheduleDetails.length ? paymentScheduleDetails.filter((currentValue) => {
               if (currentValue.Destination_Contacts_ID !== null) {
                    return Number(currentValue.Destination_Contacts_ID) === Number(contactsId)
               } else if (currentValue.Destination_Contacts_ID === null) {
                    return Number(currentValue.Destination_User_ID) === Number(destinationUsersId)
               }
          }
          ) : null;
          if (paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length) {
               console.log('paymentschedulearray', paymentScheduleArrayToUpdate);
          }

          let detail: any = { leadsdetails: {} };

          detail.firstname = contactsArrayToUpdate[0].firstname ? contactsArrayToUpdate[0].firstname : null;
          detail.lastname = contactsArrayToUpdate[0].lastname ? contactsArrayToUpdate[0].lastname : null;
          detail.email = contactsArrayToUpdate[0].email ? contactsArrayToUpdate[0].email : null;
          detail.phone = contactsArrayToUpdate[0].phone ? contactsArrayToUpdate[0].phone : null;
          detail.appDownloadStatus = contactsArrayToUpdate[0].appDownloadStatus === 'Invited' ? true : false;
          detail.type = contactsArrayToUpdate[0].type;
          detail.UPI_ID = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.upi ? contactsArrayToUpdate[0].paymentDetails.upi : null;
          detail.upiPhoneNumber = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.phoneNumber ? contactsArrayToUpdate[0].paymentDetails.phoneNumber : null;
          detail.bankAccount = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.accountNumber ? true : false;
          detail.AccountNumber = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.accountNumber ? contactsArrayToUpdate[0].paymentDetails.accountNumber : null;
          detail.ifscCode = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.IFSCCode ? contactsArrayToUpdate[0].paymentDetails.IFSCCode : null;
          detail.BankName = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.bankName ? contactsArrayToUpdate[0].paymentDetails.bankName : null;
          detail.Branch = contactsArrayToUpdate[0].paymentDetails && contactsArrayToUpdate[0].paymentDetails.branch ? contactsArrayToUpdate[0].paymentDetails.branch : null;
          detail.isPayee = contactsArrayToUpdate[0].isPayee;
          detail.organisationDetails = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.organisationName ? true : false;
          detail.organisationName = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.organisationName ? contactsArrayToUpdate[0].organisationDetails.organisationName : null;
          detail.gst = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.gst ? contactsArrayToUpdate[0].organisationDetails.gst : null;
          detail.organisationEmail = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.organisationEmail ? contactsArrayToUpdate[0].organisationDetails.organisationEmail : null;
          detail.address1 = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.address1 ? contactsArrayToUpdate[0].organisationDetails.address1 : null;
          detail.address2 = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.address2 ? contactsArrayToUpdate[0].organisationDetails.address2 : null;
          detail.city = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.city ? contactsArrayToUpdate[0].organisationDetails.city : null;
          detail.state = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.state ? contactsArrayToUpdate[0].organisationDetails.state : null;
          detail.country = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.country ? contactsArrayToUpdate[0].organisationDetails.country : null;
          detail.zipcode = contactsArrayToUpdate[0].organisationDetails && contactsArrayToUpdate[0].organisationDetails.zipcode ? contactsArrayToUpdate[0].organisationDetails.zipcode : null;
          detail.PaymentCategory = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length ? paymentScheduleArrayToUpdate[0].PaymentCatagory : null;
          detail.amountToBePaid = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length ? paymentScheduleArrayToUpdate[0].Total_Amount : null;
          detail.paymentDueOn = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length ? paymentScheduleArrayToUpdate[0].Payment_DateTime : null;
          detail.setReminder = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length ? paymentScheduleArrayToUpdate[0].Reminder_DateTime : null;
          detail.FrequencyOfPayment = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length ? (paymentScheduleArrayToUpdate[0].frequency) : null;
          detail.basicPay = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.basicPay : null;
          detail.HRA = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.HRA : null;
          detail.Gratuity = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.Gratuity : null;
          detail.LTA = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.LTA : null;
          detail.ESI = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.ESI : null;
          detail.MedicalReimbursement = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.MedicalReimbursement : null;
          detail.ChildCare = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.ChildCare : null;
          detail.SpecialAllowance = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.SpecialAllowance : null;
          detail.ProfessionalTax = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.ProfessionalTax : null;
          detail.TDS = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.TDS : null;
          detail.ProvidentFund = paymentScheduleArrayToUpdate && paymentScheduleArrayToUpdate.length && paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown ? paymentScheduleArrayToUpdate[0].Total_Amount_Breakdown.ProvidentFund : null;

          setContactDetails(detail);
          setOperation({} as Operation);

          if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     enum ENUM_PAYMENT_CYCLE {
          "1st of every month",
          "2nd of every month",
          "3rd of every month",
          "4th of every month",
          "5th of every month"
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
                              } : null,
                         paymentDetails: frm.isPayee ?
                              {
                                   upi: frm.UPI_ID ? frm.UPI_ID : null,
                                   phoneNumber: frm.upiPhoneNumber ? frm.upiPhoneNumber : null,
                                   accountNumber: frm.AccountNumber ? frm.AccountNumber : null,
                                   bankName: frm.BankName ? frm.BankName : null,
                                   branch: frm.Branch ? frm.Branch : null,
                                   accountType: frm.accountType ? frm.accountType : null,
                                   IFSCCode: frm.ifscCode ? frm.ifscCode : null
                              } : null
                    }
               },
               onCompleted: (r: any) => {
                    modalTrigger.next(false);
                    props.callback();

                    const isChangeMakerExist = usersDetails && usersDetails.length ? usersDetails.findIndex(user => user.email === frm.email) : null;
                    const existingUserId = usersDetails && usersDetails.length ? usersDetails.filter((currentValue) => { if (currentValue.email === frm.email) { return currentValue.id } }) : null;

                    createPaymentSchedule({
                         variables: {
                              data: {
                                   PaymentCatagory: frm.PaymentCategory ? frm.PaymentCategory : null,
                                   Source_User_ID: Number(auth.userid),
                                   Destination_Contacts_ID: isChangeMakerExist === -1 ? Number(r.createContact.data.id) : null,
                                   Destination_User_ID: isChangeMakerExist > -1 ? Number(existingUserId[0].id) : null,
                                   frequency: frm.FrequencyOfPayment,
                                   Payment_Cycle: frm.Payment_Cycle ? frm.Payment_Cycle : null,
                                   Total_Amount: frm.amountToBePaid ? Number(frm.amountToBePaid) : null,
                                   Payment_DateTime: frm.paymentDueOn ? frm.paymentDueOn : null,
                                   Reminder_DateTime: frm.setReminder ? frm.setReminder : null,
                                   Total_Amount_Breakdown: frm.provideBreakdown ?
                                        {
                                             basicPay: frm.basicPay ? frm.basicPay : null,
                                             HRA: frm.HRA ? frm.HRA : null,
                                             Gratuity: frm.Gratuity ? frm.Gratuity : null,
                                             LTA: frm.LTA ? frm.NTA : null,
                                             ESI: frm.ESI ? frm.ESI : null,
                                             MedicalReimbursement: frm.MedicalReimbursement ? frm.MedicalReimbursement : null,
                                             ChildCare: frm.ChildCare ? frm.ChildCare : null,
                                             SpecialAllowance: frm.SpecialAllowance ? frm.SpecialAllowance : null,
                                             ProfessionalTax: frm.ProfessionalTax ? frm.ProfessionalTax : null,
                                             TDS: frm.TDS ? frm.TDS : null,
                                             ProvidentFund: frm.ProvidentFund ? frm.ProvidentFund : null
                                        } : null
                              }
                         }
                    });
               },
          });
     }

     function EditContact(id: any, frm: any) {
          console.log(id);
          updateContact({ variables: { id: id, data: {

          } } });
     }

     // if (o.type === "view") {
     //      updatateseen({ variables: { messageid: o.id, seen: true } });
     // }

     // function ViewMessage(frm: any) {
     //      updatateseen({ variables: { messageid: frm.messageid, seen: false } });
     // }

     function DeleteContact(id: any) {
          deleteContact({
               variables: {
                    id: id
               }
          });
     }

     function OnSubmit(frm: any) {
          
          console.log(operation.id);
          if (modalLabel === 'Edit contact') {
               EditContact(operation.id, frm);
          }
          else {
               CreateContact(frm);
          }

          // if (frm.name === "edit" || frm.name === "view") {
          //      if (frm.name === "edit") {
          //           EditContact(frm);
          //      }
          // } else {
          //      CreateContact(frm);
          // }
     }
console.log(operation);
     useEffect(() => {
          console.log(operation.id);
          if (operation.type === 'create') {
               setModalLabel('Create contact');
          } else if (operation.type === 'edit') {
               setModalLabel('Edit contact');
          } else if (operation.type === 'view') {
               setModalLabel('View contact');
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
                    formSubmit={(frm: any) => {
                         OnSubmit(frm);
                    }}
                    stepperValues={["Basic Contact Details", "Organisation Settings", "Payment Settings", "Payment Mode"]}
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
                         }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateEditContact);
