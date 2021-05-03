import { useMemo } from "react";
import { Badge, Button, ButtonGroup, Card, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import Classic from "./classic.json";
import Custom from "./custom.json";
import Group from "./group.json";
import GT from "./gt.json";

export default function FitnessTab() {
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
                </ButtonGroup>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "image": "/assets/exercise-1.jpg",
            "name": "Exercise-1",
            "type": "PT",
            "mode": "Offline",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
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

    function onSubmit(formData) {
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
                    formSchema={Classic}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom"
                    formUISchema={uiSchema}
                    formSchema={Custom}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Group"
                    formUISchema={uiSchema}
                    formSubmit={onSubmit}
                    formSchema={Group}
                    formData={{}}
                />{" "}
                <ModalView
                    name="PT"
                    formUISchema={uiSchema}
                    formSchema={GT}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}