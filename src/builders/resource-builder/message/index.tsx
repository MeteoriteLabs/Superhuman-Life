import {useMemo} from 'react'
import {Badge,Button,TabContent,InputGroup,FormControl} from "react-bootstrap";
// import Bread from "../../../components/bread";
import Table from "../../../components/table";

export default function MessagePage() {
    const columns = useMemo<any>(() => [
        { accessor: "title", Header: "Title" },
        {
            accessor: "trigger",Header: "Trigger",
        },
        { accessor: "minidesc", Header: "Mini Description" },
        { accessor: "status", Header: "Status",Cell: (v: any) => <Badge variant="success">{v.value}</Badge> },
        { accessor: "updatedon", Header: "Updated On" },
        
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => (
                <>
                    <Button variant="white">
                        <i className="fas fa-ellipsis-v"></i>
                    </Button>
                </>
            ),
        }
    ], []);

    const data = useMemo<any>(() => [
        {
            "title": "Embark on your journey",
            "trigger": "Welcome Message",
            "minidesc": "mini description mini description mini description",
            "status": "Active",
            "updatedon": "22/02/20",
            
        },
        {
            "title": "Embark on your journey",
            "trigger": "Welcome Message",
            "minidesc": "mini description mini description mini description",
            "status": "Active",
            "updatedon": "22/02/20",
        },
        {
            "title": "Embark on your journey",
            "trigger": "Welcome Message",
            "minidesc": "mini description mini description mini description",
            "status": "Active",
            "updatedon": "22/02/20",
        }

    ], []);

    return (
        <TabContent>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                <Button variant="outline-secondary"><i className="fas fa-search"></i></Button>
                </InputGroup.Prepend>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search" />
            </InputGroup>
            {/* <Bread mod="Resources" page="Messages" />
            <Card>
                <Card.Header>Featured</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </Card> */}
            <Table columns={columns} data={data} />
        </TabContent>
    );
}
