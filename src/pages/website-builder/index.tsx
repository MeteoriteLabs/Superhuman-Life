import { FC, useContext, useEffect, useState } from 'react';
import SideNav from './layout/sidenav';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { Link } from 'react-router-dom';
import authContext from '../../context/auth-context';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FETCH_USER_WEBSITE } from './queries/changemakerWebsite';

const WebsiteBuilder: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [draftToggle, setDraftToggle] = useState<boolean>(false);
  const [lastPublished, setLastPublished] = useState<string>('');
  const [myTemplate, setMyTemplate] = useState<string>('');
  const [websiteSettings, setWebsiteSettings] = useState({
    subdomain: '',
    domain: '',
    selectedTemplate: '',
    error: ''
  });

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

  const auth = useContext(authContext);

  const [getUserWebsite, { loading, data, error }] = useLazyQuery(FETCH_USER_WEBSITE, {
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
      </div>
    </>
  );
};

export default WebsiteBuilder;
