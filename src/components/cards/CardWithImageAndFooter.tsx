import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from './cardStyles.module.css';
import { Eye } from 'react-bootstrap-icons';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { WebsiteTemplate } from '../../pages/website-builder/@types/websiteTemplates';
function CardWithImageAndFooter({
  title,
  imgSrc,
  infoHandler,
  data
}: {
  title: string;
  imgSrc: string;
  infoHandler: (data: WebsiteTemplate) => void;
  data: WebsiteTemplate;
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
        <Card.Img variant="top" src={imgSrc} />
      </div>
      <Card.Body>
        <Row>
          <Col xs="10">
            <Card.Title className={style.title}>{title}</Card.Title>
          </Col>
          <Col xs="1">
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
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardWithImageAndFooter;
