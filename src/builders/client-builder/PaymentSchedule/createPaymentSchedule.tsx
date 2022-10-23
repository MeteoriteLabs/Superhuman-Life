import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../components/modal";
import { FETCH_USERS_PROFILE_DATA } from "../../../pages/profile/queries/queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./PaymentScheduleSettingSchema";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { ADD_PAYMENT_SCHEDULE, FETCH_CONTACT_DETAILS, DELETE_PAYMENT_SCHEDULE, UPDATE_PAYMENT_SCHEDULE, GET_PAYMENT_SCHEDULE } from "./queries";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "deactivate" | "delete";
     current_status: boolean;
}

function CreatePaymentSchedule(props: any, ref: any) {
     const query = window.location.search;
     const params = new URLSearchParams(query);
     const id = params.get('id');
     const auth = useContext(AuthContext);
     const paymentSchema: { [name: string]: any } = require("./paymentSettings.json");
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
     const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false);
     const [usersDetails, setUserDetails] = useState<any>([]);
     const [contactData, setContactData] = useState<any>({});
     const [paymentDetail, setPaymentDetail] = useState<any>({});

     useQuery(FETCH_USERS_PROFILE_DATA, {
          onCompleted: (r: any) => {
               const flattenUserData = flattenObj(r);
               setUserDetails(flattenUserData.usersPermissionsUsers)
          }
     });

     useQuery(FETCH_CONTACT_DETAILS,
          {
               variables: { id: id },
               onCompleted: (r: any) => {
                    let flattenDetail = flattenObj(r);
                    setContactData(flattenDetail.contact);
               },
          }
     );

     useQuery(GET_PAYMENT_SCHEDULE, {
          variables: { id: operation.id },
          onCompleted: (r: any) => {
               const flattenPaymentData = flattenObj(r);
               setPaymentDetail(flattenPaymentData.paymentSchedule)
          }
     });

     const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [updatePaymentSchedule] = useMutation(UPDATE_PAYMENT_SCHEDULE, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });

     const [deletePayment] = useMutation(DELETE_PAYMENT_SCHEDULE, { onCompleted: (e: any) => { modalTrigger.next(false); props.callback(); } });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               // set show delete modal to render for delete operation
               if (msg.type === 'delete') {
                    setShowDeleteModal(true);
               }

               // set show deactivate modal to render for deactivate operation
               if (msg.type === 'deactivate') {
                    setShowDeactivateModal(true);
               }

               // restrict create modal to render for deactivate operation and delete operation
               if (msg.type !== 'deactivate' && msg.type !== 'delete') {
                    modalTrigger.next(true);
               }

          },
     }));

     function CreatePaymentSchedule(frm: any) {
          let existingUserId = usersDetails.find((currentValue) => currentValue.email === contactData.email)

          createPaymentSchedule({
               variables: {
                    data: {
                         PaymentCatagory: frm.PaymentCategory ? frm.PaymentCategory : null,
                         Source_User_ID: Number(auth.userid),
                         Destination_Contacts_ID: existingUserId ? null : Number(id),
                         Destination_User_ID: existingUserId ? Number(existingUserId.id) : null,
                         frequency: frm.FrequencyOfPayment,
                         Payment_Cycle: frm.paymentCycle ? frm.paymentCycle : null,
                         Total_Amount: frm.amountToBePaid ? Number(frm.amountToBePaid) : null,
                         Payment_DateTime: frm.paymentDueOn ? frm.paymentDueOn : null,
                         Reminder_DateTime: frm.setReminder ? frm.setReminder : null,
                         Effective_Date: frm.effectiveDate ? frm.effectiveDate : null,
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
     }

     function UpdatePaymentSchedule(frm: any) {

          updatePaymentSchedule({
               variables: {
                    id: Number(operation.id),
                    data: {
                         isActive: paymentDetail.isActive ? false : true,
                    }
               }
          });
     }

     function DeletePaymentSchedule(id: any) {
          deletePayment({
               variables: {
                    id
               }
          });
     }

     function OnSubmit(frm: any) {
          CreatePaymentSchedule(frm);
     }

     return (
          <>
               {/* Create Modal */}
               <ModalView
                    name={'Create payment schedule'}
                    isStepper={false}
                    showErrorList={false}
                    formUISchema={schema}
                    formSchema={paymentSchema}
                    showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                         OnSubmit(frm);
                    }}
                    formData={{}}
                    modalTrigger={modalTrigger}
                    type={operation.type}
               />

               {/* Deactivate Modal */}
               {showDeactivateModal && (
                    <StatusModal
                         show={showDeactivateModal}
                         onHide={() => setShowDeactivateModal(false)}
                         modalTitle="Deactivate"
                         modalBody="Do you want to deactivate this payment schedule?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {
                              UpdatePaymentSchedule(operation.id);
                         }}
                    />
               )}

               {/* Delete Modal */}
               {showDeleteModal && (
                    <StatusModal
                         show={showDeleteModal}
                         onHide={() => setShowDeleteModal(false)}
                         modalTitle="Delete Schedule"
                         modalBody="Do you want to delete this payment schedule?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {
                              DeletePaymentSchedule(operation.id);
                         }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreatePaymentSchedule);
