import { useState, useRef, useContext } from "react";

import { Link } from "react-router-dom";
import {
  Tabs,
  Tab,
  Row,
  Col,
  Container,
  Card,
  Image,
  Button,
} from "react-bootstrap";
import "./profile.css";
import AuthContext from "../../context/auth-context";
import { useQuery } from "@apollo/client";
import { FETCH_USER_PROFILE_DATA } from "./queries/queries";
import ellipse from "./ellipse.svg";
import ChangePasswordPage from '../changePassword';

import EditProfile from "./EditProfile";
import ProfileCard from "./ProfileOptions/ProfileCard";

export default function ProfilePage() {
  const auth = useContext(AuthContext);
  const [key, setKey] = useState("profile");
  const editProfileComponent = useRef<any>(null);
  const [profileData, setProfileData] = useState<any>({});

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      setProfileData(r.usersPermissionsUser.data.attributes);
    },
  });

  return (
    <>
      <Tabs
        id="controlled-tab"
        activeKey={key}
        onSelect={(k: any) => setKey(k)}
        className="mb-3 d-flex justify-content-center"
      >
        <Tab eventKey="profile" title="Profile">
          {/* <Container fluid>
            <Row className="">
              <Card>
                <div>
                  {/* Settings *
                  <Col
                    md={12}
                    className="rounded"
                    style={{ backgroundColor: "#c4c4c4" }}
                  >
                    <Col
                      md={{ offset: 11, span: 1 }}
                      className="mb-1 d-flex justify-content-end"
                    >
                      <Button variant="" className="p-1">
                        <span>&#8942;</span>
                      </Button>
                    </Col>
                    <Col className="mt-5">
                      <Row>
                        <Col md={{ offset: 2, span: 10 }} className="mt-5 p-1">
                          <Col className="mb-2 p-0">
                            <b>
                              {" "}
                              {profileData
                                ? `${profileData.First_Name} ${profileData.Last_Name}`
                                : "Full Name"}
                            </b>
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={{ offset: 2, span: 6 }}>
                        <p>Designation</p>
                      </Col>
                      {/* Number *
                      <Col
                        md={{ offset: 2, span: 2 }}
                        className=" d-flex justify-content-end"
                      >
                        <b>
                          {" "}
                          {profileData
                            ? `+${profileData.Phone_Number}`
                            : "Phone Number"}
                        </b>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <div className="image-wrapper">
                      <Image src={ellipse} />
                    </div>
                  </Col>

                  {/* About *
                  <Col md={{ offset: 3, span: 6 }} className="mt-5">
                    <p className="lead">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                    </p>
                  </Col>
                  {/* Social Media, Link, Icon Share *
                  <Col md={12} className="mt-5">
                    <Row>
                      <Col md={{ offset: 0, span: 3 }}>
                        <Row className="p-0">
                          <Col className="">Link</Col>
                          <Col className="p-0">Face</Col>
                          <Col className="p-0">
                            <Link
                              to={
                                profileData.instagram_url
                                  ? profileData.instagram_url
                                  : ""
                              }
                              style={{ textDecoration: "none" }}
                            >
                              Insta
                            </Link>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <p className="text-center">sapien@sapien.com</p>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        Icon Share
                      </Col>
                    </Row>
                  </Col>
                </div>
              </Card>
            </Row>

            <Row className="my-3">
              <Col md={{ offset: 9, span: 3 }}>
                Visibility to open community
              </Col>
            </Row>
            <Row className="my-3">
              <Col className="p-2" md={12}>
                <EditProfile ref={editProfileComponent}></EditProfile>
              </Col>
            </Row>
          </Container> */}
          <ProfileCard/>
        </Tab>

        <Tab eventKey="collaborations" title="Collaborations">
          Collaborations
        </Tab>
        <Tab eventKey="myclientapp" title=" My Client App">
          My Client App
        </Tab>
        <Tab eventKey="settings" title="Settings">
          Settings
        </Tab>
        <Tab eventKey="password" title="Password">
          <ChangePasswordPage />
        </Tab>
      </Tabs>
    </>
  );
}
