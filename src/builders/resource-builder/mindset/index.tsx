import {useMemo} from 'react'
import {Button,TabContent,InputGroup,FormControl,OverlayTrigger,Popover,Dropdown,Card,Container,Row,Col} from "react-bootstrap";
import Table from "../../../components/table";
import ModalView from "../../../components/modal";
import {gql,useQuery} from "@apollo/client";

export default function MindsetPage() {
    const GET_TRIGGERS = gql`
    {
        mindsetmessagetypes{
            type
          }
      }
      
    `
    const {loading,error,data } = useQuery(GET_TRIGGERS);

    const columns = useMemo<any>(() => [
        { accessor: "title", Header: "Title" },
        {
            accessor: "type",Header: "Type",
        },
        { accessor: "tags", Header: "Tags" },
        { accessor: "desc", Header: "Mini Description" },
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

    let datatable: any = [];

    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth()+1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

      return(`${date}/${month}/${year}`);
    }
    if(data){
        //below code is commented out since throwing error

    //     datatable = [...data.mindsetmessagetypes].map((Detail) => {
    //         return{
    //             title : Detail.title,
    //             trigger: Detail.prerecordedtrigger.name,
    //             minidesc: Detail.minidescription,
    //             status: Detail.status?"Active":"Inactive",
    //             updatedon: getDate(Date.parse(Detail.updatedAt))
    //         }    
    // }); 
    }
    const mindsetSchema: any = require("./mindset.json");
    let preRecordedMessageTypes: any;
    if(data){
      preRecordedMessageTypes =[...data.mindsetmessagetypes].map(n => (n.type));
    }
    mindsetSchema["1"].properties.typo.enum = preRecordedMessageTypes;
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
    if (loading) return <span>'Loading...'</span>;
    if (error) return <span>{`Error! ${error.message}`}</span>;

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
                    formSchema={mindsetSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            </Col>
            </Row>
            </Container>
            <Table columns={columns} data={datatable} />
        </TabContent>
    );
}
