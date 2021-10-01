import { useMemo } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    OverlayTrigger,
    Popover,
    Row,
    TabContent
} from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

function PaymentWidget({ formData }: any) {
    return (
        <Form>
            <Card.Title>Pricing Plans</Card.Title>
            <hr />
            <Form.Group as={Row}>
                <Form.Label column>No of Days</Form.Label>
                <Col>
                    <Form.Control plaintext readOnly defaultValue={formData.days} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column>No of Hours</Form.Label>
                <Col>
                    <Form.Control plaintext readOnly defaultValue={formData.days} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column>Suggested Pricing</Form.Label>
                <Col>
                    <Form.Control plaintext readOnly defaultValue="Rs. 1000" />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column>Set Pricing</Form.Label>
                <Col>
                    <Form.Control type="number" />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column>Set Voucher?</Form.Label>
                <Col>
                    <Form.Control type="number" />
                    <Form.Text className="text-muted">
                        This voucher can be stored by you.
                    </Form.Text>
                </Col>
            </Form.Group>
        </Form>
    );
}

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
                    placement="bottom"
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
        "1": {
            "name": {
                "ui:autofocus": true
            },
            "level": {
                "ui:widget": "radio",
                "ui:options": {
                    "inline": true
                }
            }
        },
        "2": {
            "summary": {
                "ui:widget": "textarea",
                "ui:autofocus": true,
                "ui:options": {
                    "rows": 3
                }
            },
            "description": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 3
                }
            }
        },
        "3": {
            "items": {
                "about": {
                    "ui:widget": "textarea",
                    "ui:options": {
                        "rows": 3
                    }
                }
            }
        },
        "4": {},
        "5": {
            "ui:field": (props: any) => <PaymentWidget {...props} />
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
                    name="Event Package"
                    isStepper={true}
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