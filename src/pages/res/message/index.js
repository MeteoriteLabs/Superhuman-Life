import { Card, ListGroup } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function MessagePage() {
    return (
        <>
            <h4>Messages</h4>
            <Bread mod="Resources" page="Messages" />
            <Card>
                <Card.Header>Featured</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </Card>
        </>
    );
}
