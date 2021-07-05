import { useMemo, useState,useRef,useContext } from 'react'
import { Badge, Button, TabContent, InputGroup, FormControl, OverlayTrigger, Popover, Dropdown, Card, Container, Row, Col} from "react-bootstrap";
import Table from "../../../components/table";
// import ModalView from "../../../components/modal";
import { gql, useQuery} from "@apollo/client";
import AuthContext from "../../../context/auth-context";
// import StatusModal from "./StatusModal";
// import ActionButton from "../../../components/actionbutton/index";
import CreateEditMessage from "./createoredit-message";
// import StatusModal from "./StatusModal";


export default function MessagePage() {
    const auth = useContext(AuthContext);
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();
    const createEditMessageComponent = useRef<any>(null);
    

    //sort by updatedAt to ensure newly created messages show up
    const GET_TRIGGERS = gql`
    query FeedSearchQuery($filter: String!,$id: String){
        prerecordedmessages(sort: "updatedAt",where: { title_contains: $filter , users_permissions_user: { id: $id}}){
            id
            title
            minidescription
            prerecordedtrigger{
              id
              name
            }
            status
            updatedAt
            users_permissions_user{
                id
            }
          }
          prerecordedtypes{
            id  
            name
          }
          prerecordedtriggers{
            id  
            name
          }
      }
    `;
    
    

    

    const columns = useMemo<any>(() => [
        { accessor: "title", Header: "Title" },
        { accessor: "trigger", Header: "Trigger" },
        { accessor: "minidesc", Header: "Mini Description" },
        { accessor: "status", Header: "Status", Cell: (v: any) => <Badge variant={v.value === "Active" ? "success" : "danger"}>{v.value}</Badge> },
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
                                <Dropdown.Item onClick={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'edit'})}}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'view'})}}>View</Dropdown.Item>
                                <Dropdown.Item onClick={() => { createEditMessageComponent.current.TriggerForm({ id: row.original.id, type: 'toggle-status', current_status: (row.original.status === "Active") }) }}>Status</Dropdown.Item>
                                <Dropdown.Item onClick={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'delete'})}}>Delete</Dropdown.Item>
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
    
                    
  

    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

        return (`${date}/${month}/${year}`);
    }

    const messageSchema: any = require("./message.json");
    const [datatable, setDataTable] = useState<{}[]>([]);

    function FetchData(_variables: {} = { filter: " " ,id : auth.userid }) {
        useQuery(GET_TRIGGERS, { variables: _variables, onCompleted: loadData })
    }

    function loadData(data: any) {
        setDataTable(
            [...data.prerecordedmessages].map((Detail) => {
                return {
                    id: Detail.id,
                    title: Detail.title,
                    trigger: Detail.prerecordedtrigger.name,
                    minidesc: Detail.minidescription,
                    status: Detail.status ? "Active" : "Inactive",
                    updatedon: getDate(Date.parse(Detail.updatedAt))
                }
            })
        );

        messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
        messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
        messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
        messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
        
    }


    FetchData({ filter: searchFilter , id: auth.userid });
    

    return (
        <TabContent>
            <Container>
                <Row>
                    <Col>
                        <InputGroup className="mb-3" >
                            <FormControl aria-describedby="basic-addon1" placeholder="Search" id="searchInput" ref={searchInput}/>
                            <InputGroup.Prepend>
                                <Button variant="outline-secondary" onClick={(e:any) => {e.preventDefault(); setSearchFilter(searchInput.current.value)}} ><i className="fas fa-search"></i></Button>
                            </InputGroup.Prepend>
                        </InputGroup> 
                    </Col>
                    <Col>
                        <Card.Title className="text-center">
                            <Button variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditMessageComponent.current.TriggerForm({ id: null, type: 'create' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Create New
                            </Button>
                            <CreateEditMessage ref={createEditMessageComponent}></CreateEditMessage>
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={datatable} />
        </TabContent>
    );
}