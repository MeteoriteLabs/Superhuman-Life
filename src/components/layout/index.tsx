import { useState, useEffect } from 'react';
import { Col, Row, Navbar, Nav } from 'react-bootstrap';
import { SideNav } from './side';
import { AuthenticatedNav, UnauthenticatedNav } from './top';
import { useLocation } from 'react-router-dom';
import Icon from '../Icons';
import './bottomBar.css';

export default function Layout({ token, children }: any) {
  const location = useLocation();
  const [selected, setSelected] = useState<string>(location.pathname.slice(1));
  const [collapse, setCollapse] = useState<boolean>(true);
  const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);

  const { pathname } = useLocation<any>();

  useEffect(() => {
    getSideNavStatus();
  }, [pathname]);

  const getSideNavStatus = () => {
    const currentSideNavStatus: boolean =
      pathname !== '/lobby' &&
      pathname !== '/website' &&
      pathname !== '/profile' &&
      pathname !== '/insights' &&
      pathname !== '/support'
        ? true
        : false;
    setSideNavStatus(currentSideNavStatus);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <header>{token ? <AuthenticatedNav /> : <UnauthenticatedNav />}</header>
      <main>
        {token ? (
          <div>
            {sideNavStatus ? (
              <Row noGutters className="bg-light mt-5 py-4 mb-5  min-vh-100">
                <Col lg={collapse ? '1' : '2'} className="d-none d-lg-block">
                  <SideNav collapse={collapse} setCollapse={setCollapse} />
                </Col>
                <Col lg={collapse ? '11' : '10'} className="pr-2 pl-3 mb-5">
                  <hr />
                  {children}
                </Col>
              </Row>
            ) : (
              <div className="pt-5 ">{children}</div>
            )}
          </div>
        ) : (
          <div>
            <>{children}</>
          </div>
        )}
      </main>

      {/* small screen footer */}
      {token && sideNavStatus ? (
        <Navbar
          expand="lg"
          fixed="bottom"
          bg="dark"
          variant="dark"
          className="d-lg-none d-sm-block mt-5">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selected === 'home' ? (
              <Navbar.Brand href="/home" onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="home" width={24} height={24} style={{ marginLeft: '5px' }} />
                <br />
                <small>Home</small>
              </Navbar.Brand>
            ) : (
              <Navbar.Brand href="/home" onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="lighthome" width={24} height={24} style={{ marginLeft: '5px' }} />
                <br />
                <small style={{ color: '#cebaa8' }}>Home</small>
              </Navbar.Brand>
            )}

            {selected === 'bookings' ? (
              <Navbar.Brand
                href="/bookings"
                onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="booking" width={24} height={24} style={{ marginLeft: '20px' }} />
                <br />
                <small>Bookings</small>
              </Navbar.Brand>
            ) : (
              <Navbar.Brand
                href="/bookings"
                onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="lightbooking" width={24} height={24} style={{ marginLeft: '20px' }} />
                <br />
                <small style={{ color: '#cebaa8' }}>Bookings</small>
              </Navbar.Brand>
            )}

            {selected === 'schedule' ? (
              <Navbar.Brand
                href="/schedule"
                onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="schedule" width={24} height={24} style={{ marginLeft: '15px' }} />
                <br />
                <small>Schedule</small>
              </Navbar.Brand>
            ) : (
              <Navbar.Brand
                href="/schedule"
                onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="lightschedule" width={24} height={24} style={{ marginLeft: '15px' }} />
                <br />
                <small style={{ color: '#cebaa8' }}>Schedule</small>
              </Navbar.Brand>
            )}

            {selected === 'clients' ? (
              <Navbar.Brand href="/clients" onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="user" width={24} height={24} style={{ marginLeft: '5px' }} />
                <br />
                <small>Users</small>
              </Navbar.Brand>
            ) : (
              <Navbar.Brand href="/clients" onClick={() => setSelected(location.pathname.slice(1))}>
                <Icon name="lightuser" width={24} height={24} style={{ marginLeft: '5px' }} />
                <br />
                <small style={{ color: '#cebaa8' }}>Users</small>
              </Navbar.Brand>
            )}

            {/* Toggle pop up */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ float: 'right' }} />
          </div>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto ml-3">
              <Nav.Link href="/session" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightprogramManager" width={24} height={24} />
                <span className="ml-1">Program Manager</span>
              </Nav.Link>

              <Nav.Link href="/finance" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightfinance" width={24} height={24} />
                <span className="ml-1">Finances</span>
              </Nav.Link>

              <Nav.Link href="/offerings" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightoffering" width={24} height={24} />
                <span className="ml-1">Offerings</span>
              </Nav.Link>

              <Nav.Link href="/resources" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightresource" width={24} height={24} />
                <span className="ml-1">Resources</span>
              </Nav.Link>

              <Nav.Link href="/communication" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightcommunication" width={24} height={24} />
                <span className="ml-1">Communication</span>
              </Nav.Link>

              <Nav.Link href="/settings" style={{ color: '#cebaa8', display: 'flex' }}>
                <Icon name="lightsetting" width={24} height={24} />
                <span className="ml-1">Settings</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      ) : null}
    </>
  );
}
