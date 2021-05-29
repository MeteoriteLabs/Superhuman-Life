import { useMemo, useState } from "react";
import { Badge, Button, Card, Dropdown, Modal, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

export default function NutritionTab() {
    const columns = useMemo<any>(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "",
            Cell: (v: any) => <img src={v.value} height="32" alt="thumbnail" />
        },
        { accessor: "name", Header: "Name" },
        { accessor: "type", Header: "Type" },
        { accessor: "details", Header: "Details" },
        { accessor: "duration", Header: "Duration" },
        { accessor: "price", Header: "Price" },
        {
            accessor: "status",
            Header: "Status",
            Cell: (v: any) => <Badge variant="success">{v.value}</Badge>
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => (
                <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={
                        <Popover id="action-popover">
                            <Popover.Content>
                                <Dropdown.Item>View</Dropdown.Item>
                                <Dropdown.Item>Status</Dropdown.Item>
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>Delete</Dropdown.Item>
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <Button variant="white">
                        <i className="fas fa-ellipsis-v"></i>
                    </Button>
                </OverlayTrigger>
            ),
        }
    ], []);
    const data = useMemo<any>(() => [
        {
            "id": 1,
            "image": "/assets/recipe-1.jpg",
            "name": "Recipe-1",
            "type": "Veg",
            "details": "Recipe Details",
            "duration": "2 Hours",
            "price": "50 INR",
            "status": "Active"
        },
        {
            "id": 2,
            "image": "/assets/recipe-1.jpg",
            "name": "Recipe-2",
            "type": "Non-Veg",
            "details": "Recipe Details",
            "duration": "2 Hours",
            "price": "50 INR",
            "status": "Active"
        }
    ], []);
    const [customShow, setCustomShow] = useState(false);
    const classicMealSchema: any = require("./classic-meal.json");
    const consultSchema: any = require("./consultation.json");
    const customMealSchema: any = require("./custom-meal.json");
    const customSchema: any = require("./custom.json");
    const uiSchema: any = {
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
        "consult": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "schedule": {
            "ui:placeholder": "Number of days",
        }
    }

    function onSubmit(formData: any) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Classic Meal"
                    formUISchema={uiSchema}
                    formSchema={classicMealSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Consultation"
                    formUISchema={uiSchema}
                    formSchema={consultSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom Meal"
                    formUISchema={uiSchema}
                    formSchema={customMealSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <Button variant="secondary" size="sm" onClick={() => setCustomShow(true)}>
                    <i className="fas fa-plus-circle"></i>{" "}Custom
                </Button>
                <Modal size="sm" show={customShow} onHide={() => setCustomShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title as="p">
                            <mark>New Custom Nutrition Package</mark>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ModalView
                            name="Package"
                            formUISchema={uiSchema}
                            formSchema={customSchema}
                            formSubmit={onSubmit}
                            formData={{}}
                        />{" "}
                        <ModalView
                            name="Program"
                            formUISchema={uiSchema}
                            formSchema={customSchema}
                            formSubmit={onSubmit}
                            formData={{}}
                        />
                    </Modal.Body>
                </Modal>
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}