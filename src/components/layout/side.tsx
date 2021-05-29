import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function SideNav({ collapse, setCollapse }: any) {
  return (
    <aside className="bg-dark min-vh-100">
      {/* <div className="text-center">
        <NavLink className="navbar-brand" to="/profile">
          <img src="/assets/avatar-1.jpg" height="42" className="rounded-circle" alt="profile" />
        </NavLink>
        <p>John Doe<br /><small className="text-muted">Fitness Coach</small></p>
      </div>
      <hr /> */}
      <Nav className="flex-column">
        <NavLink className="nav-link text-white" to="/home">
          <i className="fas fa-home mr-sm-2"></i>{!collapse && "Home"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/bookings">
          <i className="far fa-calendar-check mr-sm-2"></i>{!collapse && "Bookings"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/chats">
          <i className="far fa-comment-alt mr-sm-2"></i>{!collapse && "Chats"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/clients">
          <i className="fas fa-users mr-sm-1"></i>{!collapse && "Clients"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/finance">
          <i className="fas fa-wallet mr-sm-2"></i>{!collapse && "Finance"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/packages">
          <i className="fas fa-tools mr-sm-2"></i>{!collapse && "Packages"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/programs">
          <i className="far fa-eye mr-sm-2"></i>{!collapse && "Programs"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/resources">
          <i className="fas fa-layer-group mr-sm-2"></i>{!collapse && "Resources"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/schedule">
          <i className="far fa-calendar-alt mr-sm-2"></i>{!collapse && "Schedule"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/settings">
          <i className="fas fa-cog mr-sm-2"></i>{!collapse && "Settings"}
        </NavLink>
      </Nav>
      <Button
        variant="dark"
        onClick={() => setCollapse(!collapse)}
        className="mt-5 nav-link"
      >
        {collapse
          ? <i className="fas fa-angle-double-right"></i>
          : <><i className="fas fa-angle-double-left mr-sm-2"></i>Collapse</>
        }
      </Button>
    </aside>
  );
}
