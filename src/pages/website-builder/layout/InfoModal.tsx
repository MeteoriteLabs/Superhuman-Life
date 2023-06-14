import { Template } from '../@types/websiteTemplates';
import { ArrowRight, CheckCircle } from 'react-bootstrap-icons';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';

import style from './info.module.css';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

function InfoModal({
  data,
  setInfoData
}: {
  data: Template;
  setInfoData: (data: Template | null) => void;
}): JSX.Element {
  const handleClose = () => {
    setInfoData(null);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  const history = useHistory();
  const handleNavigation = () => {
    localStorage.setItem(
      'selectedTemplate',
      JSON.stringify({ id: data.id, name: data.attributes.templateName })
    );

    history.push('/website/templates/liveEditor');
  };

  return (
    <Modal show={!!data} onHide={handleClose} className={style.modal}>
      <Modal.Body>
        <Modal.Header closeButton className="mb-4">
          <h3 className={style.templateName}>{data.attributes.templateName}</h3>
        </Modal.Header>
        <div className="position-relative">
          <div className={style.thumbnailCont}>
            <img src={data.attributes.thumbnail} className={style.thumbnail} width={1200} />
          </div>
          <Row className="mt-3">
            <Col className="mt-3">
              <h3 className={style.subheadings}>Good For</h3>

              <ListGroup className="mt-3">
                {data.attributes.goodFor.length > 0
                  ? data.attributes.goodFor.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {' '}
                        <CheckCircle className="text-success m-0 mr-2" />
                        {item}
                      </ListGroup.Item>
                    ))
                  : null}
              </ListGroup>
            </Col>
            <Col className="mt-3">
              <h3 className={style.subheadings}>Features</h3>

              <ListGroup className="mt-3">
                {data.attributes.features.length > 0
                  ? data.attributes.features.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {' '}
                        <CheckCircle className="text-success m-0 mr-2" />
                        {item}
                      </ListGroup.Item>
                    ))
                  : null}
              </ListGroup>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-end mt-5">
          <Button variant="primary" className="py-2 px-4 " onClick={handleNavigation}>
            Go to Live Editor <ArrowRight className="m-0 mb-1 ml-1" />
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default InfoModal;
