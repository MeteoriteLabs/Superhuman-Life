import { Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bread from "../../../components/bread";

export default function MessagePage() {
    return (
        <>
            <Row>
                <Col lg="3">
                    <h4>Messages</h4>
                </Col>
                <Col lg="3">
                    <Link className="btn btn-info btn-sm" to="/resources/messages/add">
                        Add Message
                    </Link>
                </Col>
                <Col>
                    <Bread mod="Resources" page="Messages" />
                </Col>
            </Row>
            <div className="pt-3">
                <ListGroup>
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </div>
        </>
    );
}
