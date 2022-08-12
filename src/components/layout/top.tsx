import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Alert
} from "react-bootstrap";
import { MiniLobbyComponent } from "../../pages/dashboard/mini-lobby/LobbyPopover";
import { NotificationOption } from "./NavbarOptions/Notifications";
import { ProfileOption } from "./NavbarOptions/ProfileOption";
import ToggleSideBarMenu from "./NavbarOptions/ToggleSideBarMenu";
import './topNavbar.css';

export function AuthenticatedNav() {
  const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);

  const { pathname } = useLocation<any>();

  useEffect(() => {
    getSideNavStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getSideNavStatus = () => {
    const currentSideNavStatus: boolean =
      pathname !== "/lobby" && pathname !== "/website" ? true : false;
    setSideNavStatus(currentSideNavStatus);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">

        {/* brand logo for large screen */}
        <Navbar.Brand href="/" className="d-none d-lg-block">
          <img className="d-inline-block align-top" src="/logo.svg" alt="brand" />
        </Navbar.Brand>

        {/* brand logo for small screen */}
        <Navbar.Brand href="/" className="d-sm-block d-lg-none">
          <img className="d-inline-block align-top" src="/assets/navbar_icons/sapiensLogoSmallScreen.svg" alt="brand" />
        </Navbar.Brand>

        {/* notification, lobby , profile options for small screen */}
        <Nav.Item className="d-lg-none d-sm-block ml-auto ">
          <NotificationOption />
        </Nav.Item>

        <Nav.Item className="d-lg-none d-sm-block ml-auto ">
          <MiniLobbyComponent />
        </Nav.Item>

        <Nav.Item className="d-lg-none d-sm-block ml-auto ">
          <ProfileOption />
        </Nav.Item>

        {/* sidebar menu options for small screen */}

        {
          sideNavStatus ? <Navbar.Toggle aria-controls="responsive-navbar-nav" /> : null}
        {
          sideNavStatus ?
            <Navbar.Collapse id="responsive-navbar-nav navbarScroll" className="justify-content-end">
              <Nav navbarScroll>
                <ToggleSideBarMenu />
              </Nav>
            </Navbar.Collapse>
            : null
        }

        {/* change maker logo */}
        <Navbar.Collapse className="justify-content-center d-none d-lg-block">
          <Navbar.Text>
            <h5 className="text-light">#BeAChangeMaker</h5>
          </Navbar.Text>
        </Navbar.Collapse>

        {/* notification, lobby and profile options for large screen */}
        <Navbar.Collapse className="justify-content-end text-white d-none d-lg-block ">
          <NavDropdown
            alignRight
            flip
            title={<img
            src="/assets/navbar_icons/notificationIcon.svg"
            alt="notification"
            className="img-responsive "
            style={{ height: '20px', width: '20px' }}
          />}
            id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">
              <Row className="justify-content-between">
                <div className="float-left"><b>Notification</b></div>
                <div className="float-right"><small>Clear All</small></div>
              </Row>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              <small>Today</small>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">
              <Row>

                <Alert variant={'dark'}>
                  <Row className="justify-content-end">
                    <div className="float-right"><small><img src="/assets/close.svg" alt="close icon" /></small></div>
                  </Row>
                  <Row className="justify-content-between">
                    <div className="float-left"><small><b>@username</b></small></div>
                    <div className="float-right"><small>07:00 AM</small></div>
                  </Row>
                  <Row className="justify-content-between">
                    <div>
                      This is a demo notification.
                    </div>
                  </Row>
                </Alert>

              </Row>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
            </NavDropdown.Item>
          </NavDropdown>
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
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse className="justify-content-end" id="navbar">
          <Nav>
            <NavLink className="nav-link" to="/home">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
            <NavLink className="nav-link" to="/faqs">
              FAQs
            </NavLink>
            <NavLink className="nav-link" to="/contact">
              Contact
            </NavLink>
            <NavLink className="btn btn-danger" to="/login">
              Login
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}
