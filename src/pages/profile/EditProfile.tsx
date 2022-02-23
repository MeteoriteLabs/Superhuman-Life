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
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

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
  // const [flattenedData, setFlattenedData] = useState<any>();

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      console.log(r);
      const flattenData = flattenObj({ ...r });

      FillDetails(flattenData.usersPermissionsUser);

      setAddressID(
        flattenData.usersPermissionsUser.addresses.length
          ? flattenData.usersPermissionsUser.addresses.map(
              (address: any) => address.id
            )
          : null
      );
      setEducationID(
        flattenData.usersPermissionsUser.educational_details.length
          ? flattenData.usersPermissionsUser.educational_details.map(
              (educationData) => educationData.id
            )
          : null
      );
    },
  });

  console.log(educationID);

  function callEditProfilepage(r: any) {
    debugger;
    let id = "";
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
    onCompleted: (r: any) => {
      console.log(r);
    },
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
    onCompleted: callEditProfilepage,
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: callEditProfilepage,
  });
  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: (data: any) => {
      debugger;
      console.log("Deleted id ");
    },
  });

  function EditAddressAndProfilePage(addressData) {
    debugger;

    let currentID = "";

    addressData.forEach((address: any) => {
      currentID = address.id;
      delete address.id;
      if (currentID === "") {
        // currentID == ""

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
    debugger;
    console.log(profileData);
  } //end EditAddressAndProfile function

  function EditProfilepage() {
    console.log("edit message");
    debugger;
    console.log(profileData);

    updateProfile({
      variables: {
        id: auth.userid,
        data: profileData ? profileData : {},
      },
    });
  }
  function DeleteUserAddress(data: any) {
    console.log(data);
    debugger;
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
    onCompleted: (data: any) => {
      debugger;
      console.log("Deleted id ");
    },
  });

  function Create_Edit_EducationData(data: any) {
    debugger;

    let educationDataID = "";

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
    console.log(data);
    debugger;
    data.forEach((id: any) =>
      deleteEducationData({
        variables: {
          id: id,
        },
      })
    );
  } //end DeleteUserEducationData function

  function FillDetails(data: any) {
    // let newAddress = data.addresses.map((address) => JSON.stringify(address));
    // delete data.addresses;
    // data.addresses = newAddress;
    // console.log(data);

    //     address1: "Be Happy"
    // address2: "React"
    // city: "React"
    // country: "Be Happys"
    // id: "78"
    // state: "React"
    // type: "Be Happy"
    // zipcode: "React"

    delete data.addresses;
    let addresses = {
      id: "1",
      type: "Type form",
      address1: "Uthiru",
      address2: "React",
      city: "react",
      country: "kenya",
      state: "state form",
      zipcode: "zipcode form",
    };

    data.addresses = [addresses];

    debugger;
    if (data) {
      setWebPageDetails({ ...data });
    }
  } //fillDetails

  function OnSubmit(frm: any) {
    debugger;
    console.log(frm);

    let addressData = frm.addresses.map((address: any) => JSON.parse(address));
    let educationData = frm.educational_details.map((education: any) =>
      JSON.parse(education)
    );

    let addressDataArray = addressData.map((id) => id.id);
    let educationDataArray = educationData.map((id) => id.id);

    let addressIDNotSubmitted = addressID
      ? addressID.filter((x) => !addressDataArray.includes(x))
      : null;

    let educationIDNotSubmitted = educationID
      ? educationID.filter((id) => !educationDataArray.includes(id))
      : null;

    if (addressIDNotSubmitted) {
      DeleteUserAddress(addressIDNotSubmitted);
    }

    if (educationIDNotSubmitted) {
      DeleteUserEducationData(educationIDNotSubmitted);
    }

    // let EducationData = frm.educational_details;

    // EducationData.forEach((data) => console.log(data.id));

    // let newEducationDetail = EducationData.filter((x) => !x.id);

    Create_Edit_EducationData(educationData);

    delete frm.addresses;
    delete frm.educational_details;
    delete frm.__typename;

    console.log(frm);
    setProfileData(frm);
    frm.addresses = [];
    frm.educational_details = [];
    // EditAddressAndProfilePage(addressData);
  }

  console.log(webpageDetails);

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
