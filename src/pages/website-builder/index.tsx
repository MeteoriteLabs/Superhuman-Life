import { FC, useState } from 'react';
import SideNav from './layout/sidenav';
import 'react-toggle/style.css';
import { Container } from 'react-bootstrap';
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
        </Container>
      </div>
    </>
  );
};

export default WebsiteBuilder;
