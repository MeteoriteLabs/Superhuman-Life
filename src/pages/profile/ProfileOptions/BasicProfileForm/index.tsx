import { useState, useContext } from 'react';
import Form from "@rjsf/core";
import { Button, Col, Container, Row } from 'react-bootstrap';
import { schema, widgets } from "../../profileSchema";
import {
    FETCH_USER_PROFILE_DATA,
    UPDATE_USER_PROFILE_DATA,
    UPDATE_ADDRESS_DATA,
    CREATE_ADDRESS,
    DELETE_ADDRESS,
    CREATE_EDUCATION_DETAILS,
    UPDATE_EDUCATION_DETAILS,
    DELETE_EDUCATION_DETAILS,
  } from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";

export default function BasicProfileForm() {
    const auth = useContext(AuthContext);
    const profileJson: { [name: string]: any } = require("../../Profile.json");
    const [step] = useState<number>(1);
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

  function callEdit(r: any) {
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
    Edit();
  }

  const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
    onCompleted: (r: any) => {},
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
    onCompleted: callEdit,
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: callEdit,
  });
  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: (data: any) => {},
  });

  function EditAddressAnd(addressData) {
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

  function Edit() {
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
    onCompleted: callEdit,
  });
  const [updateEducationData] = useMutation(UPDATE_EDUCATION_DETAILS, {
    onCompleted: callEdit,
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

    EditAddressAnd(addressData);
  }

    return (
        <Container className="mt-5">
            <Row className="mt-3 ml-3 inline">
                <Col lg={10}><h5>Basic Profile</h5></Col>
                <Col lg={2}><Button variant="outline-dark">Edit</Button></Col>
            </Row>
            <hr />
            {/* <Form className="m-5">
            <Form.Row>
                <Form.Group as={Col} controlId="formBasicName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formBasicDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control type="text" placeholder="Designation" />
            </Form.Group>

            <Form.Group controlId="formBasicAbout">
                <Form.Label>About</Form.Label>
                <FormControl as="textarea" aria-label="With textarea" />
            </Form.Group>
            
            <Form.Row>
                <Form.Group as={Col} controlId="formGridContact">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="number" placeholder="Contact" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formBasicWebsite">
                <Form.Label>Website</Form.Label>
                <Form.Control type="text" placeholder="Website" />
            </Form.Group>

            <Button variant="success" type="submit">
                Save
            </Button>
        </Form> */}

                <Form
                  uiSchema={schema}
                  schema={profileJson[step.toString()]}
                //   ref={formRef}
                //   onSubmit={({ formData }: any) => submitHandler(formData)}
                  formData={webpageDetails}
                  widgets={widgets}
                />
            {/* <Form
                // schema={BasicProfile}
                schema={profileJson[step.toString()]}
                //  uiSchema={uiSchema}
                // formData={formData}
                widgets={widgets}
            >
            </Form> */}

        </Container>
    )
}

