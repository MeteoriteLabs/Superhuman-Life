import { useMemo } from "react";
import { Badge, Button, Card, CardColumns } from "react-bootstrap";
import Bread from "../../../components/bread";
import Table from "../../../components/table";

export default function ResNutritionPage() {
    const columns = useMemo(() => [
        { accessor: "id", Header: "#" },
        {
            id: "image",
            Header: "Thumbnail",
            Cell: ({ row }) => (
                <img alt="thumbnail" height="42" src="/assets/recipe-1.jpg" />
            ),
        },
        { accessor: "name", Header: "Name" },
        { accessor: "details", Header: "Details" },
        { accessor: "cuisine", Header: "Cuisine" },
        { accessor: "calorie", Header: "K/Cal Details" },
        { accessor: "veg", Header: "Veg/Non-Veg" },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }) => (
                <Button variant="info">
                    <i className="far fa-edit"></i>
                </Button>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "name": "Recipe Name",
            "details": "Recipe Details",
            "cuisine": "Chinese",
            "calorie": 100, "veg": "Veg"
        },
        {
            "id": 2,
            "name": "Recipe Name",
            "details": "Recipe Details",
            "cuisine": "Mexican",
            "calorie": 120, "veg": "Non-Veg"
        }
    ], []);

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
            <hr />
            <Card>
                <Card.Body>
                    <Table columns={columns} data={data} />
                </Card.Body>
            </Card>
        </>
    );
}
