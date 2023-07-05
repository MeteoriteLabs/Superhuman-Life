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

    const [showSubOptions, setShowSubOptions] = useState(false);

    return (
        <aside style={{ position: 'fixed', height: '100%', zIndex: 2 }} className="bg-dark">
            <hr />
            <Nav className="flex-column mt-4" style={{ gap: '10px' }}>
                {/* <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip('Website')}
                  >
                    {selectedOption === 'website' ? (
                        <NavLink
                            className="nav-link text-white"
                            to="/website"
                            onClick={() => setSelectedOption(location.pathname.slice(1))}
                        >
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
                            style={{ color: '#fff', textAlign: 'left' }}
                        >
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
                </OverlayTrigger> */}

                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip('Website')}
                >
                    <NavLink
                        className={
                            selectedOption === 'website' ? 'nav-link text-white' : 'nav-link'
                        }
                        to="/website"
                        onClick={() => {
                            setSelectedOption(location.pathname.slice(1));
                            setShowSubOptions(!showSubOptions); // Toggle the sub-option visibility
                        }}
                        style={{ color: '#fff', textAlign: 'left' }}
                    >
                        <Row>
                            <Col className="ml-4 m-0 p-0">
                                <WWWIcon width={24} height={24} />
                            </Col>
                            {collapse ? (
                                ''
                            ) : (
                                <Col>
                                    <div style={{ width: 160 }}>
                                        Website <span style={{ marginLeft: '80px' }}>⮟</span>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </NavLink>
                </OverlayTrigger>

                {/* Render the sub-options when showSubOptions is true */}
                {showSubOptions && selectedOption === 'website' && (
                    <div style={{ marginLeft: '45px', marginTop: '-15px' }}>
                        <NavLink
                            style={{ color: 'white' }}
                            className="nav-link"
                            to="/theme-library"
                            onClick={() => setSelectedOption('theme-library')}
                        >
                            Theme Library
                        </NavLink>
                        <NavLink
                            style={{ color: 'white' }}
                            className="nav-link"
                            to="/live-editor"
                            onClick={() => setSelectedOption('live-editor')}
                        >
                            Live Editor
                        </NavLink>
                    </div>
                )}

                {/* <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip('mobileApp')}
                >
                    {selectedOption === 'mobileApp' ? (
                        <NavLink
                            className="nav-link text-white"
                            to="#"
                            onClick={() => setSelectedOption(location.pathname.slice(1))}
                        >
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
                            style={{ color: '#fff' }}
                        >
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
                </OverlayTrigger> */}

                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip('mobileApp')}
                >
                    <NavLink
                        className={
                            selectedOption === 'mobileApp' ? 'nav-link text-white' : 'nav-link'
                        }
                        to="#"
                        onClick={() => {
                            setSelectedOption(location.pathname.slice(1));
                            setShowSubOptions(!showSubOptions); // Toggle the sub-option visibility
                        }}
                        style={{ color: '#fff' }}
                    >
                        <Row>
                            <Col className="ml-4 m-0 p-0">
                                <MobileIcon width={24} height={24} />
                            </Col>
                            {collapse ? (
                                ''
                            ) : (
                                <Col>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: 160 }}>Mobile Application
                                        <span style={{ marginLeft: '10px' }}>⮟</span>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </NavLink>
                </OverlayTrigger>

                {/* Render the sub-options when showSubOptions is true */}
                {showSubOptions && selectedOption === 'website' && (
                    <div style={{ marginLeft: '45px', marginTop: '-25px' }}>
                        <NavLink
                          style={{ color: 'white' }}
                            className="nav-link"
                            to="/theme-library"
                            onClick={() => setSelectedOption('theme-library')}
                        >
                            Theme Library
                        </NavLink>
                        <NavLink
                          style={{ color: 'white' }}
                            className="nav-link"
                            to="/notification"
                            onClick={() => setSelectedOption('notification')}
                        >
                            Notification
                        </NavLink>
                        <NavLink
                          style={{ color: 'white' }}
                            className="nav-link"
                            to="/setting"
                            onClick={() => setSelectedOption('setting')}
                        >
                            Setting
                        </NavLink>
                    </div>
                )}

                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip('Embeddable Links')}
                >
                    {selectedOption === 'embeddableLinks' ? (
                        <NavLink
                            className="nav-link text-white"
                            to="#"
                            onClick={() => setSelectedOption(location.pathname.slice(1))}
                            style={{ marginTop: '-10px' }}
                        >
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
                            style={{ color: '#fff', marginTop: '-10px' }}
                        >
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
