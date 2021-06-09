import { useMemo, useState,useRef } from 'react'
import { Badge, Button, TabContent, InputGroup, FormControl, OverlayTrigger, Popover, Dropdown, Card, Container, Row, Col} from "react-bootstrap";
import Table from "../../../components/table";
import ModalView from "../../../components/modal";
import { gql, useQuery,useMutation } from "@apollo/client";

export default function MessagePage() {
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();

    //sort by updatedAt to ensure newly created messages show up
    const GET_TRIGGERS = gql`
    query FeedSearchQuery($filter: String!){
        prerecordedmessages(sort: "updatedAt",where: { title_contains: $filter }){
            id
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
    `;
    const ADD_MESSAGE = gql`
            mutation msg(
                $title: String
                $description: String
                $minidesc: String
                $prerecordedtype: ID
                $prerecordedtrigger: ID
                $mediaupload: [ID]
                $mediaurl: String
            ) {
                createPrerecordedmessage(
                input: {
                    data: {
                    title: $title
                    description: $description
                    minidescription: $minidesc
                    prerecordedtype: $prerecordedtype
                    prerecordedtrigger: $prerecordedtrigger
                    mediaurl: $mediaurl
                    mediaupload: $mediaupload
                    }
                }
                ) {
                prerecordedmessage {
                    id
                    createdAt
                    updatedAt
                    title
                    description
                    minidescription
                }
                }
            }
      
    `

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

    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

        return (`${date}/${month}/${year}`);
    }

    const messageSchema: any = require("./message.json");
    const [datatable, setDataTable] = useState([{}]);

    function FetchData(_variables: {} = { filter: " " }) {
        useQuery(GET_TRIGGERS, { variables: _variables, onCompleted: loadData })
    }

    function loadData(data: any) {
        setDataTable(
            [...data.prerecordedmessages].map((Detail) => {
                return {
                    title: Detail.title,
                    trigger: Detail.prerecordedtrigger.name,
                    minidesc: Detail.minidescription,
                    status: Detail.status ? "Active" : "Inactive",
                    updatedon: getDate(Date.parse(Detail.updatedAt))
                }
            })
        );

        messageSchema["1"].properties.typo.enum = [...data.prerecordedtypes].map(n => (n.name));
        messageSchema["1"].properties.mode.enum = [...data.prerecordedtriggers].map(n => (n.name));
    }

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
    const [createmessage, { error }] = useMutation(ADD_MESSAGE);
    function onSubmit(formData: any) {
        console.log(formData);
        // createmessage(
        //     {
        //         variables: {
        //             title: formData.name,
        //             description: formData.description,
        //             minidesc: formData.minidescription,
        //             prerecordedtype: formData.typo,
        //             prerecordedtrigger: formData.mode,
        //             mediaupload: formData.url,
        //             mediaurl: formData.file
        //         }
        //     }
        // );
    }
    // if (loading) return <span>'Loading...'</span>;
     if (error) return <span>{`Error! ${error.message}`}</span>;

    FetchData({ filter: searchFilter });
    

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
