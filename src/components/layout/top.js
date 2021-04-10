import { Button, Container, Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function TopNav() {
  return (
    <Navbar bg="dark" className="shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" className="text-muted">
          <strong>SAPIEN SYSTEMS</strong>
        </Navbar.Brand>
        <Navbar.Text className="ml-4 text-white">Welcome, John Doe</Navbar.Text>
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
        <Nav.Item className="d-none d-lg-block">
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">Notifications</Tooltip>}>
            <Button variant="dark">
              <i className="far fa-bell"></i>
            </Button>
          </OverlayTrigger>
        </Nav.Item>
        <Nav.Item className="d-none d-lg-block">
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">Sign Out</Tooltip>}>
            <Button variant="dark">
              <i className="fas fa-sign-out-alt"></i>
            </Button>
          </OverlayTrigger>
        </Nav.Item>
      </Container>
    </Navbar>
  );
}
