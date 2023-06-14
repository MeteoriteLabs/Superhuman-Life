import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from './cardStyles.module.css';
import { Eye } from 'react-bootstrap-icons';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Template } from '../../pages/website-builder/@types/websiteTemplates';

function CardWithImageAndFooter({
  infoHandler,
  data
}: {
  infoHandler: (data: Template) => void;
  data: Template;
}): JSX.Element {
  const renderOverlay = () => {
    return (
      <div className={style.overlayContent}>
        <Button variant="light" className={style.overlayButton}>
          Edit Live
        </Button>
        <Button variant="light" className={style.overlayButton} onClick={() => infoHandler(data)}>
          Info
        </Button>
      </div>
    );
  };

  return (
    <Card className={style.card}>
      <div className="position-relative">
        {renderOverlay()}
        <Card.Img variant="top" src={data.attributes.thumbnail} />
      </div>
      <Card.Body>
        <Row>
          <Col xs="10">
            <Card.Title className={style.title}>{data.attributes.templateName}</Card.Title>
          </Col>
          <Col xs="1">
            <a href={`https://${data.attributes.templateUrl}`} target="_blank" rel="noreferrer">
              <OverlayTrigger overlay={<Tooltip id={''}>Preview</Tooltip>}>
                <Button
                  variant="dark"
                  style={{
                    height: 20,
                    borderRadius: 30,
                    width: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 3
                  }}>
                  <Eye className="mt-3" color="#fff" />
                </Button>
              </OverlayTrigger>
            </a>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardWithImageAndFooter;
