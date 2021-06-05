import {useMemo,useState} from 'react'
import {Badge,Button,TabContent,InputGroup,FormControl,OverlayTrigger,Popover,Dropdown,Card,Container,Row,Col} from "react-bootstrap";
import Table from "../../../components/table";
import ModalView from "../../../components/modal";
import {gql,useLazyQuery} from "@apollo/client"


export default function MessagePage() {
    const [searchFilter,setSearchFilter]=useState('');
    
    const GET_TRIGGERS = gql`
    query FeedSearchQuery($filter: String!){
        prerecordedmessages(sort: "prerecordedtrigger.name:asc",where: { title_contains: $filter }){
            title
            minidescription
            prerecordedtrigger{
              id
              name
            }
            status
            updatedAt
          }
        prerecordedtypes{
            name
          }
          prerecordedtriggers{
            name
          }
      }
      
    `
    const [executeSearch,{data,loading,error}] = useLazyQuery(GET_TRIGGERS);
   
    const columns = useMemo<any>(() => [
        { accessor: "title", Header: "Title" },
        {
            accessor: "trigger",Header: "Trigger",
        },
        { accessor: "minidesc", Header: "Mini Description" },
        { accessor: "status", Header: "Status",Cell: (v: any) => <Badge variant={v.value==="Active"?"success":"danger"}>{v.value}</Badge> },
        { accessor: "updatedon", Header: "Updated On"},
        
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
    let datatable: any;

    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth()+1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

      return(`${date}/${month}/${year}`);
    }
    executeSearch({variables: {filter: " "}});
    if(data){
        console.log(data);
        datatable = [...data.prerecordedmessages].map((Detail) => {
            return{
                title : Detail.title,
                trigger: Detail.prerecordedtrigger.name,
                minidesc: Detail.minidescription,
                status: Detail.status?"Active":"Inactive",
                updatedon: getDate(Date.parse(Detail.updatedAt))
            }    
    }); 
    }
    
    const messageSchema: any = require("./message.json");
    let preRecordedMessageTypes: any;
    let preRecordedMessageTriggers: any;
    if(data){
      preRecordedMessageTypes =[...data.prerecordedtypes].map(n => (n.name));
      preRecordedMessageTriggers =[...data.prerecordedtriggers].map(n => (n.name));
    }
     
    messageSchema["1"].properties.typo.enum = preRecordedMessageTypes;
    messageSchema["1"].properties.mode.enum = preRecordedMessageTriggers;
    const uiSchema: any = {
    
        
        "description": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 4
            }
        },
        "minidescription": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
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
            <InputGroup className="mb-3" onChange={(e:any) => {setSearchFilter(e.target.value)}}>
                <InputGroup.Prepend>
                <Button variant="outline-secondary" onClick={() => executeSearch({variables: {filter: searchFilter}})} ><i className="fas fa-search"></i></Button>
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
            <Table columns={columns} data={datatable} />
        </TabContent>
    );
}
