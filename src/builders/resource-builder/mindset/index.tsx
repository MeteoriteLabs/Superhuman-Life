import {useMemo,useRef,useState,useContext} from 'react'
import {Button,TabContent,InputGroup,FormControl,OverlayTrigger,Popover,Dropdown,Card,Container,Row,Col} from "react-bootstrap";
import Table from "../../../components/table";
//import ModalView from "../../../components/modal";
import {gql,useQuery,useMutation} from "@apollo/client";
import AuthContext from "../../../context/auth-context";

export default function MindsetPage() {
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();
    const auth = useContext(AuthContext);
    const GET_TRIGGERS = gql`
    query FeedSearchQuery($filter: String!,$id: String){   
        mindsetmessages(sort: "updatedAt",where: { title_contains: $filter, users_permissions_user: { id: $id}}){
            id
            title
            description
            minidescription
            tags
            updatedAt
            users_permissions_user{
                id
            }
            mindsetmessagetype{
                id
                type
            }
        }
        mindsetmessagetypes{
            id
            type
          }
      }
      
    `
    const ADD_MESSAGE = gql`
            mutation msg(
                $title: String
                $tags: String
                $minidesc: String
                $mindsetmessagetype: ID
                $mediaurl: String
                $user_permissions_user: ID
            ) {
                createMindsetmessage(
                input: {
                    data: {
                    title: $title
                    tags: $tags
                    mindsetmessagetype: $mindsetmessagetype
                    description: $minidesc
                    mediaurl: $mediaurl
                    users_permissions_user: $user_permissions_user
                
                    }
                }
                ) {
                    mindsetmessage {
                    id
                    createdAt
                    updatedAt
                    title
                    tags
                    minidescription
                }
                }
            }
      
    `
    // const UPDATE_MESSAGE = gql`
    //     mutation updatemsg(
    //         $title: String
    //         $description: String
    //         $minidesc: String
    //         $mindsetmessagetype: ID
    //         $tags: String
    //         $mediaurl: String
    //         $userpermission: ID
    //         $messageid: ID!
    //     ) {
    //         updateMindsetmessage(
    //         input: {
    //             data: {
    //             title: $title
    //             description: $description
    //             minidescription: $minidesc
    //             mediaurl: $mediaurl
    //             tags: $tags
    //             mindsetmessagetype: $mindsetmessagetype
    //             users_permissions_user: $userpermission
    //             }
    //             where: { id: $messageid }
    //         }
    //         ) {
    //         mindsetmessage {
    //             id
    //             title
    //             tags
    //             description
    //             minidescription
    //             mediaurl
    //         }
    //         }
    //     }
      
    // `

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


    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth()+1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

      return(`${date}/${month}/${year}`);
    }
    const mindsetSchema: any = require("./mindset.json");
    const [datatable, setDataTable] = useState<{}[]>([]);

    function FetchData(_variables: {} = { filter: " " ,id : auth.userid }) {
        useQuery(GET_TRIGGERS, { variables: _variables, onCompleted: loadData })
    }

    function loadData(data: any) {
        setDataTable(
            [...data.mindsetmessages].map((Detail) => {
                return {
                title : Detail.title,
                tags : Detail.tags,
                type: Detail.mindsetmessagetype.type,
                desc: Detail.description,
                updatedon: getDate(Date.parse(Detail.updatedAt))
                }
            })
        );
        mindsetSchema["1"].properties.typo.enum =[...data.mindsetmessagetypes].map(n => (n.id));
        mindsetSchema["1"].properties.typo.enumNames = [...data.mindsetmessagetypes].map(n => (n.type));
    }

    
    // const uiSchema: any = {

    //     "minidescription": {
    //         "ui:widget": "textarea",
    //         "ui:options": {
    //             "rows": 3
    //         }
    //     }
         
    // }
    const [createmessage, { error }] = useMutation(ADD_MESSAGE);

    // function onSubmit(formData: any ) {
    //     let authid = auth.userid;

    //     createmessage(
    //         {
    //             variables: {
    //                 title: formData.name,
    //                 tags: formData.tags,
    //                 minidesc: formData.minidescription,
    //                 mindsetmessagetype: formData.typo,
    //                 mediaurl: formData.file, 
    //                 user_permissions_user: authid
    //             }
    //         }
    //     );
    // }
    // if (loading) return <span>'Loading...'</span>;
     if (error) return <span>{`Error! ${error.message}`}</span>;
    FetchData({ filter: searchFilter, id: auth.userid});
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
                {/* <ModalView
                    name="Create New"
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={mindsetSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                /> */}
            </Card.Title>
            </Col>
            </Row>
            </Container>
            <Table columns={columns} data={datatable} />
        </TabContent>
    );
}
