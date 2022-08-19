import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  DropdownButton,
  Dropdown,
  Nav,
  Navbar,
} from "react-bootstrap";
import authContext from "../../context/auth-context";
import { MiniLobbyComponent } from "../../pages/dashboard/mini-lobby/LobbyPopover";
import './topNavbar.css';

export function AuthenticatedNav() {
  const auth = useContext(authContext);

  return (
    <Navbar bg="dark" className="shadow-sm top__navbar" expand="lg" fixed="top" variant="dark">
      <Navbar.Brand col-sm="true" href="/" className="text-white">
        <img className="d-inline-block align-top" src="/logo.svg" alt="brand" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar"/>
      <Navbar.Collapse className="justify-content-end" id="navbar">
        <Nav className="d-lg-none">
          <NavLink className="nav-link text-white" to="/home">
            Home
          </NavLink>
          <NavLink className="nav-link text-white" to="/schedule">
            My Schedule
          </NavLink>
          <NavLink className="nav-link text-white" to="/session">
            Session Manager
          </NavLink>
          <NavLink className="nav-link text-white" to="/clients">
            Clients
          </NavLink>
          <NavLink className="nav-link text-white" to="/bookings">
            Bookings
          </NavLink>
          <NavLink className="nav-link text-white" to="/offerings">
            Offerings
          </NavLink>
          <NavLink className="nav-link text-white" to="/resources">
            Resources
          </NavLink>
          <NavLink className="nav-link text-white" to="/finances">
            Finances
          </NavLink>
          <NavLink className="nav-link text-white" to="/communication">
            Communication
          </NavLink>
          <NavLink className="nav-link text-white" to="/settings">
            Settings
          </NavLink>
          <NavLink className="nav-link text-white" to="/profile">
            Profile
          </NavLink>
          <Nav.Link className="text-white">Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Nav.Item className="d-none d-lg-block">
        <DropdownButton variant="dark" title={<i className="fas fa-bell"></i>}>
          <Dropdown.Header>Notifications</Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item>PT #18 has been created</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as="small">More Notifications</Dropdown.Item>
        </DropdownButton>
      </Nav.Item>
      <Nav.Item className="d-none d-lg-block">
        <MiniLobbyComponent />
      </Nav.Item>
      <Nav.Item className="d-none d-lg-block mr-5 pr-5">
        <DropdownButton
          variant="dark"
          title={
            <img
              src="/assets/avatar-1.jpg"
              height="42"
              className="rounded-circle"
              alt="avatar"
            />
          }
        >
          <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
          <Dropdown.Item onClick={() => auth.logout()}>Sign Out</Dropdown.Item>
        </DropdownButton>
      </Nav.Item>
    </Navbar>
  );
}

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
