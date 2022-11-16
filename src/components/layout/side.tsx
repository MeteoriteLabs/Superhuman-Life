import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import HomeIcon from "./Icons/Home.svg";
import CalendarIcon from "./Icons/Calendar.svg";
import SessionIcon from "./Icons/Session.svg"
import ClientIcon from "./Icons/Client.svg";
import BookingIcon from "./Icons/Booking.svg";
import OfferingsIcon from "./Icons/Offerings.svg";
import ResourcesIcon from "./Icons/Resources.svg";
import FinancesIcon from "./Icons/Finances.svg";
import CommunicationIcon from "./Icons/Communications.svg";
import SettingsIcon from "./Icons/Settings.svg";

export function SideNav({ collapse, setCollapse }: any) {
  return (
    <aside style={{ position: 'fixed', height: '100%' }} className="bg-dark">
      <hr />
      <Nav className="flex-column">
        <NavLink className="nav-link text-white" to="/home">
          <img src={HomeIcon} alt="home icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Home"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/schedule">
          <img src={CalendarIcon} alt="calendar icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "My Schedule"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/session">
          <img src={SessionIcon} alt="session icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Program Manager"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/clients">
          <img src={ClientIcon} alt="client icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Clients"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/bookings">
          <img src={BookingIcon} alt="booking icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Bookings"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/offerings">
          <img src={OfferingsIcon} alt="offerings icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Offerings"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/resources">
          <img src={ResourcesIcon} alt="resources icon" className="mr-sm-2" style={{height: '25px', width: '25px'}}/>{!collapse && "Resources"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/finance">
          <img src={FinancesIcon} alt="finances icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Finances"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/communication">
          <img src={CommunicationIcon} alt="communication icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Communication"}
        </NavLink>
        <NavLink className="nav-link text-white" to="/settings">
          <img src={SettingsIcon} alt="settings icon" className="mr-sm-2" style={{height: '20px', width: '20px'}}/>{!collapse && "Settings"}
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
