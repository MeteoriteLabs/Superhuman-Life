import { useMemo } from "react";
import { Badge, Button, ButtonGroup, Card, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import ClassicMeal from "./classic-meal.json";
import Consultation from "./consultation.json";
import CustomMeal from "./custom-meal.json";
import Custom from "./custom.json";

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
    const uiSchema = {
        "about": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "schedule": {
            "ui:placeholder": "Number of days",
        }
    }

    function onSubmit(formData) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Classic Meal"
                    formUISchema={uiSchema}
                    formSchema={ClassicMeal}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Consultation"
                    formUISchema={uiSchema}
                    formSchema={Consultation}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom Meal"
                    formUISchema={uiSchema}
                    formSchema={CustomMeal}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom"
                    formUISchema={uiSchema}
                    formSchema={Custom}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}