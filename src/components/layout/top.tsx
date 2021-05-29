import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Container, DropdownButton, Dropdown, Nav, Navbar } from "react-bootstrap";
import authContext from "../../context/auth-context";

export function AuthenticatedNav() {
  const auth = useContext(authContext);

  return (
    <Navbar bg="dark" className="shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">
          <img width="100%" src="/logo.svg" alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse className="justify-content-end" id="navbar">
          <Nav className="d-lg-none">
            <NavLink className="nav-link" to="/home">Home</NavLink>
            <NavLink className="nav-link" to="/chats">Chats</NavLink>
            <NavLink className="nav-link" to="/clients">Clients</NavLink>
            <NavLink className="nav-link" to="/packages">Packages</NavLink>
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
            <NavLink className="nav-link" to="/resources">Resources</NavLink>
            <NavLink className="nav-link" to="/schedule">Schedule</NavLink>
            <NavLink className="nav-link" to="/settings">Settings</NavLink>
            <Nav.Link>Logout</Nav.Link>
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
          <DropdownButton variant="dark" title={<i className="fas fa-th"></i>}>
            <Dropdown.Header>Other Apps</Dropdown.Header>
          </DropdownButton>
        </Nav.Item>
        <Nav.Item className="d-none d-lg-block">
          <DropdownButton
            variant="dark"
            title={<img src="/assets/avatar-1.jpg" height="42" className="rounded-circle" alt="avatar" />}
            drop="left"
          >
            <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
            <Dropdown.Item onClick={() => auth.logout()}>Sign Out</Dropdown.Item>
          </DropdownButton>
        </Nav.Item>
      </Container>
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
            <NavLink className="nav-link" to="/home">Home</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/faq">FAQs</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
            <NavLink className="btn btn-danger" to="/login">Login</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
