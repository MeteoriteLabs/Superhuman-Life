import { useState, useRef } from "react";
import Form from "@rjsf/core";
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

function PayeeProfile() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const formRef = useRef<any>(null);
  const payeeProfileJson: { } = require("./payeeProfile.json");
  const [paymentModeDetails, setPaymentModeDetails] = useState<any>({});
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");

  useQuery(GET_CONTACT, {
    variables: { id: id },
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
  function FillDetails(data: any) {
    if (data) {
      setPaymentModeDetails({
        id: data.contact && data.contact.id,
        firstname: data.contact && data.contact.firstname,
        lastname: data.contact && data.contact.lastname,
        email: data.contact && data.contact.email,
        phone: data.contact && data.contact.phone,
        appDownloadStatus:
          data.contact && data.contact.appDownloadStatus === "Invited"
            ? true
            : false,
        type: data.contact && data.contact.type,
        isPayee: data.contact && data.contact.isPayee,
        organisationDetails:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.organisationName
            ? true
            : false,
        organisationName:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.organisationName,
        gst:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.gst,
        address1:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.address1,
        address2:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.address2,
        city:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.city,
        state:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.state,
        country:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.country,
        zipcode:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.zipcode,
        organisationEmail:
          data.contact &&
          data.contact.organisationDetails &&
          data.contact.organisationDetails.organisationEmail,
      });
    }
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
