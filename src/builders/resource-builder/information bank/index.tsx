import {useMemo} from 'react'
import {Button,TabContent,InputGroup,FormControl,OverlayTrigger,Popover,Dropdown,Card,Container,Row,Col} from "react-bootstrap";
import Table from "../../../components/table";
import ModalView from "../../../components/modal";


export default function InformationPage() {

    const columns = useMemo<any>(() => [
        { accessor: "title", Header: "Title" },
        {
            accessor: "type",Header: "Type",
        },
        { accessor: "desc", Header: "Description" },
        { accessor: "updatedon", Header: "Updated On" },
        
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
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>View</Dropdown.Item>
                                <Dropdown.Item>Status</Dropdown.Item>
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
            "title": "Embark on your journey",
            "type": "Fitness",
            "desc": "description description description",
            "updatedon": "22/02/20",
            
        },
        {
            "title": "Embark on your journey",
            "type": "Fitness",
            "desc": "description description description",
            "updatedon": "22/02/20",
            
        },
        {
            "title": "Embark on your journey",
            "type": "Fitness",
            "desc": "description description description",
            "updatedon": "22/02/20",
            
        }

    ], []);
    const messageSchema: any = require("./informationbank.json");
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
            <Container>
            <Row>   
            <Col>     
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                <Button variant="outline-secondary"><i className="fas fa-search"></i></Button>
                </InputGroup.Prepend>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search" />
            </InputGroup>
            </Col>
            <Col>  
            <Card.Title className="text-center">
                <ModalView
                    name="Create New"
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={messageSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            </Col>
            </Row>
            </Container>
            <Table columns={columns} data={data} />
        </TabContent>
    );
}
