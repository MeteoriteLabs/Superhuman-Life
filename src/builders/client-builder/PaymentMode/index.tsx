import { useState, useRef } from "react";
import { schema } from "./paymentModeSchema";
import { GET_CONTACT , UPDATE_CONTACT } from "../contacts/queries";
import { useMutation, useQuery } from "@apollo/client";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { Col } from "react-bootstrap";
import Toaster from "../../../components/Toaster";
import {
    phoneCustomFormats,
    phoneTransformErrors,
  } from "../../../components/utils/ValidationPatterns"; 

function PaymentMode() {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets["FileWidget"];
  (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;
  const Form: any = withTheme(Bootstrap4Theme);
  let [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const formRef = useRef<any>(null);
  const paymentModeJson: { } = require("./paymentmode.json");
  const [paymentModeDetails, setPaymentModeDetails] = useState<any>({});
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");

  useQuery(GET_CONTACT, {
    variables: { id : id},
    onCompleted: (e: any) => {
      
      let flattenData = flattenObj(e);
      FillDetails(flattenData);
    },
  });

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: (e: any) => {
      setIsFormSubmitted(!isFormSubmitted);
    },
    refetchQueries: [GET_CONTACT],
  });

  function EditPaymentModeDetails(frm: any) {
    updateContact({
      variables: {
        id: Number(id),
        data: {
          paymentDetails: {
            upi: frm.UPI_ID,
            phoneNumber: frm.upiPhoneNumber,
            branch: frm.Branch,
            IFSCCode: frm.ifscCode,
            bankName: frm.BankName,
            accountType: frm.accountType,
            accountNumber: frm.AccountNumber,
          },
        },
      },
    });
  }

  function OnSubmit(frm: any) {
    EditPaymentModeDetails(frm.formData);
  }

  //fillDetails
  function FillDetails(data: any) {

    if (data && data.contact && data.contact.paymentDetails) {
      setPaymentModeDetails({
        UPI_ID: data.contact.paymentDetails.upi,
        upiPhoneNumber: data.contact.paymentDetails.phoneNumber,
        Branch: data.contact.paymentDetails.branch,
        ifscCode: data.contact.paymentDetails.IFSCCode,
        BankName: data.contact.paymentDetails.bankName,
        accountType: data.contact.paymentDetails.accountType,
        AccountNumber: data.contact.paymentDetails.accountNumber,
        bankAccount: data.contact.paymentDetails.accountNumber ? true : false,
      });
    }
  }

  return (
    <>
      {/* Payment mode details Form */}
      <Col>
        <Form
          uiSchema={schema}
          schema={paymentModeJson}
          ref={formRef}
          onSubmit={(frm: any) => {
            OnSubmit(frm);
          }}
          formData={paymentModeDetails}
          showErrorList={false}
          customFormats={phoneCustomFormats}
          transformErrors={phoneTransformErrors}
        />
      </Col>

      {/* success toaster notification */}
      {isFormSubmitted ? (
        <Toaster
          type="success"
          handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
          msg="Payment details has been added successfully"
        />
      ) : null}
    </>
  );
}

export default PaymentMode;
