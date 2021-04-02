import { Badge, Card, CardColumns, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bread from "../../../components/bread";

export default function ResNutritionPage() {
    return (
        <>
            <Row>
                <Col lg="2">
                    <h4>Recipes</h4>
                </Col>
                <Col lg="3">
                    <Link className="btn btn-info btn-sm" to="/resources/nutrition/add">
                        Add Recipe
                    </Link>
                </Col>
                <Col>
                    <Bread mod="Resources" page="Nutrition" />
                </Col>
            </Row>
            <CardColumns className="mt-3">
                <Card>
                    <Card.Img variant="top" src="/assets/recipe-1.jpg" />
                    <Card.Body>
                        <Card.Title>
                            Recipe Name
                            <img alt="non-veg" className="float-right" src="/assets/non-veg.png" />
                        </Card.Title>
                        <Card.Subtitle className="text-muted">Details - Lorem Ipsum</Card.Subtitle>
                        <Card.Text>
                            <Badge variant="secondary">Cuisine</Badge>
                        </Card.Text>
                        <Card.Text><small>K/CAL Details</small></Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src="/assets/recipe-1.jpg" />
                    <Card.Body>
                        <Card.Title>
                            Recipe Name
                            <img alt="veg" className="float-right" src="/assets/veg.png" />
                        </Card.Title>
                        <Card.Subtitle className="text-muted">Details - Lorem Ipsum</Card.Subtitle>
                        <Card.Text>
                            <Badge variant="secondary">Cuisine</Badge>
                        </Card.Text>
                        <Card.Text><small>K/CAL Details</small></Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src="/assets/recipe-1.jpg" />
                    <Card.Body>
                        <Card.Title>
                            Recipe Name
                            <img alt="veg" className="float-right" src="/assets/veg.png" />
                        </Card.Title>
                        <Card.Subtitle className="text-muted">Details - Lorem Ipsum</Card.Subtitle>
                        <Card.Text>
                            <Badge variant="secondary">Cuisine</Badge>
                        </Card.Text>
                        <Card.Text><small>K/CAL Details</small></Card.Text>
                    </Card.Body>
                </Card>
            </CardColumns>
        </>
    );
}
