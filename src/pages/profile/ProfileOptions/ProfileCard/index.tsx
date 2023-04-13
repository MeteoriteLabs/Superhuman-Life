import React, { useContext, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context";
import { useQuery } from "@apollo/client";
import { FETCH_USER_PROFILE_DATA } from "../../queries/queries";
import DisplayImage from "../../../../components/DisplayImage/index";
import "./profilecard.css";

interface UserData {
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
   // eslint-disable-next-line
  addresses: any;designations: any;educational_details: any;
  email: string;
  instagram_url: string;
  updatedAt: string;
  __typename: string;
}

const ProfileCard: React.FC = () => {
  const auth = useContext(AuthContext);
  const [profileData, setProfileData] = useState<UserData>({} as UserData);

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (response) => {
      setProfileData(response.usersPermissionsUser.data.attributes);
    },
  });

  return (
    <Container className="justify-content-center rounded shadow-lg">
      {/* user details */}
      <Row
        lg={12}
        sm={12}
        style={{ backgroundColor: "#000" }}
        className="pb-3 pt-3"
      >
        {/* profile picture */}
        <Col className="pb-1" md={{ span: 2, offset: 1 }} sm={12}>
          <DisplayImage
            imageName={"Photo_ID" in profileData ? profileData.Photo_ID : null}
            defaultImageUrl="assets/image_placeholder.svg"
            imageCSS="rounded-circle profile_picture text-center img-fluid"
          />
        </Col>

        {/* user information */}
        <Col md={{ span: 7, offset: 1 }} sm={12} className="p-4">
          <h3 className="text-white">
            {"First_Name" in profileData ? profileData.First_Name : null}{" "}
            {"Last_Name" in profileData ? profileData.Last_Name : null}
          </h3>
          <h5 className="text-white">
            {profileData &&
            profileData.designations &&
            profileData.designations.data.length > 0
              ? profileData.designations.data[0].attributes.Designation_title
              : null}
          </h5>
          <h6 className="text-white">
            {profileData ? profileData.About_User : null}
          </h6>
        </Col>
        <Col md={{ span: 1 }}>
          {profileData ? (
            profileData.Document_Verified === true ? (
              <img
                title="Document Verified"
                src="assets/verified.svg"
                alt="verified"
              />
            ) : (
              <img
                title="Account verification pending"
                src="assets/profile_icons/pending.svg"
                alt="Account verification pending"
              />
            )
          ) : null}
        </Col>
      </Row>

      {/* user contact details */}
      <Row className="pt-3">
        {profileData ? (
          <Col sm={12} lg={{ span: 4, offset: 2 }}>
            <img
              src="assets/profile_icons/telephone.svg"
              alt="phone"
              className="pr-2 icons"
            />{" "}
            {profileData.Phone_Number}
          </Col>
        ) : null}
        {profileData ? (
          <Col sm={12} lg={{ span: 4, offset: 1 }}>
            <img
              src="assets/profile_icons/website.svg"
              alt="website"
              className="pr-2 icons"
            />{" "}
            {profileData.Website_URL}{" "}
          </Col>
        ) : null}
      </Row>
      <Row className="pb-3">
        {profileData ? (
          <Col sm={12} lg={{ span: 4, offset: 2 }}>
            <img
              src="assets/profile_icons/email.svg"
              alt="email"
              className="pr-2 icons"
            />{" "}
            {profileData.email}{" "}
          </Col>
        ) : null}
        {profileData &&
        profileData.addresses &&
        profileData.addresses.data.length > 0 ? (
          <Col sm={12} lg={{ span: 4, offset: 1 }}>
            <img
              src="assets/profile_icons/location.svg"
              alt="location"
              className="pr-2 icons"
            />{" "}
            {profileData.addresses.data[0].attributes.city}{" "}
          </Col>
        ) : null}
      </Row>
    </Container>
  );
}

export default ProfileCard;