import { useMemo } from "react";
import { Badge, Button, Card, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import Event from "./event.json";

export default function EventsTab() {
    const columns = useMemo(() => [
        { accessor: "id", Header: "#" },
        {
            accessor: "image",
            Header: "-",
            Cell: v => <img src={v.value} height="32" alt="thumbnail" />
        },
        { accessor: "name", Header: "Name" },
        { accessor: "type", Header: "Type" },
        { accessor: "mode", Header: "Mode" },
        { accessor: "start", Header: "Start Date" },
        { accessor: "end", Header: "End Date" },
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
                <>
                    <Button variant="white">
                        <i className="far fa-edit"></i>
                    </Button>
                    <Button variant="white">
                        <i className="far fa-trash-alt"></i>
                    </Button>
                </>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "image": "/assets/event-1.jpeg",
            "name": "Event-1",
            "type": "Retreat",
            "mode": "Online",
            "duration": "4 Days",
            "start": "2021-04-25",
            "end": "2021-04-29",
            "price": "400 INR",
            "status": "Active"
        }
    ], []);
    const uiSchema = {
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

    function onSubmit(formData) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Event"
                    formUISchema={uiSchema}
                    formSchema={Event}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}