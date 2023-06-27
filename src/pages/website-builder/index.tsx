import { FC, useState } from 'react';
import SideNav from './layout/sidenav';
import 'react-toggle/style.css';
import { Button, Container } from 'react-bootstrap';
import WebsiteBuilder_settings from './components/websiteBuilder_settings';
import WebsiteBuilder_template from './components/websiteBuilder_template';

const WebsiteBuilder: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);

  return (
    <>
      <SideNav collapse={collapse} setCollapse={setCollapse} />
      <div className="d-flex">
        {collapse ? (
          <div style={{ width: '80px', height: '90vh', content: '' }} />
        ) : (
          <div style={{ width: '200px', height: '90vh', content: '' }} />
        )}
        <Container className="mt-5 pt-3 px-3" style={{ position: 'relative' }}>
          <WebsiteBuilder_settings />
          <WebsiteBuilder_template />

          <div
            className="d-flex"
            style={{
              width: '100%',
              gap: '60px',
              background: '#000',
              marginBottom: '100px',
              marginTop: '90px',
              padding: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '15px',
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
            }}>
            <Button
              style={{
                width: '100%',
                paddingBlock: '12px'
              }}
              variant="outline-light">
              Browse Templates
            </Button>
            <div style={{ fontWeight: 'bold' }}>OR</div>
            <Button
              style={{
                width: '100%',
                paddingBlock: '12px'
              }}
              variant="outline-light">
              Contact us for customized website design
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default WebsiteBuilder;
