import { Button, Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import WebsiteBuilder_settings from './components/websiteBuilder_settings';
import WebsiteBuilder_template from './components/websiteBuilder_template';
import { FC, useState, useContext, useEffect } from 'react';
import MobileIcon from 'components/Icons/mobile';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import SideNav from './layout/sidenav';
import Icon from 'components/Icons';
import Icons from 'components/Icons';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import clsx from 'clsx';
import classes from './style.module.css';

const WebsiteBuilder: FC = () => {
    const [collapse, setCollapse] = useState<boolean>(true);
    const [selected, setSelected] = useState<string>(location.pathname.slice(1));
    const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);
    const { pathname } = useLocation();
    const auth = useContext(AuthContext);
    const [showSubOptionsWebsite, setShowSubOptionsWebsite] = useState(false);
    const [showSubOptionsMobile, setShowSubOptionsMobile] = useState(false);

    useEffect(() => {
        getSideNavStatus();
    }, [pathname]);

    const getSideNavStatus = () => {
        const currentSideNavStatus: boolean =
            pathname !== '/lobby' &&
            pathname !== '/website/templates/liveEditor' &&
            pathname !== '/profile' &&
            pathname !== '/insights' &&
            pathname !== '/support'
                ? true
                : false;
        setSideNavStatus(currentSideNavStatus);
    };

    return (
        <>
            <Row noGutters className="bg-light">
                <Col lg={collapse ? '1' : '2'} className="d-none d-lg-block">
                    <SideNav collapse={collapse} setCollapse={setCollapse} />
                </Col>
            </Row>
            {auth.token && sideNavStatus ? (
                <Navbar
                    expand="lg"
                    fixed="bottom"
                    bg="dark"
                    variant="dark"
                    className="d-lg-none d-sm-block"
                >
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                    >
                        <Navbar>
                            <Navbar.Brand
                                onClick={() => {
                                    setSelected('website');
                                    setShowSubOptionsWebsite(!showSubOptionsWebsite);
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Icon name="website" height={22} width={22} />
                                </div>
                                <small>Website</small>
                            </Navbar.Brand>

                            {selected === 'website' && showSubOptionsWebsite && (
                                <Navbar.Collapse
                                    id="basic-navbar-nav"
                                    style={{
                                        height: '18vh',
                                        width: '100vw',
                                        position: 'fixed',
                                        bottom: '16vh',
                                        backgroundColor: '#343a40'
                                    }}
                                >
                                    <Nav
                                        className="mr-auto ml-3"
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                        <Nav.Link
                                            href="/theme-library"
                                            style={{ color: 'white', display: 'flex' }}
                                        >
                                            <span className="ml-1">Theme Library</span>
                                        </Nav.Link>
                                        <Nav.Link
                                            href="/live-editor"
                                            style={{ color: 'white', display: 'flex' }}
                                        >
                                            <span className="ml-1">Live Editor</span>
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            )}
                        </Navbar>

                        <Navbar>
                            <Navbar.Brand
                                onClick={() => {
                                    setSelected('mobileApp');
                                    setShowSubOptionsMobile(!showSubOptionsMobile);
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <MobileIcon width={24} height={24} />
                                </div>
                                <small>Mobile Application</small>
                            </Navbar.Brand>

                            {selected === 'mobileApp' && showSubOptionsMobile && (
                                <Navbar.Collapse
                                    id="basic-navbar-nav"
                                    style={{
                                        height: '20vh',
                                        width: '100vw',
                                        position: 'fixed',
                                        bottom: '16vh',
                                        backgroundColor: '#343a40'
                                    }}
                                >
                                    <Nav
                                        className="mr-auto ml-3"
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                        <Nav.Link
                                            href="#"
                                            style={{ color: 'white', display: 'flex' }}
                                        >
                                            <span className="ml-1">Theme Library</span>
                                        </Nav.Link>
                                        <Nav.Link
                                            href="/communication"
                                            style={{ color: 'white', display: 'flex' }}
                                        >
                                            <span className="ml-1">Notification</span>
                                        </Nav.Link>
                                        <Nav.Link
                                            href="/setting"
                                            style={{ color: 'white', display: 'flex' }}
                                        >
                                            <span className="ml-1">Setting</span>
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            )}
                        </Navbar>

                        <Navbar>
                            <Navbar.Brand
                                onClick={() => {
                                    setSelected('');
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Icons width={22} height={22} name="linkicon" />
                                </div>
                                <small>Embeddable Links </small>
                            </Navbar.Brand>
                        </Navbar>
                    </div>
                </Navbar>
            ) : null}

            <div className="d-flex">
                {collapse ? (
                    <div className={`${clsx(classes.side_nav_proxy)}`} />
                ) : (
                    <div
                        className={`${clsx(classes.side_nav_proxy, classes.side_nav_proxy_active)}`}
                    />
                )}
                <Container className="mt-5 pt-3 " style={{ position: 'relative' }}>
                    <div className="d-flex justify-content-between">
                        <h1 style={{ fontSize: '28px' }}>Website Builder</h1>
                        <div className="d-flex" style={{ color: '#fff' }}>
                            <p>Draft</p>
                            <Toggle icons={false} />
                            <p>Publish</p>
                        </div>
                    </div>
                    <hr />

                    <div className="d-flex">
                        <WebsiteBuilder_settings />
                        <WebsiteBuilder_template />
                    </div>

                    <div
                        className="d-flex bg-dark flex-wrap flex-md-nowrap"
                        style={{
                            width: '100%',
                            gap: '20px',
                            marginBottom: '100px',
                            marginTop: '20px',
                            padding: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            textAlign: 'center',
                            borderRadius: '15px',

                            boxShadow:
                                'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
                        }}
                    >
                        <Link
                            to="website/templates"
                            style={{
                                width: '100%'
                            }}
                        >
                            <Button
                                style={{
                                    width: '100%',
                                    paddingBlock: '12px'
                                }}
                                variant="outline-light"
                            >
                                Browse Templates
                            </Button>
                        </Link>
                        <div style={{ fontWeight: 'bold' }}>OR</div>
                        <Button
                            style={{
                                width: '100%',
                                paddingBlock: '12px'
                            }}
                            variant="outline-light"
                        >
                            Contact us for customized website design
                        </Button>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default WebsiteBuilder;
