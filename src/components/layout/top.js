import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function TopNav() {
  return (
    <Navbar bg="dark" className="shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="text-muted">
          <strong>SAPIEN SYSTEMS</strong>
        </Navbar.Brand>
        <Navbar.Text className="ml-5 text-white">Welcome, John Doe</Navbar.Text>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse className="justify-content-end" id="navbar">
          <Nav className="d-lg-none">
            <NavLink className="nav-link" to="/home">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/clients">
              Clients
            </NavLink>
            <NavLink className="nav-link" to="/schedule">
              Schedule
            </NavLink>
            <NavLink className="nav-link" to="/chats">
              Chats
            </NavLink>
            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
            <Nav.Link>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Item className="d-none d-lg-block text-white mr-2">
          <i className="far fa-bell"></i>
        </Nav.Item>
        <NavDropdown
          className="d-none d-lg-block"
          title={<i className="fas fa-user-circle"></i>}
        >
          <NavLink className="dropdown-item" to="/settings">
            Settings
          </NavLink>
          <NavDropdown.Item>Logout</NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
}
