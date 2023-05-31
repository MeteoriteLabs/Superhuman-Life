import { WebsiteTemplate } from '../@types/websiteTemplates';
import { ArrowRight, CheckCircle } from 'react-bootstrap-icons';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';

import style from './info.module.css';
import { Link } from 'react-router-dom';

function InfoModal({
  data,
  returnImageAlternating,
  setInfoData
}: {
  data: WebsiteTemplate;
  returnImageAlternating: (data: number) => string;
  setInfoData: (data: WebsiteTemplate | null) => void;
}): JSX.Element {
  const handleClose = () => {
    setInfoData(null);
  };

  return (
    <Modal show={!!data} onHide={handleClose} className={style.modal}>
      <Modal.Body>
        <Modal.Header closeButton className="mb-4">
          <h3 className={style.templateName}>{data.attributes.template_name}</h3>
        </Modal.Header>
        <div className="position-relative">
          <div className={style.thumbnailCont}>
            <img
              src={returnImageAlternating(Number(data.id))}
              className={style.thumbnail}
              width={1200}
            />
          </div>
          <Row className="mt-3">
            <Col className="mt-3">
              <h3 className={style.subheadings}>Good For</h3>

              <ListGroup className="mt-3">
                <ListGroup.Item>
                  <CheckCircle className="text-success m-0 mr-2" />
                  Coaches
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Consultants
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Athletes
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Influencers
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className="mt-3">
              <h3 className={style.subheadings}>Features</h3>

              <ListGroup className="mt-3">
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Gallery Sections
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Testimonials
                </ListGroup.Item>
                <ListGroup.Item>
                  {' '}
                  <CheckCircle className="text-success m-0 mr-2" />
                  Offerings
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-end mt-5">
          <Link to={`/website/templates/liveEditor`}>
            <Button variant="primary" className="py-2 px-4 ">
              Go to Live Editor <ArrowRight className="m-0 mb-1 ml-1" />
            </Button>
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default InfoModal;
