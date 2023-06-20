import { Button, Col, Nav, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Icons from '../../../components/Icons';
import WWWIcon from '../../../components/Icons/www';
import MobileIcon from '../../../components/Icons/mobile';

export default function SideNav({
  collapse,
  setCollapse
}: {
  collapse: boolean;
  setCollapse: (arg: boolean) => void;
}): JSX.Element {
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>(location.pathname.slice(1));
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  useEffect(() => {
    setSelectedOption(location.pathname.slice(1));
  }, [location]);

  return (
    <aside style={{ position: 'fixed', height: '100%', zIndex: 2 }} className="bg-dark">
      <hr />
      <Nav className="flex-column mt-4" style={{ gap: '10px' }}>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip('Website')}>
          {selectedOption === 'website' ? (
            <NavLink
              className="nav-link text-white"
              to="/website"
              onClick={() => setSelectedOption(location.pathname.slice(1))}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <WWWIcon width={24} height={24} />
                </Col>
                {collapse ? (
                  ''
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Website</div>
                  </Col>
                )}
              </Row>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="/website"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: '#fff', textAlign: 'left' }}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <WWWIcon width={24} height={24} />
                </Col>
                {collapse ? (
                  ''
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Website</div>
                  </Col>
                )}
              </Row>
            </NavLink>
          )}
        </OverlayTrigger>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip('mobileApp')}>
          {selectedOption === 'mobileApp' ? (
            <NavLink
              className="nav-link text-white"
              to="#"
              onClick={() => setSelectedOption(location.pathname.slice(1))}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <MobileIcon width={24} height={24} />
                </Col>

                {collapse ? (
                  ''
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Mobile Application</div>
                  </Col>
                )}
              </Row>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="#"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: '#fff' }}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <MobileIcon width={24} height={24} />
                </Col>
                {collapse ? (
                  <Col className=""></Col>
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Mobile Application</div>
                  </Col>
                )}
              </Row>
            </NavLink>
          )}
        </OverlayTrigger>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip('Embeddable Links')}>
          {selectedOption === 'embeddableLinks' ? (
            <NavLink
              className="nav-link text-white"
              to="#"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ marginTop: '-10px' }}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <Icons width={22} height={22} name="linkicon" />
                </Col>
                {collapse ? (
                  ''
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Embeddable Links </div>
                  </Col>
                )}
              </Row>
            </NavLink>
          ) : (
            <NavLink
              className="nav-link"
              to="#"
              onClick={() => setSelectedOption(location.pathname.slice(1))}
              style={{ color: '#fff', marginTop: '-10px' }}>
              <Row>
                <Col className="ml-4 m-0 p-0">
                  <Icons width={22} height={22} name="linkicon" />
                </Col>
                {collapse ? (
                  <Col className=""></Col>
                ) : (
                  <Col>
                    <div style={{ width: 160 }}>Embeddable Links </div>
                  </Col>
                )}
              </Row>
            </NavLink>
          )}
        </OverlayTrigger>
      </Nav>

      <Button variant="dark" onClick={() => setCollapse(!collapse)} className="mt-2 nav-link">
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
