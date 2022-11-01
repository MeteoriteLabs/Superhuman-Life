import React, { useContext, useImperativeHandle, useState } from "react";
import ModalView from "../../../components/modal/index";
import {
  ADD_CONTACT,
  ADD_PAYMENT_SCHEDULE,
  GET_CONTACT,
  GET_CONTACTS,
  UPDATE_CONTACT,
  FETCH_CONTACT_DETAILS,
} from "./queries";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { schema, widgets } from "./PayeeSchema";
import { Subject } from "rxjs";
import Toaster from "../../../components/Toaster";
import {
  phoneCustomFormats,
  phoneTransformErrors,
} from "../../../components/utils/ValidationPatterns";
import { FETCH_USERS_PROFILE_DATA } from "../../../pages/profile/queries/queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { PayeeDetails, PaymentScheduleDetails } from "./PayeeInterfaces";

interface Operation {
  id: string;
  modal_status: boolean;
  type: "create" | "edit" | "view" | "delete";
  current_status: boolean;
}

const emptyPayeeDetailsState = {
  PayeeCategory: "All contacts",
  TypeofPayee: "Individual",
  PaymentMode: "UPI",
  FrequencyOfPayment: "One Time",
  provideBreakdown: "No",
  search: "",
};

function CreateEditPayee(props: any, ref: any) {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const auth = useContext(AuthContext);
  const payeeJson: {} = require("./Payee.json");
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [usersDetails, setUserDetails] = useState<any>([]);
  const [contactData, setContactData] = useState<any>({});

  const modalTrigger = new Subject();
  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      modalTrigger.next(true);
    },
  }));

  const [createContact] = useMutation(ADD_CONTACT);

  const [updateContact] = useMutation(UPDATE_CONTACT);

  const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
    },
  });

  useQuery(FETCH_USERS_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      const flattenUserData = flattenObj(r);
      setUserDetails(flattenUserData.usersPermissionsUsers);
    },
  });

  // useQuery(FETCH_CONTACT_DETAILS, {
  //   variables: { id: operation.id }, //need to change id
  //   onCompleted: (r: any) => {
  //     let flattenDetail = flattenObj(r);
  //     setContactData(flattenDetail.contact);
  //   },
  // });

  // function createPayee(frm: any) {
  //   createContact({
  //     variables: {

  //       data: {
  //         paymentDetails: {
  //           upi: frm.UPI_ID,
  //           phoneNumber: frm.upiPhoneNumber,
  //           branch: frm.Branch,
  //           IFSCCode: frm.ifscCode,
  //           bankName: frm.BankName,
  //           accountType: frm.accountType,
  //           accountNumber: frm.AccountNumber,
  //         },
  //       },
  //     },
  //   });
  // }

  function CreateContact(frm: any) {
    const payeeDetails = {} as PayeeDetails;
    const paymentScheduleDetails = {} as PaymentScheduleDetails;

    payeeDetails.firstname = frm.PayeeFirstName ? frm.PayeeFirstName : null;
    payeeDetails.lastname = frm.PayeeLastName ? frm.PayeeLastName : null;
    payeeDetails.email = frm.Email ? frm.Email : null;
    payeeDetails.phone = frm.phone ? frm.Phone_Number : null;
    payeeDetails.type = frm.type ? frm.type : null;
    payeeDetails.isPayee = true;
    payeeDetails.ownedBy = auth.userid;
    payeeDetails.isPayee = true;
    payeeDetails.type = frm.type ? frm.PaymentCategory : null;
    payeeDetails.organisationDetails = {
      organisationEmail: frm.organisationDetails ? frm.organisationEmail : null,
      organisationName: frm.organisationDetails ? frm.organisationName : null,
      gst: frm.organisationDetails ? frm.gst : null,
      state: frm.organisationDetails ? frm.state : null,
      zipcode: frm.organisationDetails ? frm.zipcode : null,
      city: frm.organisationDetails ? frm.city : null,
      country: frm.organisationDetails ? frm.country : null,
      address1: frm.organisationDetails ? frm.address1 : null,
      address2: frm.organisationDetails ? frm.address2 : null,
    };
    payeeDetails.paymentDetails = {
      upi: frm.UPI_ID ? frm.UPI_ID : null,
      phoneNumber: frm.upiPhoneNumber ? frm.upiPhoneNumber : null,
      branch: frm.Branch ? frm.Branch : null,
      IFSCCode: frm.ifscCode ? frm.ifscCode : null,
      bankName: frm.BankName ? frm.BankName : null,
      accountType: frm.accountType ? frm.accountType : null,
      accountNumber: frm.AccountNumber ? frm.AccountNumber : null,
    };

    paymentScheduleDetails.Destination_Contacts_ID = 1;
    paymentScheduleDetails.Destination_User_ID = 24;
    paymentScheduleDetails.PaymentCatagory = frm.effectiveDate
      ? frm.effectiveDate
      : null;
    paymentScheduleDetails.Effective_Date = frm.effectiveDate
      ? frm.effectiveDate
      : null;
    paymentScheduleDetails.PaymentCatagory = frm.PaymentCategory
      ? frm.PaymentCategory
      : null;
    paymentScheduleDetails.Payment_Cycle = frm.paymentCycle
      ? frm.paymentCycle
      : null;
    paymentScheduleDetails.Payment_DateTime = frm.paymentDueOn
      ? frm.paymentDueOn
      : null;
    paymentScheduleDetails.Reminder_DateTime = frm.setReminder
      ? frm.setReminder
      : null;
    paymentScheduleDetails.Source_User_ID = Number(auth.userid);
    paymentScheduleDetails.Total_Amount = frm.amountToBePaid
      ? Number(frm.amountToBePaid)
      : null;
    paymentScheduleDetails.frequency = frm.FrequencyOfPayment;
    paymentScheduleDetails.Total_Amount_Breakdown = {
      basicPay: frm.basicPay ? frm.basicPay : null,
      HRA: frm.HRA ? frm.HRA : null,
      Gratuity: frm.Gratuity ? frm.Gratuity : null,
      LTA: frm.LTA ? frm.LTA : null,
      ESI: frm.ESI ? frm.ESI : null,
      MedicalReimbursement: frm.MedicalReimbursement
        ? frm.MedicalReimbursement
        : null,
      ChildCare: frm.ChildCare ? frm.ChildCare : null,
      SpecialAllowance: frm.SpecialAllowance ? frm.SpecialAllowance : null,
      ProfessionalTax: frm.ProfessionalTax ? frm.ProfessionalTax : null,
      TDS: frm.TDS ? frm.TDS : null,
      ProvidentFund: frm.ProvidentFund ? frm.ProvidentFund : null,
    };

    if (frm.PayeeCategory === "All contacts") {
      updateContact({
        variables: {
          id: Number(operation.id),
          data: {
            isPayee: true
          }

        },
        onCompleted: (r: any) => {
          // let existingUserId = usersDetails.find(
          //   (currentValue) => currentValue.email === contactData.email
          // );

          createPaymentSchedule({
            variables: {
              data: 
                paymentScheduleDetails,
              
            },
          });

          modalTrigger.next(false);
          setIsCreated(!isCreated);
        },
        refetchQueries: [GET_CONTACTS],
      });
    } else {
      createContact({
        variables: {
          data: 
            payeeDetails,
          
        },
        onCompleted: (r: any) => {
          createPaymentSchedule({
            variables: {
              data: 
                paymentScheduleDetails,
              
            },
          });

          modalTrigger.next(false);
          setIsCreated(!isCreated);
        },
        refetchQueries: [GET_CONTACTS],
      });
    }
  }

  const onSubmit = (frm: any) => {
    console.log(frm);
    CreateContact(frm);
  };

  return (
    <>
      {/* Payee create modal */}
      <ModalView
        name={"Create Payee"}
        isStepper={true}
        showErrorList={false}
        formUISchema={schema}
        formSchema={payeeJson}
        formSubmit={(frm: any) => {
          onSubmit(frm);
        }}
        formData={emptyPayeeDetailsState}
        stepperValues={[
          "Payee Basic Details",
          "Payment Settings",
          "Payment Mode",
        ]}
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
          msg="Payee has been created successfully"
        />
      )}
    </>
  );
}

export default React.forwardRef(CreateEditPayee);
