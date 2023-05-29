import { FC, useState } from 'react';
import SideNav from './layout/sidenav';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { Link } from 'react-router-dom';

const WebsiteBuilder: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [draftToggle, setDraftToggle] = useState<boolean>(false);
  const [lastPublished, setLastPublished] = useState<string>('');
  const [myTemplate, setMyTemplate] = useState<string>('');
  const [websiteContent, setWebsiteContent] = useState<string>('');

  const handleToggle = () => {
    setDraftToggle(draftToggle === false ? true : false);
  };

  const heading = (str) => {
    return (
      <div>
        <h1 style={{ fontWeight: 400, fontSize: '30px' }}>{str}</h1>
      </div>
    );
  };

  const customButton = (str, color?) => {
    return (
      <Button
        variant="outline-secondary"
        style={{
          width: '200px',
          color: color ? color : 'initial',
          border: color ? `1px solid ${color}` : ''
        }}>
        {str}
      </Button>
    );
  };

  return (
    <>
      <SideNav collapse={collapse} setCollapse={setCollapse} />
      <div className="d-flex">
        {collapse ? (
          <div style={{ width: '80px', height: '100vh', content: '' }} />
        ) : (
          <div style={{ width: '200px', height: '100vh', content: '' }} />
        )}

        <Container className="mt-5 pt-3 px-3" style={{ position: 'relative' }}>
          <section>
            <Row>
              <Col xs="8" md="8" lg="9">
                {heading('Website Builder')}
              </Col>
              <Col xs="4" md="4" lg="2" style={{ width: '200px' }}>
                <div className="d-flex" style={{ gap: 10 }}>
                  <p>Draft</p>
                  <label>
                    <Toggle defaultChecked={draftToggle} icons={false} onChange={handleToggle} />
                  </label>
                  <p>Publish</p>
                </div>
                <p>Last Published: {lastPublished}</p>
              </Col>
            </Row>
            <div
              className="d-flex flex-column rounded"
              style={{
                gap: '30px',
                maxWidth: '300px'
              }}>
              <div>
                <label>Community Website:</label>
                <input type="text" className="form-control" />
              </div>
              <div>
                <label>Personal Website:</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <Row>
              <Col xs="12">
                <div className="d-flex justify-content-end my-5">{customButton('Preview')}</div>
              </Col>
            </Row>
            <hr />
          </section>
          <section>
            <div className="mt-5 d-flex justify-content-between">
              <div>{heading('My Template')}</div>
              <Link to="/website/templates">
                <div>{customButton('Browse All Templates')}</div>
              </Link>
            </div>
            <div className="w-100 d-flex justify-content-center pt-5 position-relative">
              {myTemplate ? (
                ''
              ) : (
                <div
                  style={{
                    width: '500px',
                    height: '300px',
                    content: '',
                    backgroundColor: '#232323',
                    borderRadius: '12px',
                    marginTop: '60px',
                    marginBottom: '80px'
                  }}
                  className="mx-auto d-flex justify-content-center align-items-center">
                  {customButton('Show Templates', '#fff')}
                </div>
              )}
            </div>
            <hr />
          </section>
          <section>
            <div className="mt-5 d-flex justify-content-between">
              <div>{heading('Website Content')}</div>
              <div>{customButton('Manage Pages & Sections')}</div>
            </div>
            <div className="w-100 d-flex justify-content-center pt-5 position-relative">
              {myTemplate ? (
                ''
              ) : (
                <div
                  style={{
                    width: '500px',
                    height: '300px',
                    content: '',
                    backgroundColor: '#232323',
                    borderRadius: '12px',
                    marginTop: '60px',
                    marginBottom: '80px'
                  }}
                  className="mx-auto d-flex justify-content-center align-items-center position-relative">
                  {customButton('Show Templates', '#fff')}

                  <div className="position-absolute" style={{ bottom: 10, color: '#fff' }}>
                    ~ No template selected ~
                  </div>
                </div>
              )}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
};

export default WebsiteBuilder;
