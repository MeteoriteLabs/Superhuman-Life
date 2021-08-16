import { useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import Table from '../../../components/table';

export default function Program(props) {



    const columns = useMemo<any>(() => [
        {
            accessor: "classType",
            Header: "Class Type",
            Cell: (v: any) => {
                return <div className='text-center'>
                    <img src={v.value} alt={v.value} style={{width:"60px",height:"60px"}}/>
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
        { accessor: "name", Header: "Name" },
        {
            accessor: "status",
            Header: "Status",
            Cell: (v: any) => <Badge variant="success">{v.value}</Badge>
        },
        { accessor: "startDate", Header: "Start Date" },
        { accessor: "renewal", Header: "renewal" },

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
    const data = useMemo<any>(() => [
        {
            "classType": './assets/PTType.svg',
            "client": ["john", "mark"],
            "name": "Exercise-1",
            "status": "Active",
            "startDate": "25/06/20",
            "renewal": "25/07/20",
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
            "status": "Active"
        },
        {
            "classType": './assets/CustomType.svg',
            "client": ["john", "mark"],
            "name": "Exercise-2",
            "type": "PT",
            "details": "Exercise Details",
            "duration": "6 Months",
            "price": "5000 INR",
            "status": "Active"
        }
    ], []);

    return (
        <div className="mt-5">
            <Table columns={columns} data={data} />
        </div>
    )
}
