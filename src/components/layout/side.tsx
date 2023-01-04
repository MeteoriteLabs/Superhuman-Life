import { Button, Nav } from "react-bootstrap";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Icon from "../Icons/index";

export function SideNav({ collapse, setCollapse }: any) {
  const location = useLocation();
  let [selected, setSelected] = useState<String>(location.pathname.slice(1));
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  return (
    <aside style={{ position: "fixed", height: "100%" }} className="bg-dark">
      <hr />
      <Nav className="flex-column">
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Home")}
        >
          {selected === "home" ? (
            <NavLink
              className="nav-link text-white"
              to="/home"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="home" width={24} height={24} />
              {!collapse && "Home"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              style={{ color: "#cebaa8" }}
              to="/home"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lighthome" width={24} height={24} />
              {!collapse && "Home"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("My Schedule")}
        >
          {selected === "schedule" ? (
            <NavLink
              className="nav-link"
              to="/schedule"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="schedule" width={24} height={24} />
              {!collapse && "My Schedule"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/schedule"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightschedule" width={24} height={24} />
              {!collapse && "My Schedule"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Program Manager")}
        >
          {selected === "session" ? (
            <NavLink
              className="nav-link"
              to="/session"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="programManager" width={24} height={24} />
              {!collapse && "Program Manager"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/session"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightprogramManager" width={24} height={24} />
              {!collapse && "Program Manager"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Users")}
        >
          {selected === "clients" ? (
            <NavLink
              className="nav-link"
              to="/clients"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="user" width={24} height={24} />
              {!collapse && "Users"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/clients"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightuser" width={24} height={24} />
              {!collapse && "Users"}
            </NavLink>
          )}

        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Bookings")}
        >
          {selected === "bookings" ? (
            <NavLink
              className="nav-link"
              to="/bookings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="booking" width={24} height={24} />
              {!collapse && "Bookings"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/bookings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightbooking" width={24} height={24} />
              {!collapse && "Bookings"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Offerings")}
        >
          {selected === "offerings" ? (
            <NavLink
              className="nav-link"
              to="/offerings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="offering" width={24} height={24} />
              {!collapse && "Offerings"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/offerings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightoffering" width={24} height={24} />
              {!collapse && "Offerings"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Resources")}
        >
          
          {selected === "resources" ? (
            <NavLink
              className="nav-link"
              to="/resources"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="resource" width={24} height={24} />
              {!collapse && "Resources"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/resources"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightresource" width={24} height={24} />
              {!collapse && "Resources"}
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Finances")}
        >
          {selected === "finance" ? (
            <NavLink
              className="nav-link"
              to="/finance"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="finance" width={24} height={24} />
              {!collapse && "Finance"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/finance"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightfinance" width={24} height={24} />
              {!collapse && "Finance"}
            </NavLink>
          )}

        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Communication")}
        >
          {selected === "communication" ? (
            <NavLink
              className="nav-link"
              to="/finance"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="communication" width={24} height={24} />
              {!collapse && "Communication"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/communication"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightcommunication" width={24} height={24} />
              {!collapse && "Communication"}
            </NavLink>
          )}

          
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Settings")}
        >
          {selected === "settings" ? (
            <NavLink
              className="nav-link"
              to="/settings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="setting" width={24} height={24} />
              {!collapse && "Settings"}
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/settings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon name="lightsetting" width={24} height={24} />
              {!collapse && "Settings"}
            </NavLink>
          )}
         
            
        </OverlayTrigger>
      </Nav>
      <Button
        variant="dark"
        onClick={() => setCollapse(!collapse)}
        className="mt-5 nav-link"
      >
        {collapse ? (
          <i className="fas fa-angle-double-right"></i>
        ) : (
          <>
            <i className="fas fa-angle-double-left mr-sm-2"></i>Collapse
          </>
        )}
      </Button>
    </aside>
  );
}
