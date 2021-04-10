import { Card, Nav } from "react-bootstrap";
import { useLocation } from "react-router";
import Bread from "../../../components/bread";

const data = {
    "#consult": {
        "title": "Consultation",
        "text": "With supporting text below as a natural lead-in to Consultation content."
    },
    "#nj": {
        "title": "Nutrition Journey",
        "text": "With supporting text below as a natural lead-in to Nutrition Journey content."
    },
    "#cn": {
        "title": "Classic Nutrition",
        "text": "With supporting text below as a natural lead-in to Classic Nutrition content."
    },
    "#mn": {
        "title": "Custom Nutrition",
        "text": "With supporting text below as a natural lead-in to Custom Nutrition content."
    }
}

export default function PackNutritionPage() {
    let { hash } = useLocation();

    if (!hash) {
        hash = "#consult";
    }

    return (
        <>
            <h4>Fitness</h4>
            <Bread mod="Packages" page="Nutrition" />
            <Card>
                <Card.Header>
                    <Nav variant="tabs" defaultActiveKey={hash}>
                        <Nav.Item>
                            <Nav.Link href="#consult">Consultation</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#nj">Nutrition Journey</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#cn">Classic Nutrition</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#mn">Custom Nutrition</Nav.Link>
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
