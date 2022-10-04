import { useState, useContext, useRef } from 'react';
import Form from "@rjsf/core";
import { widgets } from "../../profileSchema";
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';
import { phoneCustomFormats, phoneTransformErrors } from '../../../../components/utils/ValidationPatterns';
import UploadImageToS3WithNativeSdk from "../../../../components/upload/upload";

export default function BasicProfileForm() {
  let [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const formRef = useRef<any>(null);
  const auth = useContext(AuthContext);
  const profileJson: { [name: string]: any } = require("./BasicProfile.json");
  const [webpageDetails, setWebPageDetails] = useState<any>({});
  const [profileData, setProfileData] = useState<any>()
  // const [profilePicture, setProfilePicture] = useState<any>(null);

  const schema: any = {

    Photo_ID: {
      "ui:widget": (props: any) => (
        <UploadImageToS3WithNativeSdk
          value={props.value}
          onChange={(event: any) => {
            props.onChange(event);
          }}
          aspectRatio={"4:4"}
          allowImage={true}
          allowVideo={false}
          remove={() => {
            let temp = profileData;
            temp.Photo_ID = null;
            setProfileData(temp);
          }}
        />
      ),
      "ui:help": "Upload Profile Picture"
    },
    About_User: {
      "ui:placeholder": "Enter something about you",
      "ui:widget": "textarea",
      "ui:options": {
        rows: 3,
      },
    },
    First_Name: {
      "ui:placeholder": "Enter First Name",
    },
    Last_Name: {
      "ui:placeholder": "Enter Last Name",
    },
    about_mini_description: {
      "ui:placeholder": "Enter mini description",
    },
    Website_URL: {
      "ui:placeholder": "https://"
    },
    Phone_Number: {
      "ui:placeholder": "Enter your 10 digit contact number",
    }
  };


  const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      const flattenData = flattenObj({ ...r });
      FillDetails(flattenData.usersPermissionsUser);
    },
  });

  const [updateProfile, { error }] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => { setIsFormSubmitted(!isFormSubmitted); fetch.refetch(); }, refetchQueries: [FETCH_USER_PROFILE_DATA]
  });

  if (error) {
    return <Toaster heading="Failed" textColor="text-danger" headingCSS="mr-auto text-danger" msg="Basic Profile details has not been updated" />;
  }

  function updateBasicDetails(frm: any) {
    updateProfile({
      variables: {
        id: auth.userid,
        data: profileData ? profileData : {
          First_Name: frm.formData.First_Name,
          Last_Name: frm.formData.Last_Name,
          About_User: frm.formData.About_User,
          about_mini_description: frm.formData.about_mini_description,
          Phone_Number: frm.formData.Phone_Number,
          Photo_ID: frm.formData.Photo_ID,
          Website_URL: frm.formData.Website_URL
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
    <>
      <Col md={{ span: 8, offset: 2 }} className="pb-3">
        <Form
          uiSchema={schema}
          schema={profileJson}
          ref={formRef}
          onSubmit={(frm: any) => { OnSubmit(frm) }}
          formData={webpageDetails}
          widgets={widgets}
          customFormats={phoneCustomFormats}
          transformErrors={phoneTransformErrors}
          showErrorList={false}
        />
      </Col>

      {/* success toaster notification */}
      {isFormSubmitted ?
        <Toaster heading="Success" textColor="text-success" headingCSS="mr-auto text-success" msg="Basic Profile details has been updated" />
        : null}

    </>
  )
}

