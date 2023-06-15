import { useEffect, useState } from 'react';
import SideNav from '../layout/sidenav';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

import { FETCH_TEMPLATES } from '../queries/templates';
import { useQuery } from '@apollo/client';
import { FetchedTemplates, Template } from '../@types/websiteTemplates';
import CardWithImageAndFooter from '../../../components/cards/CardWithImageAndFooter';
import InfoModal from '../layout/InfoModal';

function Templates(): JSX.Element {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [infoData, setInfoData] = useState<Template | null>(null);

  useQuery(FETCH_TEMPLATES, {
    variables: {
      isPublished: true
    },
    onCompleted: (data: FetchedTemplates) => {
      setTemplates(data.templates.data);
    }
  });

  useEffect(() => {
    console.log(infoData);
  }, [infoData]);

  const infoHandler = (data: Template): void => {
    setInfoData(data);
  };

  return (
    <>
      <SideNav collapse={collapse} setCollapse={setCollapse} />
      <div className="position-relative">
        <Container className="my-5 pt-4 position-relative" style={{ paddingLeft: '100px' }}>
          <h1>Templates</h1>
          <div className="d-flex justify-content-between">
            <p>Find the best templates for you requirement</p>
            {/* <div className="d-flex" style={{ gap: 20 }}>
              <div>
                <Button style={{ width: 100 }}>Edit Live</Button>
              </div>
              <div>
                <Button variant="outline-secondary" style={{ width: 100 }}>
                  Preview
                </Button>
              </div>
            </div> */}
          </div>
          <hr />
          <Row>
            <Col xs={5} style={{ borderRadius: '20px' }}>
              <InputGroup className="mb-3 position-relative">
                <Form.Control
                  placeholder="Template name"
                  aria-label="template name"
                  aria-describedby="basic-addon2"
                />
                <div className="mt-2 position-absolute" style={{ right: 15, borderRadius: '20px' }}>
                  <Search width={22} height={22} color="#aaa" />
                </div>
              </InputGroup>
            </Col>
            <Col xs={5}>
              <Button variant="secondary" style={{ width: 100 }}>
                Filter
              </Button>
            </Col>
          </Row>
          <Row>
            {templates.length > 0 ? (
              templates.map((template, id) => (
                <Col lg="4" md="6" xs="12" key={id} className="mt-5">
                  <CardWithImageAndFooter infoHandler={infoHandler} data={template} />
                </Col>
              ))
            ) : (
              <div className="ml-4 mt-2">
                <h4>Loading templates...</h4>
              </div>
            )}
          </Row>
        </Container>
        {infoData ? <InfoModal data={infoData} setInfoData={setInfoData} /> : ''}
      </div>
    </>
  );
}

export default Templates;
