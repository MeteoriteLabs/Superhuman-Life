import React from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  Row
} from "react-bootstrap";
import { MiniLobbyComponent } from "../../pages/dashboard/mini-lobby/LobbyPopover";
import { NotificationOption } from "./NavbarOptions/Notifications";
import { ProfileOption } from "./NavbarOptions/ProfileOption";
import ToggleSideBarMenu from "./NavbarOptions/ToggleSideBarMenu";
import './topNavbar.css';

export function AuthenticatedNav() {

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

          {/* notification option */}
          <NotificationOption />

          {/* mini lobby option */}
          <MiniLobbyComponent />

          {/* profile option */}
          <ProfileOption />
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav navbarScroll" className="justify-content-end">

          <Nav navbarScroll>
            {/* sidebar menu options for small screen */}
            <ToggleSideBarMenu />
          </Nav>
        </Navbar.Collapse>

        {/* change maker logo */}
        <Navbar.Collapse className="justify-content-end d-none d-lg-block">
          <Navbar.Text>
            <h5 className="text-light">#BeAChangeMaker</h5>
          </Navbar.Text>
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
