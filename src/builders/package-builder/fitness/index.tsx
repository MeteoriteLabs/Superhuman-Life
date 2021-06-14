import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";

const GET_FITNESS = gql`{
    fitnesspackages {
      packagename
      intropicture {
        url
      }
      packagetype
      ptoffline
      ptonline
      groupoffline
      grouponline
      recordedclasses
      discipline {
        disciplinename
      }
      fitnesspackagepricing {
        packagepricing
      }
      duration
    }
  }
  `;

export default function FitnessTab() {
    const columns = useMemo<any>(() => [
        {
            accessor: "intropicture",
            Header: "-",
            Cell: (v: any) => <img src={v.url} height="32" alt="thumbnail" />
        },
        { accessor: "packagename", Header: "Name" },
        { accessor: "packagetype", Header: "Type" },
        {
            accessor: "discipline",
            Header: "Details",
            Cell: (v: any) => <>{v.value.disciplinename}</>
        },
        { accessor: "duration", Header: "Duration" },
        {
            accessor: "fitnesspackagepricing",
            Header: "Price",
            Cell: (v: any) => <>{v.value[0].packagepricing[0].mrp}</>
        },
        {
            id: "status",
            Header: "Status",
            Cell: (v: any) => <Badge variant="success">Active</Badge>
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
    const { loading, error, data } = useQuery(GET_FITNESS);
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
    let fitnessData: String[] = [];

    function onSubmit(formData: any) {
        setTimeout(() => {
            alert("Values submitted: " + JSON.stringify(formData, null, 2));
        }, 1000);
    }

    if (!loading && !error) {
        fitnessData = data.fitnesspackages;
    }


    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Classic Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={classicSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={customSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Group Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSubmit={onSubmit}
                    formSchema={groupSchema}
                    formData={{}}
                />{" "}
                <ModalView
                    name="PT Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={ptSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            {loading ? <code>Loading...</code> : <Table columns={columns} data={fitnessData} />}
        </TabContent>
    );
}