import { useMemo } from "react";
import {
    Badge,
    Button,
    Card,
    Dropdown,
    Form,
    OverlayTrigger,
    Popover,
    TabContent
} from "react-bootstrap";
import CreateFitnessPackageModal from "../../../components/CreateFitnessPackageModal/CreateFitnessPackageModal";
import Table from "../../../components/table";

function PaymentWidget({ formData }: any) {
    return (
        <Card className="text-center">
            <Card.Body>
                <Form.Group>
                    <Form.Label>Apply Voucher?</Form.Label>
                    <Form.Control />
                    <Form.Text className="text-muted">
                        This voucher can be stored by you.
                    </Form.Text>
                </Form.Group>
                <Card.Title>Pricing Plans</Card.Title>
                <hr />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Details</th>
                            <th>Monthly</th>
                            <th>Quaterly</th>
                            <th>Halferly</th>
                            <th>Yearly</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Consultation</th>
                            <td>01 Session</td>
                            <td>75 Sessions</td>
                            <td>150 Sessions</td>
                            <td>300 Sessions</td>
                        </tr>
                        <tr>
                            <th>PT Offline</th>
                            <td>04 Class</td>
                            <td>75 Class</td>
                            <td>150 Class</td>
                            <td>300 Class</td>
                        </tr>
                        <tr>
                            <th>Group Offline</th>
                            <td>04 Class</td>
                            <td>75 Class</td>
                            <td>150 Class</td>
                            <td>300 Class</td>
                        </tr>
                        <tr>
                            <th>Suggested Prices</th>
                            <td className="text-muted">Rs. 2000</td>
                            <td className="text-muted">Rs. 2000</td>
                            <td className="text-muted">Rs. 2000</td>
                            <td className="text-muted">Rs. 2000</td>
                        </tr>
                        <tr>
                            <th>Set Prices</th>
                            <td><Form.Control /></td>
                            <td><Form.Control /></td>
                            <td><Form.Control /></td>
                            <td><Form.Control /></td>
                        </tr>
                    </tbody>
                </table>
            </Card.Body>
        </Card>
    );
}

export default function JourneyTab() {
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
            "image": "/assets/journey-1.jpeg",
            "name": "Journey-1",
            "type": "Marathon",
            "details": "Marathon Details",
            "duration": "4 Hours",
            "price": "Free",
            "status": "Active"
        },
        {
            "id": 2,
            "image": "/assets/journey-1.jpeg",
            "name": "Journey-2",
            "type": "Marathon",
            "details": "Marathon Details",
            "duration": "4 Hours",
            "price": "Free",
            "status": "Active"
        }
    ], []);
    const journeySchema: any = require("./journey.json");
    const uiSchema: any = {
        "1": {
            "level": {
                "ui:widget": "radio",
                "ui:options": {
                    "inline": true
                }
            }
        },
        "2": {
            "about": {
                "ui:widget": "textarea",
                "ui:autofocus": true,
                "ui:options": {
                    "rows": 3
                }
            },
            "benefits": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 3
                }
            }
        },
        "3": {
            "mode": {
                "ui:widget": "radio",
                "ui:options": {
                    "inline": true
                }
            }
        }
        ,
        "4": {
            "schedule": {
                "ui:placeholder": "Number of days",
            }
        },
        "5": {
            "ui:field": "payment"
        }
    }
    const fields = { payment: PaymentWidget }

    function onSubmit(formData: any) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <CreateFitnessPackageModal
             
                    stepperValues={["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"]}
                    name="Journey Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={journeySchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    formFields={fields}
                />
            </Card.Title>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}