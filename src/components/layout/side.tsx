import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import HomeIcon from "./Icons/Home.svg";
import CalendarIcon from "./Icons/Calendar.svg";
import SessionIcon from "./Icons/Session.svg";
import ClientIcon from "./Icons/Client.svg";
import BookingIcon from "./Icons/Booking.svg";
import OfferingsIcon from "./Icons/Offerings.svg";
import ResourcesIcon from "./Icons/Resources.svg";
import FinancesIcon from "./Icons/Finances.svg";
import CommunicationIcon from "./Icons/Communications.svg";
import SettingsIcon from "./Icons/Settings.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export function SideNav({ collapse, setCollapse }: any) {
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
          <NavLink className="nav-link text-white" to="/home">
            <img
              src={HomeIcon}
              alt="home icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Home"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("My Schedule")}
        >
          <NavLink className="nav-link text-white" to="/schedule">
            <img
              src={CalendarIcon}
              alt="calendar icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "My Schedule"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Program Manager")}
        >
          <NavLink className="nav-link text-white" to="/session">
            <img
              src={SessionIcon}
              alt="session icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Program Manager"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Users")}
        >
          <NavLink className="nav-link text-white" to="/clients">
            <img
              src={ClientIcon}
              alt="client icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Users"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Bookings")}
        >
          <NavLink className="nav-link text-white" to="/bookings">
            <img
              src={BookingIcon}
              alt="booking icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Bookings"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Offerings")}
        >
          <NavLink className="nav-link text-white" to="/offerings">
            <img
              src={OfferingsIcon}
              alt="offerings icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Offerings"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Resources")}
        >
          <NavLink className="nav-link text-white" to="/resources">
            <img
              src={ResourcesIcon}
              alt="resources icon"
              className="mr-sm-2"
              style={{ height: "25px", width: "25px" }}
            />
            {!collapse && "Resources"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Finances")}
        >
          <NavLink className="nav-link text-white" to="/finance">
            <img
              src={FinancesIcon}
              alt="finances icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Finances"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Communication")}
        >
          <NavLink className="nav-link text-white" to="/communication">
            <img
              src={CommunicationIcon}
              alt="communication icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Communication"}
          </NavLink>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip("Settings")}
        >
          <NavLink className="nav-link text-white" to="/settings">
            <img
              src={SettingsIcon}
              alt="settings icon"
              className="mr-sm-2"
              style={{ height: "20px", width: "20px" }}
            />
            {!collapse && "Settings"}
          </NavLink>
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
