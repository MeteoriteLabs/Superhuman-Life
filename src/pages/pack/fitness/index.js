import { Card, Nav } from "react-bootstrap";
import { useLocation } from "react-router";
import Bread from "../../../components/bread";

const data = {
    "#pt": {
        "title": "Personal Training",
        "text": "With supporting text below as a natural lead-in to Personal Training content."
    },
    "#cf": {
        "title": "Custom Fitness",
        "text": "With supporting text below as a natural lead-in to Custom Fitness content."
    },
    "#cw": {
        "title": "Classic Workout",
        "text": "With supporting text below as a natural lead-in to Classic Workout content."
    },
    "#cp": {
        "title": "Personal Programs",
        "text": "With supporting text below as a natural lead-in to Personal Programs content."
    },
    "#gc": {
        "title": "Group Class",
        "text": "With supporting text below as a natural lead-in to Group Class content."
    }
}

export default function PackFitnessPage() {
    let { hash } = useLocation();

    if (!hash) {
        hash = "#pt";
    }

    return (
        <>
            <h4>Fitness</h4>
            <Bread mod="Packages" page="Fitness" />
            <Card>
                <Card.Header>
                    <Nav variant="tabs" defaultActiveKey={hash}>
                        <Nav.Item>
                            <Nav.Link href="#pt">Personal Training</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#cf">Custom Fitness</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#cw">Classic Workout</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#cp">Classic Programs</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#gc">Group Class</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{data[hash].title}</Card.Title>
                    <Card.Text>
                        {data[hash].text}
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}
