import { Accordion, Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  return (
    <aside className="bg-white p-3">
      <div className="text-center">
        <NavLink className="navbar-brand" to="/profile">
          <img src="/assets/avatar-1.jpg" height="42" className="rounded-circle" alt="profile" />
        </NavLink>
        <p>John Doe<br /><small className="text-muted">Fitness Coach</small></p>
      </div>
      <hr />
      <Nav className="flex-column">
        <NavLink className="nav-link" to="/home">
          <i className="fas fa-home mr-sm-2"></i> Home
        </NavLink>
        <NavLink className="nav-link" to="/availability">
          <i className="fab fa-adn mr-sm-2"></i> Availability
        </NavLink>
        <NavLink className="nav-link" to="/bookings">
          <i className="far fa-calendar-check mr-sm-2"></i> Bookings
        </NavLink>
        <NavLink className="nav-link" to="/chats">
          <i className="far fa-comment-alt mr-sm-2"></i> Chats
        </NavLink>
        <NavLink className="nav-link" to="/clients">
          <i className="fas fa-users mr-sm-1"></i> Clients
        </NavLink>
        <NavLink className="nav-link" to="/community">
          <i className="fas fa-at mr-sm-2"></i> Community
        </NavLink>
        <NavLink className="nav-link" to="/insights">
          <i className="far fa-eye mr-sm-2"></i> Insights
        </NavLink>
        <NavLink className="nav-link" to="/schedule">
          <i className="far fa-calendar-alt mr-sm-2"></i> Schedule
        </NavLink>
        <NavLink className="nav-link" to="/settings">
          <i className="fas fa-cog mr-sm-2"></i> Settings
        </NavLink>
        <NavLink className="nav-link" to="/tasks">
          <i className="fas fa-tasks mr-sm-2"></i> Tasks
        </NavLink>
      </Nav>
      <hr />
      <Accordion>
        <Accordion.Toggle as={Button} variant="link" eventKey="0">
          <i className="fas fa-angle-right mr-sm-2"></i> Finance
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Nav className="flex-column">
            <NavLink className="nav-link ml-sm-4" to="/">
              Invoices
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/">
              Offers
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/">
              Payment Options
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/">
              Pricing Assist
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/">
              Sapien Partnership
            </NavLink>
          </Nav>
        </Accordion.Collapse>
      </Accordion>
      <Accordion>
        <Accordion.Toggle as={Button} variant="link" eventKey="0">
          <i className="fas fa-angle-right mr-sm-2"></i> Packages
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Nav className="flex-column">
            <NavLink className="nav-link ml-sm-4" to="/packages/events">
              Events
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/packages/fitness">
              Fitness
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/packages/journey">
              Journey
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/packages/nutrition">
              Nutrition
            </NavLink>
          </Nav>
        </Accordion.Collapse>
      </Accordion>
      <Accordion>
        <Accordion.Toggle as={Button} variant="link" eventKey="0">
          <i className="fas fa-angle-right mr-sm-2"></i> Resources
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Nav className="flex-column">
            <NavLink className="nav-link ml-sm-4" to="/resources/fitness">
              Fitness
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/resources/knowledge">
              Knowledge Bank
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/resources/mindset">
              Mental Health
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/resources/messages">
              Messages
            </NavLink>
            <NavLink className="nav-link ml-sm-4" to="/resources/nutrition">
              Nutrition
            </NavLink>
          </Nav>
        </Accordion.Collapse>
      </Accordion>
    </aside>
  );
}
