import { useMemo, useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Badge, Button, Card, Modal } from "react-bootstrap";
import Table from "../../components/table";
import packing from "./packing.json";

export default function PackagePage() {
    const [show, setShow] = useState(false);
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
        { accessor: "clients", Header: "Clients" },
        { accessor: "program", Header: "Program" },
        {
            accessor: "status",
            Header: "Status",
            Cell: v => <Badge variant="success">{v.value}</Badge>
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }) => (
                <Button variant="white">
                    <i className="far fa-edit"></i>
                </Button>
            ),
        }
    ], []);
    const data = useMemo(() => [
        {
            "id": 1,
            "image": "/assets/recipe-1.jpg",
            "name": "Nutrition",
            "type": "Recipe",
            "mode": "Online",
            "clients": "",
            "program": "",
            "status": "Active"
        }
    ], []);

    return (
        <Card>
            <Card.Header>
                <h4 className="float-left">Packages</h4>
                <Button className="float-right" onClick={() => setShow(true)}>
                    <i className="fas fa-plus-circle mr-sm-2"></i>
                    Package
                </Button>
                <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
                    <Modal.Body>
                        <Form schema={packing} onSubmit={({ formData }) => console.log("Data submitted: ", formData)} />
                    </Modal.Body>
                </Modal>
            </Card.Header>
            <Card.Body>
                <Table columns={columns} data={data} />
            </Card.Body>
        </Card>
    );
}
