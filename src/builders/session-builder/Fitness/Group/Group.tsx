import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";

import AuthContext from "../../../../context/auth-context"
import GroupTable from '../../../../components/table/GroupTable/GroupTable';
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';



export default function Group(props) {

    const auth = useContext(AuthContext);

    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null)


    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Group Class'
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('group query data', data);
        setUserPackage(
            [...data.userPackages].map((packageItem, index) => {
                return {
                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    expiry: moment(packageItem.fitnesspackages[0].expiry_date).format("DD/MM/YYYY"),
                    publishing_date: moment(packageItem.fitnesspackages[0].publishing_date).format("DD/MM/YYYY"),
                    purchase_date: moment(packageItem.purchase_date).format("DD/MM/YYYY"),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",

                    client: packageItem.fitnessprograms[0].users_permissions_user.username,
                    time: moment(packageItem.fitnessprograms[0].published_at).format('h:mm:ss a'),
                    programName: packageItem.fitnessprograms[0].title,
                    programStatus: "Assigned",
                    renewal: "25/07/20",
                }
            })
        )
    }


    FetchData();


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



    // let arr: any[] = []
    // for (let i = 0; i < dataTable.length - 1; i++) {
    //     if (dataTable[i].id === dataTable[i + 1].id) {
    //         if (dataTable[i].programName === dataTable[i + 1].programName) {
    //             if (typeof dataTable[i].client === "string") {
    //                 arr[0] = dataTable[i].client;
    //             };
    //             arr.push(dataTable[i + 1].client);
    //             dataTable[i + 1].client = arr
    //             dataTable.splice(i, 1);
    //             i--;
    //         }
    //     } else {
    //         arr = []
    //     }
    // }


    // console.log("dataTable", dataTable);
    // console.log('user group Package', userPackage)



    const columns = useMemo(
        () => [
            {

                Header: "Package",
                columns: [
                    // { accessor: 'id', Header: 'ID', enableRowSpan: true },
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
                    {
                        accessor: "action", Header: "Action", enableRowSpan: true,
                        Cell: (row: any) => {
                            // console.log("🚀 ~ file: Group.tsx ~ line 326 ~ Group ~ row", row.rows)
                            return <>
                                <button onClick={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.row.original.id, actionType: 'addNew', type: 'Group Class' , rowData: row.row.original})
                                }}>Add new</button>
                            </>
                        }
                    }
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
                                {typeof row.value === "string" ?
                                    <img
                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                        style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                    :
                                    <div className='position-relative' style={{ width: '8rem', height: '5rem' }}>
                                        {row.value.slice(0, 4).map((item, index) => {
                                            let postionLeft = 20;
                                            return <img
                                                key={index}
                                                src="https://picsum.photos/200/100" alt='profile-pic'
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                className='position-absolute'
                                            />
                                        })}
                                    </div>
                                }

                                {typeof row.value !== "string" ?
                                    <p style={{ whiteSpace: 'nowrap' }}>{row.value.length} people</p>
                                    :
                                    <p className='text-center'>{row.value}</p>}

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
                        Cell: ({ row }: any) => {
                            return <ActionButton
                                action1='Manage'
                                actionClick1={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Group Class" })
                                }}

                                action2='Details'
                                actionClick2={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Group Class" })
                                }}

                            />
                        }
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
                    <GroupTable columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
