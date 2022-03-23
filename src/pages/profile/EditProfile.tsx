import React, { useContext, useState } from "react";
import {
  FETCH_USER_PROFILE_DATA,
  UPDATE_USER_PROFILE_DATA,
  UPDATE_ADDRESS_DATA,
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  CREATE_EDUCATION_DETAILS,
  UPDATE_EDUCATION_DETAILS,
  DELETE_EDUCATION_DETAILS,
} from "./queries/queries";
import { useMutation, useQuery } from "@apollo/client";

import BasicProfile from "./BasicProfile";

import AuthContext from "../../context/auth-context";

import { schema, widgets } from "./profileSchema";

import { flattenObj } from "../../components/utils/responseFlatten";

function EditProfile() {
  const auth = useContext(AuthContext);
  const profileJson: { [name: string]: any } = require("./Profile.json");
  const [webpageDetails, setWebPageDetails] = useState<any>({});
  const [addressID, setAddressID] = useState<any>([]);
  const [educationID, setEducationID] = useState<any>([]);

  const [profileData, setProfileData] = useState<any>();

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      const flattenData = flattenObj({ ...r });
      console.log(flattenData);
      FillDetails(flattenData.usersPermissionsUser);

      setAddressID(
        r.usersPermissionsUser.data.attributes.addresses.data.length
          ? r.usersPermissionsUser.data.attributes.addresses.data.map(
              (address: any) => address.id
            )
          : null
      );
      setEducationID(
        r.usersPermissionsUser.data.attributes.educational_details.data.length
          ? r.usersPermissionsUser.data.attributes.educational_details.data.map(
              (eduId: any) => eduId.id
            )
          : null
      );
    },
  });

  function callEditProfilepage(r: any) {
    let id: any = "";
    let edId: any = "";

    if ("updateAddress" in r) {
      id = r.updateAddress.data.id;
      profileData.addresses.push(id);
    } else if ("createAddress" in r) {
      id = r.createAddress.data.id;
      profileData.addresses.push(id);
    } else if ("createEducationalDetail" in r) {
      edId = r.createEducationalDetail.data.id;
      profileData.educational_details.push(edId);
    } else {
      edId = r.updateEducationalDetail.data.id;
      profileData.educational_details.push(edId);
    }

    console.log(profileData);
    EditProfilepage();
  }

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => {},
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
    onCompleted: callEditProfilepage,
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: callEditProfilepage,
  });
  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: (data: any) => {},
  });

  function EditAddressAndProfilePage(addressData) {
    let currentID = "";

    addressData.forEach((address: any) => {
      currentID = address.id;
      delete address.id;
      delete address.__typename;

      if (!currentID) {
        createAddress({
          variables: {
            data: address,
          },
        });
      } else {
        updateAddress({
          variables: {
            id: currentID,
            data: address,
          },
        });
      } //end else statement
    }); //end forEach
  } //end EditAddressAndProfile function

  function EditProfilepage() {
    updateProfile({
      variables: {
        id: auth.userid,
        data: profileData ? profileData : {},
      },
    });
  }
  function DeleteUserAddress(data: any) {
    data.forEach((id: any) =>
      deleteAddress({
        variables: {
          id: id,
        },
      })
    );
  }

  const [createEducationData] = useMutation(CREATE_EDUCATION_DETAILS, {
    onCompleted: callEditProfilepage,
  });
  const [updateEducationData] = useMutation(UPDATE_EDUCATION_DETAILS, {
    onCompleted: callEditProfilepage,
  });
  const [deleteEducationData] = useMutation(DELETE_EDUCATION_DETAILS, {
    onCompleted: (data: any) => {},
  });

  function Create_Edit_EducationData(data: any) {
    let educationDataID = "";

    // eslint-disable-next-line array-callback-return
    data.map((educationData) => { 
      educationDataID = educationData.id;

      delete educationData.id;
      delete educationData.__typename;

      if (!educationDataID) {
        createEducationData({
          variables: {
            data: educationData,
          },
        });
      } else {
        updateEducationData({
          variables: {
            id: educationDataID,
            data: educationData,
          },
        });
      }
    }); //end forEach
  } //end create_edit education data function

  function DeleteUserEducationData(data: any) {
    data.forEach((id: any) =>
      deleteEducationData({
        variables: {
          id: id,
        },
      })
    );
  } //end DeleteUserEducationData function

  function FillDetails(data: any) {
    let newAddressData = data.addresses.map((address) =>
      JSON.stringify(address)
    );

    let newEducationData = data.educational_details.map((education) =>
      JSON.stringify(education)
    );

    delete data.addresses;
    delete data.educational_details;

    data.addresses = newAddressData;
    data.educational_details = newEducationData;

    if (data) {
      setWebPageDetails({ ...data });
    }
  } //fillDetails

  function OnSubmit(frm: any) {
    let addressData = frm.addresses.map((address: any) => JSON.parse(address));

    let educationData = frm.educational_details.map((education: any) =>
      JSON.parse(education)
    );

    let addressDataArray = addressData.map((id) => id.id);
    let educationDataArray = educationData.map((id) => id.id);

    let addressIDNotSubmitted = addressID
      ? addressID.filter((x: any) => !addressDataArray.includes(x))
      : null;

    let educationIDNotSubmitted = educationID
      ? educationID.filter((id: any) => !educationDataArray.includes(id))
      : null;

    console.log(educationIDNotSubmitted);
    if (
      addressIDNotSubmitted !== null &&
      addressIDNotSubmitted[0] !== undefined
    ) {
      DeleteUserAddress(addressIDNotSubmitted);
    }

    if (
      educationIDNotSubmitted !== null &&
      educationIDNotSubmitted[0] !== undefined
    ) {
      DeleteUserEducationData(educationIDNotSubmitted);
    }

    if (educationData.length !== 0) {
      Create_Edit_EducationData(educationData);
    }

    delete frm.addresses;
    delete frm.educational_details;
    delete frm.__typename;

    setProfileData(frm);
    frm.addresses = [];
    frm.educational_details = [];

    EditAddressAndProfilePage(addressData);
  }

  return (
    <>
      <BasicProfile
        name="Basic Profile"
        formUISchema={schema}
        formSchema={profileJson}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        formData={webpageDetails}
        widgets={widgets}
      />
    </>
  );
}

export default React.forwardRef(EditProfile);
