import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../components/table';
import { GET_ALL_PACKAGES } from '../../resource-builder/graphQL/queries';
import AuthContext from "../../../context/auth-context"

export default function Program(props) {

    const auth = useContext(AuthContext);
    console.log(auth)

    const { data } = useQuery(GET_ALL_PACKAGES, {
        variables: {
            id: auth.userid,
        }
    });
    console.log(data)



    // const FetchData = () => {
    //     useQuery(GET_ALL_PACKAGES, {
    //         variables: {
    //             id: auth.userid
    //         },
    //         onCompleted: (data => fillData(data))
    //     })

    // }

    // FetchData();


    // const fillData = (data) => {
    //     console.log(data)
    // }


    const columns = useMemo<any>(() => [
        {
            accessor: "classType",
            Header: "Class Type",
            Cell: (v: any) => {
                return <div className='text-center'>
                    <img src={v.value} alt={v.value} style={{ width: "60px", height: "60px" }} />
                </div>
            }
        },
        {
            accessor: "client",
            Header: "Client",
            Cell: (row: any) => {
                console.log(row.value)

                return <div className='text-center'>
                    <div className='bg-dark mx-auto' style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                    {row.value.length === 1 ? <div className='mt-2'>{row.value}</div> : <div className='mt-2'>{row.value.length}+ people</div>}
                </div>

            }
        },
        {

            Header: "Package",
            columns: [
                { accessor: "name", Header: "Name" },
                {
                    accessor: "status",
                    Header: "Status",
                    Cell: (row: any) => {
                        return <>
                            {(row.value === "Active" || row.value === "Private") ?
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize:'1rem' }} variant="success">{row.value}</Badge> :
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize:'1rem' }} variant="danger">{row.value}</Badge>
                            }
                        </>


                    }
                },
                { accessor: "startDate", Header: "Start Date" },
                { accessor: "renewal", Header: "renewal" },

            ]
        },
        {
            Header: " ",
            columns: [
                {
                    accessor: "blank",
                    Header: " ",
                },

            ]
        },
        {
            Header: "Program",
            columns: [
                {
                    accessor: "programStatus",
                    Header: "Status",
                    Cell: (row: any) => { 
                        return <>
                        {row.value === "Assigned"  ?
                            <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize:'1rem' }} variant="success">{row.value}</Badge> :
                            <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize:'1rem' }} variant="danger">{row.value}</Badge>
                        }
                    </>
                    }
                },
                { accessor: "programRenewal", Header: "renewal" },

            ]
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
                                <Dropdown.Item>Assign</Dropdown.Item>
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>View</Dropdown.Item>
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
    const dataTable = useMemo<any>(() => [
        {
            "classType": './assets/PTType.svg',
            "client": ["john", "mark"],
            "name": "Exercise-1",
            "status": "Active",
            "startDate": "25/06/20",
            "renewal": "25/07/20",
            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
      
        },
        {
            "classType": './assets/GroupType.svg',
            "client": ["john", "mark"],
            "name": "Exercise-2",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Active"
        },
        {
            "classType": './assets/ClassicType.svg',
            "client": ["john"],
            "name": "Exercise-2",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Inactive"
        },
        {
            "classType": './assets/CustomType.svg',
            "client": ["john", "mark"],
            "name": "Exercise-2",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Active",
            "programStatus":"Assigned",
        }
    ], []);

    return (
        <div className="mt-5">
            <Row>
                <Col>

                    <Table columns={columns} data={dataTable} />
                </Col>

            </Row>
        </div>
    )
}
