import React from 'react';
import {
  Nav
} from "react-bootstrap";
import HomeIcon from "../../Icons/Home.svg";
import CalendarIcon from "../../Icons/Calendar.svg";
import SessionIcon from "../../Icons/Session.svg"
import ClientIcon from "../../Icons/Client.svg";
import BookingIcon from "../../Icons/Booking.svg";
import OfferingsIcon from "../../Icons/Offerings.svg";
import ResourcesIcon from "../../Icons/Resources.svg";
import FinancesIcon from "../../Icons/Finances.svg";
import CommunicationIcon from "../../Icons/Communications.svg";
import SettingsIcon from "../../Icons/Settings.svg";

function ToggleSideBarMenu() {
 
  return (
    <>
          <Nav>
            <Nav.Link eventKey="1" className="nav-link text-white d-sm-block d-lg-none" href="/home">
              <img src={HomeIcon} alt="home icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Home
            </Nav.Link>
            <Nav.Link  eventKey="2" className="nav-link text-white d-sm-block d-lg-none" href="/schedule">
              <img src={CalendarIcon} alt="calendar icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />My Schedule
            </Nav.Link>
            <Nav.Link eventKey="3" className="nav-link text-white d-sm-block d-lg-none" href="/session">
              <img src={SessionIcon} alt="session icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Program Manager
            </Nav.Link>
            <Nav.Link eventKey="4" className="nav-link text-white d-sm-block d-lg-none" href="/clients">
              <img src={ClientIcon} alt="client icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Clients
            </Nav.Link>
            <Nav.Link eventKey="5" className="nav-link text-white d-sm-block d-lg-none" href="/bookings">
              <img src={BookingIcon} alt="booking icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Bookings
            </Nav.Link>
            <Nav.Link eventKey="6" className="nav-link text-white d-sm-block d-lg-none" href="/offerings">
              <img src={OfferingsIcon} alt="offerings icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Offerings
            </Nav.Link>
            <Nav.Link eventKey="7" className="nav-link text-white d-sm-block d-lg-none" href="/resources">
              <img src={ResourcesIcon} alt="resources icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Resources
            </Nav.Link>
            <Nav.Link eventKey="8" className="nav-link text-white d-sm-block d-lg-none" href="/finance">
              <img src={FinancesIcon} alt="finances icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Finances
            </Nav.Link>
            <Nav.Link eventKey="9" className="nav-link text-white d-sm-block d-lg-none" href="/communication">
              <img src={CommunicationIcon} alt="communication icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Communication
            </Nav.Link>
            <Nav.Link eventKey="10" className="nav-link text-white d-sm-block d-lg-none" href="/settings">
              <img src={SettingsIcon} alt="settings icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Settings
            </Nav.Link>
          </Nav>
    </>
  )
}

export default ToggleSideBarMenu;
