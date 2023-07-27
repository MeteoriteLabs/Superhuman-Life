import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import style from './cardStyles.module.css';
import { Col, Row } from 'react-bootstrap';
import { Template } from 'pages/website-builder/@types/websiteTemplates';

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
                <a href={`https://${data.attributes.templateUrl}`} target="_blank" rel="noreferrer">
                    <Button variant="light" className={style.overlayButton}>
                        Live Preview
                    </Button>
                </a>
                <Button
                    variant="light"
                    className={style.overlayButton}
                    onClick={() => infoHandler(data)}
                >
                    Details
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
                        <Card.Title className={style.title}>
                            {data.attributes.templateName}
                        </Card.Title>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardWithImageAndFooter;
