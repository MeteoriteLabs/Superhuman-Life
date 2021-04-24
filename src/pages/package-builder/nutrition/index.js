import { useMemo } from "react";
import { Badge, Button, ButtonGroup, Card, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

export default function NutritionTab() {
    const columns = useMemo(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "",
            Cell: v => <img src={v.value} height="32" alt="thumbnail" />
        },
        { accessor: "name", Header: "Name" },
        { accessor: "type", Header: "Type" },
        { accessor: "mode", Header: "Mode" },
        { accessor: "details", Header: "Details" },
        { accessor: "duration", Header: "Duration" },
        { accessor: "price", Header: "Price" },
        {
            accessor: "status",
            Header: "Status",
            Cell: v => <Badge variant="success">{v.value}</Badge>
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }) => (
                <ButtonGroup>
                    <Button variant="white">
                        <i className="far fa-edit"></i>
                    </Button>
                    <Button variant="white">
                        <i className="far fa-trash-alt"></i>
                    </Button>
                    <Button variant="white">
                        <i className="far fa-copy"></i>
                    </Button>
                </ButtonGroup>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "image": "/assets/recipe-1.jpg",
            "name": "Recipe-1",
            "type": "Veg",
            "mode": "Offline",
            "details": "Recipe Details",
            "duration": "2 Hours",
            "price": "50 INR",
            "status": "Active"
        }
    ], []);

    function onSubmit({ formData }) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView name="Classic Meal" formSchema={{}} formSubmit={onSubmit} />{" "}
                <ModalView name="Consultation" formSchema={{}} formSubmit={onSubmit} />{" "}
                <ModalView name="Custom Meal" formSchema={{}} formSubmit={onSubmit} />{" "}
                <ModalView name="Custom" formSchema={{}} formSubmit={onSubmit} />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}