import { Container, Col, Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  GET_AVAILABILITY,
  BOOKING_CONFIG,
  FETCH_USER_PROFILE_DATA,
} from "./queries";
import { useContext, useState } from "react";
import AuthContext from "../../context/auth-context";
import moment from "moment";
import { flattenObj } from "../../components/utils/responseFlatten";

interface Profile {
  updatedAt: string;
}

export default function SettingsPage() {
  const auth = useContext(AuthContext);
  const [changemakerAvailabilityData, setChangemakerAvailabilityData] =
    useState<string>();
  const [bookingUpdatedDate, setBookingUpdatedDate] = useState<string>();
  const [profileData, setProfileData] = useState<Profile>({} as Profile);

  useQuery(FETCH_USER_PROFILE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      setProfileData(r.usersPermissionsUser.data.attributes);
    },
  });

  useQuery(GET_AVAILABILITY, {
    variables: { id: auth.userid },
    onCompleted: (data: any) => {
      const flattenChangemakerAvailabilityData = flattenObj({
        ...data.changemakerAvailabilties,
      });

      if (flattenChangemakerAvailabilityData.length) {
        setChangemakerAvailabilityData(
          moment(flattenChangemakerAvailabilityData[0].updatedAt).format(
            "DD MMM YYYY"
          )
        );
      }
    },
  });

  useQuery(BOOKING_CONFIG, {
    variables: { id: auth.userid },
    onCompleted: (data: any) => {
      const flattenBookingsData = flattenObj({ ...data.bookingConfigs });

      if (flattenBookingsData.length) {
        setBookingUpdatedDate(
          moment(flattenBookingsData[0].updatedAt).format("DD MMM YYYY")
        );
      }
    },
  });

  return (
    <div>
      <h2>Settings</h2>
      <Container>
        <hr style={{ height: "12px" }} />

        <Row>
          {/* Availability Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer" }}
          >
            <Card
              className="shadow-lg bg-white rounded p-3 text-dark text-decoration-none"
              as={Link}
              to={"/availability"}
            >
              <Card.Body className="text-center">
                <img
                  src="/assets/settings/availability_setting.svg"
                  alt="booking"
                  height="32px"
                />
                <Card.Title className="pt-1">Availability Settings</Card.Title>
                <Card.Text>
                  <small>
                    Last Updated:{" "}
                    {changemakerAvailabilityData
                      ? changemakerAvailabilityData
                      : null}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking settings */}
          <Col className="pb-1 pt-2" md={{ span: 4, offset: 1 }} sm={12}>
            <Card
              className="shadow-lg bg-white rounded p-3 text-dark text-decoration-none"
              as={Link}
              to={"/bookingSettings"}
            >
              <Card.Body className="text-center">
                <img
                  src="/assets/settings/booking_settings.svg"
                  alt="booking"
                  height="32px"
                />
                <Card.Title className="pt-1">Booking Settings</Card.Title>
                <Card.Text>
                  <small>
                    Last updated:{" "}
                    {bookingUpdatedDate ? bookingUpdatedDate : null}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          {/* Account Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer", height: "100%" }}
          >
            <Card
              className="shadow-lg bg-white rounded p-3 text-dark text-decoration-none"
              as={Link}
              to={"/profile"}
            >
              <Card.Body className="text-center">
                <img
                  src="/assets/settings/account_settings.svg"
                  alt="account_settings"
                  height="32px"
                />
                <Card.Title className="pt-1">Account Settings</Card.Title>
                <Card.Text>
                  <small>
                    Last updated:{" "}
                    {profileData
                      ? moment(profileData.updatedAt).format("DD MMM YYYY")
                      : null}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Notification Settings */}
          <Col
            className="pb-1 pt-2"
            md={{ span: 4, offset: 1 }}
            sm={12}
            style={{ cursor: "pointer" }}
          >
            <Card className="shadow-lg bg-white rounded p-3 text-dark text-decoration-none">
              <Card.Body className="text-center">
                <img
                  src="/assets/profile_icons/notification.svg"
                  alt="notification"
                  height="32px"
                />
                <Card.Title className="pt-1">Notification Settings</Card.Title>
                <Card.Text>
                  <small>Last updated: 29 Aug 2022</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
