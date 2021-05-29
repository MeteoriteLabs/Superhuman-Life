import { useMemo } from "react";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

export default function FitnessTab() {
    const columns = useMemo<any>(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "-",
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
            "image": "/assets/exercise-1.jpg",
            "name": "Exercise-1",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Active"
        },
        {
            "id": 2,
            "image": "/assets/exercise-1.jpg",
            "name": "Exercise-2",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Active"
        }
    ], []);
    const classicSchema: any = require("./classic.json");
    const customSchema: any = require("./custom.json");
    const groupSchema: any = require("./group.json");
    const ptSchema: any = require("./gt.json");
    const uiSchema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
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
        "days": {
            "ui:widget": "checkboxes"
        },
        "group-schedule": {
            "ui:placeholder": "Number of minutes",
        },
        "custom-schedule": {
            "ui:placeholder": "Number of days",
        }
    }

    function onSubmit(formData: any) {
        setTimeout(() => {
            alert("Values submitted: " + JSON.stringify(formData, null, 2));
        }, 1000);
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Classic"
                    formUISchema={uiSchema}
                    formSchema={classicSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom"
                    formUISchema={uiSchema}
                    formSchema={customSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Group"
                    formUISchema={uiSchema}
                    formSubmit={onSubmit}
                    formSchema={groupSchema}
                    formData={{}}
                />{" "}
                <ModalView
                    name="PT"
                    formUISchema={uiSchema}
                    formSchema={ptSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}