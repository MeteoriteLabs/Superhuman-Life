import { useMemo, useState,useRef,useContext } from 'react'
import { Badge, Button, TabContent, InputGroup, FormControl, Card, Container, Row, Col} from "react-bootstrap";
import Table from "../../../components/table";
import {useQuery} from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
import CreateEditMessage from "./createoredit-message";
import { GET_NOTIFICATIONS} from "./queries";



export default function MessagePage() {
    const auth = useContext(AuthContext);
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();
    const createEditMessageComponent = useRef<any>(null);
    
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
                <ActionButton 
                action1="Edit"
                actionClick1={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'edit'})}}
                action2="View"
                actionClick2={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'view'})}}
                action3="Status"
                actionClick3={() => { createEditMessageComponent.current.TriggerForm({ id: row.original.id, type: 'toggle-status', current_status: (row.original.status === "Active") }) }}
                action4="Delete"
                actionClick4={() => {createEditMessageComponent.current.TriggerForm({id: row.original.id, type: 'delete'})}}
                 />
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

    const [datatable, setDataTable] = useState<{}[]>([]);

    function FetchData(_variables: {} = { filter: " " ,id : auth.userid }) {
        useQuery(GET_NOTIFICATIONS, { variables: _variables, onCompleted: loadData })
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
                                    createEditMessageComponent.current.TriggerForm({ id: null, type: 'create',modal_status: true });
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