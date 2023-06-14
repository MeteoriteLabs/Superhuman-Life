import { Button, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Icon from "../Icons/index";

export function SideNav({ collapse, setCollapse }: any) {
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>(location.pathname.slice(1));
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  useEffect(() => {
    setSelectedOption(location.pathname.slice(1));
  }, [location]);

  return (
    <aside style={{ position: "fixed", height: "100%" }} className="bg-dark">
      <hr />
      <Nav className="flex-column">
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Home")}
        >
          {selectedOption === "home" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/home"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="home" width={24} height={24} />
              <span className="ml-1">{!collapse && "Home"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              style={{ color: "#cebaa8" }}
              to="/home"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="lighthome" width={24} height={24} />
              <span className="ml-1">{!collapse && "Home"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("My Schedule")}
        >
          {selectedOption === "schedule" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/schedule"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="schedule" width={24} height={24} />
              <span className="ml-1">{!collapse && "My Schedule"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex "
              to="/schedule"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightschedule" width={24} height={24} />
              <span className="ml-1">{!collapse && "My Schedule"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Program Manager")}
        >
          {selectedOption === "session" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/session"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="programManager" width={24} height={24} />
              <span className="ml-1">{!collapse && "Program Manager"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/session"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightprogramManager" width={24} height={24} />
              <span className="ml-1">{!collapse && "Program Manager"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Users")}
        >
          {selectedOption === "clients" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/clients"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="user" width={24} height={24} />
              <span className="ml-1">{!collapse && "Users"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/clients"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightuser" width={24} height={24} />
              <span className="ml-1">{!collapse && "Users"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Bookings")}
        >
          {selectedOption === "bookings" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/bookings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="booking" width={24} height={24} />
              <span className="ml-1">{!collapse && "Bookings"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/bookings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightbooking" width={24} height={24} />
              <span className="ml-1">{!collapse && "Bookings"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Offerings")}
        >
          {selectedOption === "offerings" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/offerings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="offering" width={24} height={24} />
              <span className="ml-1">{!collapse && "Offerings"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/offerings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightoffering" width={24} height={24} />
              <span className="ml-1">{!collapse && "Offerings"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Resources")}
        >
          {selectedOption === "resources" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/resources"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="resource" width={24} height={24} />
              <span className="ml-1">{!collapse && "Resources"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/resources"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightresource" width={24} height={24} />
              <span className="ml-1">{!collapse && "Resources"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Finances")}
        >
          {selectedOption === "finance" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/finance"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="finance" width={24} height={24} />
              <span className="ml-1">{!collapse && "Finance"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/finance"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightfinance" width={24} height={24} />
              <span className="ml-1">{!collapse && "Finance"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Communication")}
        >
          {selectedOption === "communication" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/communication"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="communication" width={24} height={24} />
              <span className="ml-1">{!collapse && "Communication"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/communication"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightcommunication" width={24} height={24} />
              <span className="ml-1">{!collapse && "Communication"}</span>
            </NavLink>
          )}
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Settings")}
        >
          {selectedOption === "settings" ? (
            <NavLink
              className="nav-link d-flex text-white"
              to="/settings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
            >
              <Icon name="setting" width={24} height={24} />
              <span className="ml-1">{!collapse && "Settings"}</span>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link d-flex"
              to="/settings"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: "#cebaa8" }}
            >
              <Icon name="lightsetting" width={24} height={24} />
              <span className="ml-1">{!collapse && "Settings"}</span>
            </NavLink>
          )}
        </OverlayTrigger>
      </Nav>
      <Button
        variant="dark"
        onClick={() => setCollapse(!collapse)}
        className="mt-5 nav-link d-flex"
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
