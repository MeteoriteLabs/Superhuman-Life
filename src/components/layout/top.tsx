import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import authContext from "../../context/auth-context";
import { Container, Nav, Navbar, Badge } from "react-bootstrap";
import { MiniLobbyComponent } from "../../pages/dashboard/mini-lobby/LobbyPopover";
import { ProfileOption } from "./NavbarOptions/ProfileOption";
import { Link } from "react-router-dom";
import "./topNavbar.css";
import { GET_CHANGEMAKER_NOTIFICATION } from "./queries";
import { flattenObj } from "../../components/utils/responseFlatten";

export function AuthenticatedNav() {
  const auth = useContext(authContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    // eslint-disable-next-line
    data: get_changemaker_notifications,
    // eslint-disable-next-line
    refetch: refetch_changemaker_notifications,
  } = useQuery(GET_CHANGEMAKER_NOTIFICATION, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setNotifications(flattenData.changemakerNotifications);
    },
  });

  useEffect(()=>{
    refetch_changemaker_notifications();
     // eslint-disable-next-line
  },[notifications]);
  
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
        {/* brand logo for large screen */}
        <Navbar.Brand href="/" className="d-none d-lg-block">
          <img
            className="d-inline-block align-top"
            src="/logo.svg"
            alt="brand"
          />
        </Navbar.Brand>

        {/* brand logo for small screen */}
        <Navbar.Brand href="/" className="d-sm-block d-lg-none">
          <img
            className="d-inline-block align-top"
            src="/assets/navbar_icons/sapiensLogoSmallScreen.svg"
            alt="brand"
          />
        </Navbar.Brand>

        {/* change maker logo */}
        <Navbar.Collapse className="justify-content-end d-none d-lg-block">
          <Navbar.Text>
            <h5 className="text-light">#BeAChangeMaker</h5>
          </Navbar.Text>
        </Navbar.Collapse>

        {/* notification, lobby , profile options for small screen */}
        <Nav.Item className="d-lg-none d-sm-block ">
          <Link to={"/notifications"}>
            <img
              src="/assets/navbar_icons/notificationIcon.svg"
              alt="notification"
              style={{ height: "20px" }}
            />
             {notifications.length ?
            <Badge
              className="bg-danger text-white ml-3 rounded-circle"
              style={{
                fontSize: "1rem",
                position: "absolute",
                left: "34vw",
                top: "1vh",
              }}
            >
              {notifications.length}
            </Badge> : null}
          </Link>
        </Nav.Item>

        <Nav.Item className="d-lg-none d-sm-block  ">
          <MiniLobbyComponent />
        </Nav.Item>

        <Nav.Item className="d-lg-none d-sm-block  ">
          <ProfileOption />
        </Nav.Item>

        {/* notification, lobby and profile options for large screen */}
        <Navbar.Collapse className="justify-content-end text-white d-none d-lg-block ">
          <Link to={"/notifications"}>
            <img
              src="/assets/navbar_icons/notificationIcon.svg"
              alt="notification"
              style={{ height: "20px", width: "25px" }}
            />
            {notifications.length ?
            <Badge
              className="bg-danger text-white ml-3 rounded-circle"
              style={{
                fontSize: "1rem",
                position: "absolute",
                right: "8vw",
                top: "1vh",
              }}
            >
              {notifications.length}
            </Badge> : null}
          </Link>
          <MiniLobbyComponent />
          <ProfileOption />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

// unauthorised user
export function UnauthenticatedNav() {
  return (
    <Navbar bg="light" className="shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="text-muted">
          <strong>SAPIEN SYSTEMS</strong>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
