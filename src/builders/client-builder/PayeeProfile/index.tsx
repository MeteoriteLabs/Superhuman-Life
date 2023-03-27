import { useState, useRef } from "react";
import { withTheme, utils } from "@rjsf/core";
import { Theme as Bootstrap4Theme } from "@rjsf/bootstrap-4";
import { schema } from "./payeeProfileSchema";
import { GET_CONTACT, UPDATE_CONTACT } from "../contacts/queries";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { Col } from "react-bootstrap";
import Toaster from "../../../components/Toaster";
import {
  phoneCustomFormats,
  phoneTransformErrors,
} from "../../../components/utils/ValidationPatterns";
import { PaymentDetails } from "../contacts/PaymentDetailsInterface";

function PayeeProfile() {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets["FileWidget"];
  (Bootstrap4Theme as any).widgets["FileWidget"] = defaultFileWidget;
  const Form: any = withTheme(Bootstrap4Theme);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const payeeProfileJson: {} = require("./payeeProfile.json");
  const [paymentModeDetails, setPaymentModeDetails] = useState<PaymentDetails>();
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");

  useQuery(GET_CONTACT, {
    variables: { id: id },
    onCompleted: (e: any) => {
      FillDetails(e.contact);
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
          firstname: frm.firstname ? frm.firstname : null,
          lastname: frm.lastname ? frm.lastname : null,
          email: frm.email ? frm.email : null,
          phone: frm.phone ? frm.phone : null,
          type: frm.type ? frm.type : null,
          appDownloadStatus: frm.appDownloadStatus ? "Invited" : "NotInvited",
          isPayee: frm.isPayee,
          organisationDetails: frm.organisationDetails
            ? {
                organisationEmail: frm.organisationEmail,
                organisationName: frm.organisationName,
                gst: frm.gst,
                state: frm.state,
                zipcode: frm.zipcode,
                city: frm.city,
                country: frm.country,
                address1: frm.address1,
                address2: frm.address2,
              }
            : null,
        },
      },
    });
  }

  function OnSubmit(frm: any) {
    EditPaymentModeDetails(frm.formData);
  }

  //fillDetails
  function FillDetails(contactDetail: any) {
    const data = flattenObj({ ...contactDetail });
   
    let detail = {} as PaymentDetails;

    if (data) {
      detail.id = data.id;
      detail.firstname = data.firstname;
      detail.lastname = data.lastname;
      detail.email = data.email;
      detail.phone = data.phone;
      detail.appDownloadStatus = data.appDownloadStatus === "Invited" ? true : false;
      detail.type = data.type;
      detail.isPayee = data.isPayee;
      if (data.organisationDetails) {
        detail.organisationDetails = data.organisationDetails ? true : false;
        detail.organisationName = data.organisationDetails.organisationName;
        detail.gst = data.organisationDetails.gst;
        detail.address1 = data.organisationDetails.address1;
        detail.address2 = data.organisationDetails.address2;
        detail.city = data.organisationDetails.city;
        detail.state = data.organisationDetails.state;
        detail.country = data.organisationDetails.country;
        detail.zipcode = data.organisationDetails.zipcode;
        detail.organisationEmail = data.organisationDetails.organisationEmail;
      }
    }

    setPaymentModeDetails(detail);
  }

  return (
    <>
      {/* Payee profile details Form */}
      <Col>
        <Form
          uiSchema={schema}
          schema={payeeProfileJson}
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
          msg="Payee details has been added successfully"
        />
      ) : null}
    </>
  );
}

export default PayeeProfile;
