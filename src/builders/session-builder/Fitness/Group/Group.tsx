import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import { GET_ALL_PACKAGES } from '../../../resource-builder/graphQL/queries';
import AuthContext from "../../../../context/auth-context"
import GroupTable from '../../../../components/table/GroupTable/GroupTable';

// type Data = {
//     actor: string;
//     movie: ;
// };



export default function Group(props) {

    const auth = useContext(AuthContext);


    // const { data } = useQuery(GET_ALL_PACKAGES, {
    //     variables: {
    //         id: auth.userid,
    //     }
    // });
    // console.log(data)



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



    const buttonAction = () => {
        return <button>Add new</button>
    }

    // const origData = [
    //     {
    //         id: "1",
    //         packageName: "Package Name 1",
    //         expiry: "29/12/20",
    //         packageStatus: 'Active',
    //         action: buttonAction(),
    //         programs: [
    //             {
    //                 program: "Pirates of the Carribean 1",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Not Assigned",
    //                 renewal: "25/04/20"
    //             },
    //             {
    //                 program: "Pirates of the Carribean 1",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Assigned",
    //                 renewal: "26/04/20",
    //             },
    //             {
    //                 program: "Pirates of the Carribean 3",
    //                 client: "John",
    //                 time: "10:00 am-8:00 am",
    //                 status: "Not Assigned",
    //                 renewal: "27/04/20",
    //             },
    //             {
    //                 program: "Pirates of the Carribean 3",
    //                 client: "John",
    //                 time: "10:00 am-8:00 am",
    //                 status: "Not Assigned",
    //                 renewal: "27/04/20",
    //             }
    //         ]
    //     },

    //     {
    //         id: "2",
    //         packageName: "Package Name 2",
    //         expiry: "30/12/20",
    //         packageStatus: 'inActive',
    //         action: buttonAction(),
    //         programs: [
    //             {
    //                 program: "Pirates of the Carribean 1",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Not Assigned",
    //                 renewal: "25/04/20"
    //             },
    //             {
    //                 program: "Pirates of the Carribean 2",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Assigned",
    //                 renewal: "26/04/20",
    //             },
    //             {
    //                 program: "Pirates of the Carribean 3",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Assigned",
    //                 renewal: "27/04/20",
    //             },
    //             {
    //                 program: "Pirates of the Carribean 4",
    //                 client: "John",
    //                 time: "7:00 am-8:00 am",
    //                 status: "Not Assigned",
    //                 renewal: "28/04/20",
    //             }
    //         ]
    //     },

    // ];

    // const newData: Array<any> = [];

    // origData.forEach(obj => {
    //     obj.programs.forEach(program => {
    //         newData.push({
    //             id: obj.id,
    //             packageName: obj.packageName,
    //             expiry: obj.expiry,
    //             action: obj.action,
    //             packageStatus: obj.packageStatus,

    //             client: program.client,
    //             programName: program.program,
    //             time: program.time,
    //             programStatus: program.status,
    //             renewal: program.renewal,
    //         });
    //     });
    // });


    // const data = useMemo(() => newData, []);


    const dataTable: any[] = [
        {
            id: "1",
            packageName: "Package Name 1",
            expiry: "29/12/20",
            packageStatus: 'Active',
            action: buttonAction(),
            programName: "Pirates of the Carribean 1",
            client: "Mary",
            time: "7:00 am-8:00 am",
            programStatus: "Assigned",
            renewal: "25/04/20"
        },

        {
            id: "1",
            packageName: "Package Name 1",
            expiry: "29/12/20",
            packageStatus: 'Active',
            action: buttonAction(),
            programName: "Pirates of the Carribean 1",
            client: "John",
            time: "7:00 am-8:00 am",
            programStatus: "Assigned",
            renewal: "25/04/20"
        },
        {
            id: "1",
            packageName: "Package Name 1",
            expiry: "29/12/20",
            packageStatus: 'Active',
            action: buttonAction(),
            programName: "Pirates of the Carribean 1",
            client: "Jack",
            time: "7:00 am-8:00 am",
            programStatus: "Assigned",
            renewal: "25/04/20"
        },

        {
            id: "1",
            packageName: "Package Name 1",
            expiry: "30/12/20",
            packageStatus: 'Active',
            action: buttonAction(),
            programName: "Pirates of the Carribean 3",
            client: "Harry",
            time: "9:00 am-8:00 am",
            programStatus: "Not Assigned",
            renewal: "25/04/20"
        },

        {
            id: "1",
            packageName: "Package Name 1",
            expiry: "30/12/20",
            packageStatus: 'Active',
            action: buttonAction(),
            programName: "Pirates of the Carribean 2",
            client: "Petter",
            time: "10:00 am-8:00 am",
            programStatus: "Not Assigned",
            renewal: "25/04/20"
        },



        {
            id: "2",
            packageName: "Package Name 2",
            expiry: "30/12/20",
            packageStatus: 'inActive',
            action: buttonAction(),
            programName: "Pirates of the Carribean 6",
            client: "John",
            time: "10:00 am-8:00 am",
            programStatus: "Not Assigned",
            renewal: "25/04/20"
        },
        {
            id: "2",
            packageName: "Package Name 2",
            expiry: "30/12/20",
            packageStatus: 'inActive',
            action: buttonAction(),
            programName: "Pirates of the Carribean 8",
            client: "Nick",
            time: "10:00 am-8:00 am",
            programStatus: "Not Assigned",
            renewal: "25/04/20"
        },

    ]



    let arr: any[] = []
    for (let i = 0; i < dataTable.length - 1; i++) {
        if(dataTable[i].id === dataTable[i + 1].id) {
            if (dataTable[i].programName === dataTable[i + 1].programName) {
                if (typeof dataTable[i].client === "string") {
                    arr[0] = dataTable[i].client;
                };
                arr.push(dataTable[i + 1].client);
                dataTable[i + 1].client = arr
                dataTable.splice(i, 1);
                i--;
            }
        }else{
            arr = []
        }
    }

    console.log(arr);
    console.log("🚀 ~ file: Group.tsx ~ line 241 ~ Group ~ array", dataTable);






    const columns = useMemo(
        () => [
            {

                Header: "Package",
                columns: [
                    { accessor: 'id', Header: 'ID', enableRowSpan: true },
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
                    { accessor: "expiry", Header: 'Expiry', enableRowSpan: true },
                    {
                        accessor: "packageStatus",
                        Header: "Status",
                        Cell: (row: any) => {
                            return <>
                                {row.value === "Active" ?
                                    <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                    <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                                }
                            </>
                        },
                        enableRowSpan: true
                    },
                    { accessor: "action", Header: "Action", enableRowSpan: true }
                ]
            },
            { accessor: ' ', Header: '' },

            {
                Header: "Program",
                columns: [
                    {
                        accessor: "client", Header: 'Client',
                        Cell: (row) => {
                            return <div >
                                <div>
                                    {typeof row.value === "string" ?
                                        <img src="https://picsum.photos/200/100" alt='profile-pic' style={{ width: '60px', height: '60px', borderRadius: '50%' }} /> :
                                        <div className='d-flex'>
                                            {row.value.map((item, index) => {
                                                return <img src="https://picsum.photos/200/100" alt='profile-pic' style={{ width: '60px', height: '60px', borderRadius: '50%' }} />

                                            })}
                                        </div>
                                    }
                                    {/* <img src="https://picsum.photos/200/100" alt='profile-pic' style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                    <img src="https://picsum.photos/200/200" alt='profile-pic' style={{ width: '60px', height: '60px', borderRadius: '50%', position: 'absolute', left: '45%' }} />
                                    <img src="https://picsum.photos/200/300" alt='profile-pic' style={{ width: '60px', height: '60px', borderRadius: '50%', position: 'absolute', left: '46%' }} /> */}
                                </div>
                                {typeof row.value !== "string" ? <p style={{ whiteSpace: 'nowrap' }}>{row.value.length}+ people</p>
                                    : <p className='text-center'>{row.value}</p>}
                                {/* {row.value.length > 1 ? <p>{row.value.length} people</p> : <p>{row.value[0]}</p>} */}
                            </div>
                        }
                    },
                    { accessor: "programName", Header: 'Name' },
                    { accessor: 'time', Header: 'Time' },
                    {
                        accessor: "programStatus",
                        Header: "Status",
                        Cell: (row: any) => {
                            return <>
                                {row.value === "Assigned" ?
                                    <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                    <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                                }
                            </>
                        }
                    },
                    { accessor: "renewal", Header: "Renewal Date" },
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
                ]
            },
        ],
        []
    );

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <GroupTable columns={columns} data={dataTable} />
                </Col>

            </Row>
        </div>
    )
}
