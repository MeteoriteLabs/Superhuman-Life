import React, { useContext, useImperativeHandle, useState } from "react";
import ModalView from "../../../components/modal/index";
import { ADD_PAYMENT_SCHEDULE } from "./queries";
import { useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { schema, widgets } from "./PayeeSchema";
import { Subject } from "rxjs";
import Toaster from "../../../components/Toaster";
import {
  phoneCustomFormats,
  phoneTransformErrors,
} from "../../../components/utils/ValidationPatterns";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create";
  current_status: boolean;
}

function CreateChangemakerAsPayee(props: any, ref: any) {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const auth = useContext(AuthContext);
  const payeeJson: Record<string, unknown> = require("./ChangemakerPayee.json");
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const modalTrigger = new Subject();
  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      modalTrigger.next(true);
    },
  }));

  const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
      props.refetchContacts();
      props.refetchChangemakersPaymentSchedules();
    },
  });

  function CreateContact(frm: any) {
    frm.searchChangemaker = frm.searchChangemaker
      ? JSON.parse(frm.searchChangemaker)
      : null; //existing user

    createPaymentSchedule({
      variables: {
        data: {
          Destination_User_ID: Number(
            frm.searchChangemaker
              .map((item: any) => {
                return item.id;
              })
              .toString()
          ),

          Effective_Date: frm.effectiveDate,
          PaymentCatagory: frm.PaymentCategory,
          Payment_Cycle: frm.paymentCycle,
          Payment_DateTime: frm.paymentDueOn,
          Reminder_DateTime: frm.setReminder,
          Source_User_ID: Number(auth.userid),
          Total_Amount: Number(frm.amountToBePaid),
          frequency: frm.FrequencyOfPayment,
          Total_Amount_Breakdown: {
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
            ProfessionalTax: frm.ProfessionalTax ? frm.ProfessionalTax : null,
            TDS: frm.TDS ? frm.TDS : null,
            ProvidentFund: frm.ProvidentFund ? frm.ProvidentFund : null,
          },
        },
      },
    });

    modalTrigger.next(false);
    setIsCreated(!isCreated);
  }

  const onSubmit = (frm: any) => {
    CreateContact(frm);
  };

  return (
    <>
      {/* Payee create modal */}
      <ModalView
        name={"Create Changemaker as Payee"}
        isStepper={true}
        showErrorList={false}
        formUISchema={schema}
        formSchema={payeeJson}
        formSubmit={(frm: any) => {
          onSubmit(frm);
        }}
        formData={
          operation.type === "create"
            ? {
                PaymentMode: "UPI",
                FrequencyOfPayment: 0,
                provideBreakdown: "No",
                type: "Client",
                PaymentCategory: "Vendor",
              }
            : {}
        }
        stepperValues={["Payee Basic Details", "Payment Settings"]}
        widgets={widgets}
        modalTrigger={modalTrigger}
        customFormats={phoneCustomFormats}
        transformErrors={phoneTransformErrors}
      />

      {/* success toaster notification */}
      {isCreated && (
        <Toaster
          handleCallback={() => setIsCreated(!isCreated)}
          type="success"
          msg="Changemaker has been added as Payee successfully"
        />
      )}
    </>
  );
}

export default React.forwardRef(CreateChangemakerAsPayee);
