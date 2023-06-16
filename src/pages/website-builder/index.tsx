import { FC, useContext, useEffect, useState } from 'react';
import SideNav from './layout/sidenav';
import authContext from '../../context/auth-context';
import { useLazyQuery } from '@apollo/client';
import { FETCH_USER_WEBSITE } from './queries/changemakerWebsite';
import 'react-toggle/style.css';
import { Container } from 'react-bootstrap';
import WebsiteBuilder_settings from './components/websiteBuilder_settings';
import WebsiteBuilder_template from './components/websiteBuilder_template';
const WebsiteBuilder: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [websiteSettings, setWebsiteSettings] = useState({
    subdomain: '',
    domain: '',
    selectedTemplate: '',
    error: ''
  });

  const auth = useContext(authContext);

  const [getUserWebsite, { data, error }] = useLazyQuery(FETCH_USER_WEBSITE, {
    variables: {
      id: auth.userid
    },
    onCompleted: () => {
      setWebsiteSettings({
        ...websiteSettings,
        subdomain: data.changemakerWebsites.data[0].attributes.subdomain as string,
        selectedTemplate: data.changemakerWebsites.data[0].attributes.selectedTemplate as string
      });
    },
    onError: () => {
      if (error?.message) {
        setWebsiteSettings({
          ...websiteSettings,
          error: error?.message
        });
      }
    }
  });
  useEffect(() => {
    getUserWebsite();
  }, []);

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
          <WebsiteBuilder_settings
            websiteSettings={websiteSettings}
            setWebsiteSettings={setWebsiteSettings}
          />
          <WebsiteBuilder_template websiteSettings={websiteSettings} />
        </Container>
      </div>
    </>
  );
};

export default WebsiteBuilder;
