import React from 'react';
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);

  const { pathname } = useLocation<any>();

  useEffect(() => {
    getSideNavStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getSideNavStatus = () => {
    const currentSideNavStatus: boolean =
      pathname !== "/lobby" && pathname !== "/website" ? true : false;
    setSideNavStatus(currentSideNavStatus);
  };

  return (
    <>
      {
        sideNavStatus ?
          <Nav>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/home">
              <img src={HomeIcon} alt="home icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Home
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/schedule">
              <img src={CalendarIcon} alt="calendar icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />My Schedule
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/session">
              <img src={SessionIcon} alt="session icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Session Manager
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/clients">
              <img src={ClientIcon} alt="client icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Clients
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/bookings">
              <img src={BookingIcon} alt="booking icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Bookings
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/offerings">
              <img src={OfferingsIcon} alt="offerings icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Offerings
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/resources">
              <img src={ResourcesIcon} alt="resources icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Resources
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/finances">
              <img src={FinancesIcon} alt="finances icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Finances
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/communication">
              <img src={CommunicationIcon} alt="communication icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Communication
            </NavLink>
            <NavLink className="nav-link text-white d-sm-block d-lg-none" to="/settings">
              <img src={SettingsIcon} alt="settings icon" className="mr-sm-2" style={{ height: '20px', width: '20px', marginRight: '5px' }} />Settings
            </NavLink>
          </Nav>
          : null
      }

    </>
  )
}

export default ToggleSideBarMenu;
