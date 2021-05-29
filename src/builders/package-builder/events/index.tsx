import { useMemo } from "react";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

export default function EventsTab() {
    const columns = useMemo<any>(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "-",
            Cell: (v: any) => <img src={v.value} height="32" alt="thumbnail" />
        },
        { accessor: "name", Header: "Name" },
        { accessor: "type", Header: "Type" },
        { accessor: "start", Header: "Start Date" },
        { accessor: "end", Header: "End Date" },
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
            "image": "/assets/event-1.jpeg",
            "name": "Event-1",
            "type": "Retreat",
            "duration": "4 Days",
            "start": "2021-04-25",
            "end": "2021-04-29",
            "price": "400 INR",
            "status": "Active"
        },
        {
            "id": 2,
            "image": "/assets/event-1.jpeg",
            "name": "Event-2",
            "type": "Retreat",
            "duration": "4 Days",
            "start": "2021-04-25",
            "end": "2021-04-29",
            "price": "400 INR",
            "status": "Active"
        }
    ], []);
    const eventSchema: any = require("./event.json");
    const uiSchema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "summary": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "description": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "items": {
            "about": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 3
                }
            }
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
                    name="Event"
                    formUISchema={uiSchema}
                    formSchema={eventSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}