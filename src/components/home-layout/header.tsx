import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const headerStyle = {
    backgroundImage: "linear-gradient(15deg, #4568dc 0%, #b06ab3 100%)",
    color: "red"
}

export default function HomeTopNav() {
    return (
        <Navbar fixed="top" className="shadow-sm" expand="lg" style={headerStyle}>
                <Navbar.Brand href="/" className="text-muted">
                    <img
                        src="/assets/sapien-logo.svg"
                        width="150"
                        className="d-inline-block align-top"
                        alt="Sapien"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse className="justify-content-end" id="navbar">
                    <Nav>
                        <NavLink className="nav-link" to="/about">
                            About
                        </NavLink>
                        <NavLink className="nav-link" to="/faqs">
                            FAQs
                        </NavLink>
                        <NavLink className="nav-link" to="/contact">
                            Contact
                        </NavLink>
                        <NavLink className="nav-link" to="/login">
                            Log in
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    );
}
