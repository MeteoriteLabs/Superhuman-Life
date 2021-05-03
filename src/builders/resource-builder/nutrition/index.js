import { Badge, Card, CardColumns } from "react-bootstrap";
import Bread from "../../../components/bread";

export default function ResNutritionPage() {
    return (
        <>
            <h4>Recipes</h4>
            <Bread mod="Resources" page="Nutrition" />
            <CardColumns>
                <Card style={{ width: '18rem' }}>
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
                <Card style={{ width: '18rem' }}>
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
                <Card style={{ width: '18rem' }}>
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
