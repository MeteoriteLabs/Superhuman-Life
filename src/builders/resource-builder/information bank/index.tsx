import {useMemo,useState,useRef,useContext} from 'react'
import {Button,TabContent,InputGroup,FormControl,OverlayTrigger,Popover,Dropdown,Card,Container,Row,Col} from "react-bootstrap";
import Table from "../../../components/table";
//import ModalView from "../../../components/modal";
import {gql,useQuery} from "@apollo/client";
import AuthContext from "../../../context/auth-context";


export default function InformationPage() {
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<any>();
    const auth = useContext(AuthContext);
    const GET_TRIGGERS = gql`
    query FeedSearchQuery($filter: String!,$id: String){
        informationbankmessages(sort: "updatedAt",where: { title_contains: $filter, users_permissions_user: { id: $id}}) {
          id
          title
          description
          updatedAt
          users_permissions_user{
            id
        }
          informationbankmessagestype {
            id
            type
          }
        }
        informationbankmessagestypes {
          id
          type
        }
      }
      
    `
    // const ADD_MESSAGE = gql`
    //         mutation msg(
    //             $title: String
    //             $tags: String
    //             $minidesc: String
    //             $infomessagetype: ID
    //             $mediaurl: String
    //             $user_permissions_user: ID
    //         ) {
    //             createInformationbankmessage(
    //             input: {
    //                 data: {
    //                 title: $title
    //                 tags: $tags
    //                 informationbankmessagestype: $infomessagetype
    //                 description: $minidesc
    //                 mediaurl: $mediaurl
    //                 users_permissions_user: $user_permissions_user
                
    //                 }
    //             }
    //             ) {
    //                 informationbankmessage {
    //                 id
    //                 createdAt
    //                 updatedAt
    //                 title
    //                 tags
    //                 minidescription
    //             }
    //             }
    //         }
      
    // `
    // const UPDATE_MESSAGE = gql`
    //     mutation updatemsg(
    //         $title: String
    //         $description: String
    //         $minidesc: String
    //         $informationbankmessagestype: ID
    //         $tags: String
    //         $mediaurl: String
    //         $userpermission: ID
    //         $messageid: ID!
    //     ) {
    //         updateInformationbankmessage(
    //         input: {
    //             data: {
    //             title: $title
    //             description: $description
    //             minidescription: $minidesc
    //             mediaurl: $mediaurl
    //             tags: $tags
    //             informationbankmessagestype: $informationbankmessagestype
    //             users_permissions_user: $userpermission
    //             }
    //             where: { id: $messageid }
    //         }
    //         ) {
    //         informationbankmessage {
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

    

    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth()+1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

      return(`${date}/${month}/${year}`);
    }
    const infoSchema: any = require("./informationbank.json");
    const [datatable, setDataTable] = useState<{}[]>([]);

    function FetchData(_variables: {} = { filter: " ",id : auth.userid }) {
        useQuery(GET_TRIGGERS, { variables: _variables, onCompleted: loadData })
    }

    function loadData(data: any) {
        setDataTable(
            [...data.informationbankmessages].map((Detail) => {
                return {
                title : Detail.title,
                type: Detail.informationbankmessagestype.type,
                desc : Detail.description,
                updatedon: getDate(Date.parse(Detail.updatedAt))
                }
            })
        );
        infoSchema["1"].properties.typo.enum =[...data.informationbankmessagestypes].map(n => (n.id));
        infoSchema["1"].properties.typo.enumNames = [...data.informationbankmessagestypes].map(n => (n.type));
    }


    // const uiSchema: any = {
        
    //     "description": {
    //         "ui:widget": "textarea",
    //         "ui:options": {
    //             "rows": 3
    //         }
    //     }
          
    // }
    //const [createmessage, { error }] = useMutation(ADD_MESSAGE);


    // function onSubmit(formData: any ) {
    //     let authid = auth.userid;
      
    //     createmessage(
    //         {
    //             variables: {
    //                 title: formData.name,
    //                 tags: formData.tags,
    //                 minidesc: formData.minidescription,
    //                 infomessagetype: formData.typo,
    //                 mediaurl: formData.file, 
    //                 user_permissions_user: authid
    //             }
    //         }
    //     );
    // }
    // if (loading) return <span>'Loading...'</span>;
     //if (error) return <span>{`Error! ${error.message}`}</span>;
    
    FetchData({ filter: searchFilter, id: auth.userid  });
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
                    formSchema={infoSchema}
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
