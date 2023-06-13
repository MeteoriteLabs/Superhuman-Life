import React, { useState, useContext, useRef } from 'react';
import Form from "@rjsf/core";
import { widgets } from "../../profileSchema";
import { FETCH_USER_PROFILE_DATA, FETCH_USERS_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';
import { phoneCustomFormats, phoneTransformErrors } from '../../../../components/utils/ValidationPatterns';
import UploadImageToS3WithNativeSdk from "../../../../components/upload/upload";

interface UsersPermissionsUser {
  data: {
    attributes: {
      About_User: string;
      Clubhouse_URL: string;
      Document_Verified: boolean;
      Facebook_URL: string;
      First_Name: string;
      Last_Name: string;
      LinkedIn_URL: string;
      Phone_Number: string;
      Photo_ID: string;
      Photo_profile_banner_ID: string;
      Twitter_URL: string;
      Verification_ID: string;
      Website_URL: string;
      Youtube_URL: string;
      about_mini_description: string;
    };
    addresses: {
      data: {
        attributes: {
          House_Number: string;
          Title: string;
          address1: string;
          address2: string;
          city: string;
          country: string;
          is_primary: boolean;
          state: string;
          type: string;
          type_address: string;
          zipcode: string;
        };
        id: string;
      }[];
    };
    designations: {
      data: {
        attributes: {
          Designation_title: string;
          description: string;
        };
        id: string;
      }[];
    };
    educational_details: {
      data: {
        attributes: {
          Institute_Name: string;
          Specialization: string;
          Type_of_degree: string;
          Year: string;
        };
        id: string;
      }[];
    };
    email: string;
    instagram_url: string;
    updatedAt: string;
  };
  id: string;
  __typename: string;
}

type FlattenData = {
  usersPermissionsUser: UsersPermissionsUser;
};

const BasicProfileForm: React.FC = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const auth = useContext(AuthContext);
  const profileJson: any = require("./BasicProfile.json");
  const [webpageDetails, setWebPageDetails] = useState<UsersPermissionsUser>({} as UsersPermissionsUser);

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
          removePicture={
            () => {
              updateProfile({
                variables: {
                  id: auth.userid,
                  data: {
                    Photo_ID: null
                  },
                },refetchQueries:[FETCH_USERS_PROFILE_DATA]
              });
            }
          }
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

  const fetch = useQuery<UsersPermissionsUser>(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (response) => {
      const flattenData: FlattenData = flattenObj({ ...response });
      FillDetails(flattenData.usersPermissionsUser);
    },
  });

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: () => { setIsFormSubmitted(!isFormSubmitted); fetch.refetch(); }, refetchQueries: [FETCH_USER_PROFILE_DATA]
  });

  function updateBasicDetails(frm: any) {

    updateProfile({
      variables: {
        id: auth.userid,
        data: {
          First_Name: frm.formData.First_Name && frm.formData.First_Name !== '' ? frm.formData.First_Name : null,
          Last_Name: frm.formData.Last_Name && frm.formData.Last_Name !== '' ? frm.formData.Last_Name : null,
          About_User: frm.formData.About_User && frm.formData.About_User !== '' ? frm.formData.About_User : null,
          about_mini_description: frm.formData.about_mini_description  && frm.formData.about_mini_description !== '' ? frm.formData.about_mini_description : null,
          Phone_Number: frm.formData.Phone_Number && frm.formData.Phone_Number !== '' ? frm.formData.Phone_Number : null,
          Photo_ID: frm.formData.Photo_ID && frm.formData.Photo_ID !== '' ? frm.formData.Photo_ID : null,
          Website_URL: frm.formData.Website_URL && frm.formData.Website_URL !== '' ? frm.formData.Website_URL : null
        },
      },
    });
  }

  function OnSubmit(frm: any) {
    updateBasicDetails(frm);
  }

  //fillDetails
  function FillDetails(data: UsersPermissionsUser) {
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
          onSubmit={(frm: any) => { OnSubmit(frm);}}
          formData={webpageDetails}
          widgets={widgets}
          customFormats={phoneCustomFormats}
          transformErrors={phoneTransformErrors}
          showErrorList={false}
        />
      </Col>

      {/* success toaster notification */}
      {isFormSubmitted ?
        <Toaster handleCallback={() => setIsFormSubmitted(!isFormSubmitted)} type="success" msg="Basic Profile details has been updated" />
        : null}

    </>
  )
}

export default BasicProfileForm;
