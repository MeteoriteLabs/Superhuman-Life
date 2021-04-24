import { Button, Container, DropdownButton, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function TopNav() {
  return (
    <Navbar bg="dark" className="shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="text-muted">
          <strong>SAPIEN SYSTEMS</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse className="justify-content-end" id="navbar">
          <Nav className="d-lg-none">
            <NavLink className="nav-link" to="/home">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/chats">
              Chats
            </NavLink>
            <NavLink className="nav-link" to="/clients">
              Clients
            </NavLink>
            <NavLink className="nav-link" to="/packages">
              Packages
            </NavLink>
            <NavLink className="nav-link" to="/profile">
              Profile
            </NavLink>
            <NavLink className="nav-link" to="/schedule">
              Schedule
            </NavLink>
            <NavLink className="nav-link" to="/settings">
              Settings
            </NavLink>
            <Nav.Link>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Item className="d-none d-lg-block">
          <DropdownButton variant="dark" title={<i className="fas fa-bell"></i>} drop="left">
            <Dropdown.Header>Notifications</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="1">PT #18 has been created</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" as="small">More Notifications</Dropdown.Item>
          </DropdownButton>
        </Nav.Item>
        <Nav.Item className="d-none d-lg-block">
          <abbr title="Sign Out">
            <Button variant="dark">
              <i className="fas fa-sign-out-alt"></i>
            </Button>
          </abbr>
        </Nav.Item>
      </Container>
    </Navbar>
  );
}
