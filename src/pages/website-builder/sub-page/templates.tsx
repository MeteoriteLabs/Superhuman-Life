import { useState } from 'react';
import SideNav from '../layout/sidenav';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { FETCH_TEMPLATES } from '../queires/templates';
import { useQuery } from '@apollo/client';
import FetchTemplatesResponse, { WebsiteTemplate } from '../@types/websiteTemplates';
import { Card } from '@material-ui/core';
import CardWithImageAndFooter from '../../../components/cards/CardWithImageAndFooter';

function Templates(): JSX.Element {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);

  useQuery(FETCH_TEMPLATES, {
    variables: {
      isPublished: true
    },
    onCompleted: (data: FetchTemplatesResponse) => {
      setTemplates(data.websiteTemplates.data);
    }
  });

  const returnImageAlternating = (index: number): string => {
    if (index % 2 === 0) {
      return '/assets/@demo_templates/template-1.jpeg';
    } else {
      return '/assets/@demo_templates/template-2.jpeg';
    }
  };

  return (
    <>
      <SideNav collapse={collapse} setCollapse={setCollapse} />
      <Container className="my-5 pt-4 position-relative" style={{ paddingLeft: '100px' }}>
        <h1>Templates</h1>
        <div className="d-flex justify-content-between">
          <p>Find the best templates for you requirement</p>
          <div className="d-flex" style={{ gap: 20 }}>
            <div>
              <Button style={{ width: 100 }}>Edit Live</Button>
            </div>
            <div>
              <Button variant="outline-secondary" style={{ width: 100 }}>
                Preview
              </Button>
            </div>
          </div>
        </div>
        <hr />
        <Row>
          <Col xs={5} style={{ borderRadius: '20px', overflow: 'hidden' }}>
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
            templates.map((template: WebsiteTemplate) => (
              <Col lg="4" md="6" xs="12" key={template.id} className="mt-5">
                <CardWithImageAndFooter
                  imgSrc={returnImageAlternating(Number(template.id))}
                  title={template.attributes.template_name}
                />
              </Col>
            ))
          ) : (
            <p>No templates found</p>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Templates;
