import { useState, useEffect } from "react";
import { Col, Row, Navbar, Nav } from "react-bootstrap";
import { SideNav } from "./side";
import { AuthenticatedNav, UnauthenticatedNav } from "./top";
import { useLocation } from "react-router-dom";
import SessionIcon from "./Icons/Session.svg";
import OfferingsIcon from "./Icons/Offerings.svg";
import ResourcesIcon from "./Icons/Resources.svg";
import FinancesIcon from "./Icons/Finances.svg";
import CommunicationIcon from "./Icons/Communications.svg";
import SettingsIcon from "./Icons/Settings.svg";
import Icon from "../Icons/index";
import "./bottomBar.css";

export default function Layout({ token, children }: any) {
  const location = useLocation();
  let [selected, setSelected] = useState<String>(location.pathname.slice(1));
  const [collapse, setCollapse] = useState<boolean>(true);
  const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);

  const { pathname } = useLocation<any>();

  useEffect(() => {
    getSideNavStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getSideNavStatus = () => {
    const currentSideNavStatus: boolean =
      pathname !== "/lobby" &&
      pathname !== "/website" &&
      pathname !== "/profile" &&
      pathname !== "/insights" &&
      pathname !== "/support"
        ? true
        : false;
    setSideNavStatus(currentSideNavStatus);
  };
  console.log(location, selected, location.pathname.slice(1));
  return (
    <>
      <header>{token ? <AuthenticatedNav /> : <UnauthenticatedNav />}</header>
      <main>
        {token ? (
          <div>
            {sideNavStatus ? (
              <Row noGutters className="bg-light mt-5 py-4  min-vh-100">
                <Col lg={collapse ? "1" : "2"} className="d-none d-lg-block">
                  <SideNav collapse={collapse} setCollapse={setCollapse} />
                </Col>
                <Col lg={collapse ? "11" : "10"} className="pr-2 pl-3">
                  <hr />
                  {children}
                </Col>
              </Row>
            ) : (
              <div className="pt-5">{children}</div>
            )}
          </div>
        ) : (
          <div>
            <>{children}</>
          </div>
        )}
      </main>

      {/* small screen footer */}
      {token ? (
        <Navbar
          expand="lg"
          fixed="bottom"
          bg="dark"
          variant="dark"
          className="d-lg-none d-sm-block mt-5"
        >
          {selected === "home" ? (
            <Navbar.Brand
              href="/home"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="home"
                width={24}
                height={24}
                style={{ marginLeft: "5px" }}
              />
              <br />
              <small>Home</small>
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              href="/home"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="lighthome"
                width={24}
                height={24}
                style={{ marginLeft: "5px" }}
              />
              <br />
              <small style={{ color: "#cebaa8" }}>Home</small>
            </Navbar.Brand>
          )}

          {selected === "bookings" ? (
            <Navbar.Brand
              href="/bookings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="booking"
                width={24}
                height={24}
                style={{ marginLeft: "20px" }}
              />

              <br />
              <small>Bookings</small>
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              href="/bookings"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="lightbooking"
                width={24}
                height={24}
                style={{ marginLeft: "20px" }}
              />
              <br />
              <small style={{ color: "#cebaa8" }}>Bookings</small>
            </Navbar.Brand>
          )}
          {selected === "schedule" ? (
            <Navbar.Brand
              href="/schedule"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="schedule"
                width={24}
                height={24}
                style={{ marginLeft: "5px" }}
              />
              <br />
              <small>Schedule</small>
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              href="/schedule"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="lightschedule"
                width={24}
                height={24}
                style={{ marginLeft: "15px" }}
              />
              <br />
              <small style={{ color: "#cebaa8" }}>Schedule</small>
            </Navbar.Brand>
          )}

          {selected === "clients" ? (
            <Navbar.Brand
              href="/clients"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="user"
                width={24}
                height={24}
                style={{ marginLeft: "5px" }}
              />
              <br />
              <small>Users</small>
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              href="/clients"
              onClick={() => setSelected(location.pathname.slice(1))}
            >
              <Icon
                name="lightuser"
                width={24}
                height={24}
                style={{ marginLeft: "5px" }}
              />
              <br />
              <small style={{ color: "#cebaa8" }}>Users</small>
            </Navbar.Brand>
          )}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto ml-3">
              <Nav.Link href="/session">
                <img
                  src={SessionIcon}
                  alt="session icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Program Manager
              </Nav.Link>
              <Nav.Link href="/finance">
                <img
                  src={FinancesIcon}
                  alt="finances icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Finances
              </Nav.Link>
              <Nav.Link href="/offerings">
                <img
                  src={OfferingsIcon}
                  alt="offering icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Offerings
              </Nav.Link>
              <Nav.Link href="/resources">
                <img
                  src={ResourcesIcon}
                  alt="resources icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Resources
              </Nav.Link>
              <Nav.Link href="/communication">
                <img
                  src={CommunicationIcon}
                  alt="communication icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Communication
              </Nav.Link>
              <Nav.Link href="/settings">
                <img
                  src={SettingsIcon}
                  alt="settings icon"
                  className="mr-sm-2"
                  style={{
                    height: "20px",
                    width: "20px",
                    marginRight: "5px",
                  }}
                />
                Settings
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      ) : null}
    </>
  );
}
