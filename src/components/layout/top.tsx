import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MiniLobbyComponent } from "../../pages/dashboard/mini-lobby/LobbyPopover";
import { ProfileOption } from "./NavbarOptions/ProfileOption";
import { Link } from "react-router-dom";
import "./topNavbar.css";

export function AuthenticatedNav() {
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
              style={{height: "20px"}}
            />
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
