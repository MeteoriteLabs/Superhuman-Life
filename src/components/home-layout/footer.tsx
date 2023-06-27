import { Row, Container, Col, ListGroup } from 'react-bootstrap';

export default function HomeFooter() {
    return (
        <footer className="py-2">
            <Container fluid>
                <Row>
                    <Col>
                        <img
                            src="/assets/sapien-logo-footer.svg"
                            width="150"
                            className="d-inline-block align-top"
                            alt="Sapien"
                        />
                        <p>
                            To empower changemakers to learn, collabrate, build integrative
                            experineces and smoothen processes to impact peoples lives effectively.
                        </p>
                    </Col>
                    <Col>
                        <ListGroup variant="flush">
                            <ListGroup.Item>About</ListGroup.Item>
                            <ListGroup.Item>About Us</ListGroup.Item>
                            <ListGroup.Item>FAQs</ListGroup.Item>
                            <ListGroup.Item>Privacy Policy</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        <p>Follow Us</p>
                    </Col>
                    <Col>
                        #BeAChangeMaker
                        <p>Inviting Coaches, Trainers, Nutritionists and Dietitions</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
