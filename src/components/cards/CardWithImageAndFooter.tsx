import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from './cardStyles.module.css';
import { Eye } from 'react-bootstrap-icons';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
function CardWithImageAndFooter({ title, imgSrc }: { title: string; imgSrc: string }): JSX.Element {
  return (
    <Card className={style.card}>
      <Card.Img variant="top" src={imgSrc} />
      <Card.Body>
        <Row>
          <Col xs="10">
            <Card.Title className={style.title}>{title}</Card.Title>
          </Col>
          <Col xs="1">
            <OverlayTrigger overlay={<Tooltip id={''}>Preview</Tooltip>}>
              <Button
                variant="primary"
                style={{
                  height: 28,
                  borderRadius: 30,
                  width: 30,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 0
                }}>
                <Eye className="mt-3" />
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default CardWithImageAndFooter;
