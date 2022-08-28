import { useState, useContext, useRef } from 'react';
import Form from "@rjsf/core";
import { schema, widgets } from "../../profileSchema";
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';

export default function BasicProfileForm() {
  let [isFormSubmitted, setIsFormSubmitted] = useState(false);
  let [isFormSubmissionFailed, setIsFormSubmissionFailed] = useState(false);
  const formRef = useRef<any>(null);
  const auth = useContext(AuthContext);
  const profileJson: { [name: string]: any } = require("./BasicProfile.json");
  const [webpageDetails, setWebPageDetails] = useState<any>({});
  const [profileData, setProfileData] = useState<any>();

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      const flattenData = flattenObj({ ...r });
      FillDetails(flattenData.usersPermissionsUser);
    },
  });

  const [updateProfile, { error }] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => { setIsFormSubmitted(!isFormSubmitted); },
  });

  if (error) {
    setIsFormSubmissionFailed(!isFormSubmissionFailed);
  }

  function updateBasicDetails(frm: any) {
    console.log(frm.formData.addresses);
    updateProfile({
      variables: {
        id: auth.userid,
        data: profileData ? profileData : {
          First_Name: frm.formData.First_Name,
          About_User: frm.formData.About_User,
          about_mini_description: frm.formData.about_mini_description,
          Phone_Number: frm.formData.Phone_Number,
          Photo_ID: frm.formData.Photo_ID,
          Photo_profile_banner_ID: frm.formData.Photo_profile_banner_ID
        },
      },
    });
  }

  function OnSubmit(frm: any) {
    setProfileData(frm);
    updateBasicDetails(frm);
  }

  //fillDetails
  function FillDetails(data: any) {
    if (data) {
      setWebPageDetails({ ...data });
    }
  }

  return (
    <Col md={{span:8, offset: 2}}>
      <Form
        uiSchema={schema}
        schema={profileJson}
        ref={formRef}
        onSubmit={(frm: any) => { OnSubmit(frm) }}
        formData={webpageDetails}
        widgets={widgets}
      />

      {/* success toaster notification */}
      {isFormSubmitted ?
        <Toaster heading="Success" textColor="text-success" headingCSS="mr-auto text-success" msg="Basic Profile details has been updated" />
        : null}

      {/* failure toaster notification */}
      {isFormSubmissionFailed ?
        <Toaster heading="Failed" textColor="text-danger" headingCSS="mr-auto text-danger" msg="Basic Profile details has not been updated" />
        : null}

    </Col>
  )
}

