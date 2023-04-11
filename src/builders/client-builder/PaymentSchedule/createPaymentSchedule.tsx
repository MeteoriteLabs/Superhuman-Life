import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema } from "./PaymentScheduleSettingSchema";
import Toaster from "../../../components/Toaster";
import {
  ADD_PAYMENT_SCHEDULE,
  DELETE_PAYMENT_SCHEDULE,
  UPDATE_PAYMENT_SCHEDULE,
} from "./queries";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "deactivate" | "delete";
  current_status: boolean;
}

function CreatePaymentSchedule(props: any, ref: any) {
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id: string | null = params.get("id");
  const isChangemaker: boolean =
    params.get("isChangemaker") === "false" ? false : true;

  const auth = useContext(AuthContext);
  const paymentSchema: Record<string, unknown> = require("./paymentSettings.json");
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDeactivateModal, setShowDeactivateModal] =
    useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isDeactivated, setIsDeactivated] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsCreated(!isCreated);
    },
  });

  const [updatePaymentSchedule] = useMutation(UPDATE_PAYMENT_SCHEDULE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsDeactivated(!isDeactivated);
    },
  });

  const [deletePayment] = useMutation(DELETE_PAYMENT_SCHEDULE, {
    onCompleted: (e: any) => {
      modalTrigger.next(false);
      props.callback();
      setIsDeleted(!isDeleted);
    },
  });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      // set show delete modal to render for delete operation
      if (msg.type === "delete") {
        setShowDeleteModal(true);
      }

      // set show deactivate modal to render for deactivate operation
      if (msg.type === "deactivate") {
        setShowDeactivateModal(true);
      }

      // restrict create modal to render for deactivate operation and delete operation
      if (msg.type !== "deactivate" && msg.type !== "delete") {
        modalTrigger.next(true);
      }
    },
  }));

  const toastMessage = `Payment Schedule has been ${
    operation.current_status === true ? "Deactivated" : "Reactivated"
  } successfully`;

  function CreatePaymentSchedule(frm: any) {
    createPaymentSchedule({
      variables: {
        data: {
          PaymentCatagory: frm.PaymentCategory ? frm.PaymentCategory : null,
          Source_User_ID: Number(auth.userid),
          Destination_Contacts_ID: isChangemaker ? null : Number(id),
          Destination_User_ID: isChangemaker ? Number(id) : null,
          frequency: frm.FrequencyOfPayment,
          Payment_Cycle: frm.FrequencyOfPayment === 0 ? 0 : frm.paymentCycle ,
          Total_Amount: frm.amountToBePaid ? Number(frm.amountToBePaid) : null,
          Payment_DateTime: frm.paymentDueOn ? frm.paymentDueOn : null,
          Reminder_DateTime: frm.setReminder ? frm.setReminder : null,
          Effective_Date: frm.effectiveDate ? frm.effectiveDate : null,
          Total_Amount_Breakdown: frm.provideBreakdown
            ? {
                basicPay: frm.basicPay ? frm.basicPay : null,
                HRA: frm.HRA ? frm.HRA : null,
                Gratuity: frm.Gratuity ? frm.Gratuity : null,
                LTA: frm.LTA ? frm.LTA : null,
                ESI: frm.ESI ? frm.ESI : null,
                MedicalReimbursement: frm.MedicalReimbursement
                  ? frm.MedicalReimbursement
                  : null,
                ChildCare: frm.ChildCare ? frm.ChildCare : null,
                SpecialAllowance: frm.SpecialAllowance
                  ? frm.SpecialAllowance
                  : null,
                ProfessionalTax: frm.ProfessionalTax
                  ? frm.ProfessionalTax
                  : null,
                TDS: frm.TDS ? frm.TDS : null,
                ProvidentFund: frm.ProvidentFund ? frm.ProvidentFund : null,
              }
            : null,
        },
      },
    });
  }

  function UpdatePaymentSchedule(id: string, status: boolean) {
    updatePaymentSchedule({
      variables: {
        id: Number(id),
        data: {
          isActive: status ? false : true,
        },
      },
    });
  }

  function DeletePaymentSchedule(id: any) {
    deletePayment({
      variables: {
        id,
      },
    });
  }

  function OnSubmit(frm: any) {
    CreatePaymentSchedule(frm);
  }

  return (
    <>
      {/* Create Modal */}
      <ModalView
        name={"Create payment schedule"}
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
          modalTitle={
            operation.current_status === true ? "Deactivate" : "Reactivate"
          }
          modalBody={
            operation.current_status === true
              ? "Do you want to deactivate this payment schedule?"
              : "Do you want to reactivate this payment schedule?"
          }
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            UpdatePaymentSchedule(operation.id, operation.current_status);
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

      {/* success toaster notification */}
      {isCreated && (
        <Toaster
          handleCallback={() => setIsCreated(!isCreated)}
          type="success"
          msg="Payment Schedule has been created successfully"
        />
      )}
      {isDeactivated && (
        <Toaster
          handleCallback={() => setIsDeactivated(!isDeactivated)}
          type="success"
          msg={toastMessage}
        />
      )}
      {isDeleted && (
        <Toaster
          handleCallback={() => setIsDeleted(!isDeleted)}
          type="success"
          msg="Payment Schedule has been deleted successfully"
        />
      )}
    </>
  );
}

export default React.forwardRef(CreatePaymentSchedule);
