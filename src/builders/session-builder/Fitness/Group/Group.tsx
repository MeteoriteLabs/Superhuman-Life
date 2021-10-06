import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";

import AuthContext from "../../../../context/auth-context"
import GroupTable from '../../../../components/table/GroupTable/GroupTable';
import { GET_ALL_FITNESS_PACKAGE_BY_TYPE, GET_ALL_PROGRAM_BY_TYPE, GET_ALL_CLIENT_PACKAGE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';
import _ from 'lodash'


export default function Group(props) {

    const auth = useContext(AuthContext);

    const [userPackage, setUserPackage] = useState<any>([]);


    const fitnessActionRef = useRef<any>(null)


    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },

    });

    const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },

    });



    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },
        onCompleted: (data) => loadData()
    })


    const loadData = () => {

        let arrayFitnessPackage: any[] = [];
        let arrayData: any[] = []

        let fitnessProgramItem: any = {};
        for (let i = 0; i < data1?.fitnesspackages.length; i++) {
            for (let j = 0; j < data2?.programManagers.length; j++) {
                if (data1.fitnesspackages[i].id === data2.programManagers[j].fitnesspackages[0].id) {
                    fitnessProgramItem.proManagerFitnessId = data2.programManagers[j].fitnessprograms[0].id;
                    fitnessProgramItem.title = data2.programManagers[j].fitnessprograms[0].title;
                    fitnessProgramItem.published_at = data2.programManagers[j].fitnessprograms[0].published_at
                    fitnessProgramItem.proManagerId = data2.programManagers[j].id;

                    arrayData.push({ ...data1.fitnesspackages[i], ...fitnessProgramItem });
                }
            }
        }


        let arrayA = arrayData.map(item => item.id);

        const filterPackage = data1?.fitnesspackages.filter((item: { id: string; }) => !arrayA.includes(item.id));
        filterPackage.forEach(item => {
            arrayData.push(item)
        })



        for (let i = 0; i < arrayData.length; i++) {
            for (let j = 0; j < data3.userPackages.length; j++) {
                if (data3.userPackages[j].program_managers.length > 0) {
                    if (arrayData[i].proManagerFitnessId === data3.userPackages[j].program_managers[0].fitnessprograms[0].id) {
                        arrayFitnessPackage.push({ ...arrayData[i], ...data3.userPackages[j].users_permissions_user });
                    } else {
                        arrayFitnessPackage.push(arrayData[i]);
                        break;
                    }
                }
            }
        }


        setUserPackage(
            [...arrayFitnessPackage.map((packageItem) => {
                return {
                    id: packageItem.id,
                    packageName: packageItem.packagename,
                    duration: packageItem.duration,
                    expiry: moment(packageItem.expiry_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.Status ? "Active" : "Inactive",

                    proManagerId: packageItem.proManagerId,
                    proManagerFitnessId: packageItem.proManagerFitnessId,
                    client: packageItem.username ? packageItem.username : "N/A",
                    time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
                    programName: packageItem.title ? packageItem.title : "N/A",
                    programStatus: packageItem.username ? "Assigned" : "N/A",
                    renewal: packageItem.title ? "25/08/2021" : "N/A",
                }
            })]
        )

    }



    let arr: any = []
    for (let i = 0; i < userPackage.length - 1; i++) {
        if (userPackage[i].id === userPackage[i + 1].id) {
            if (userPackage[i].proManagerFitnessId === userPackage[i + 1].proManagerFitnessId) {
                if (typeof userPackage[i].client === "string") {
                    arr[0] = userPackage[i].client;
                };
                arr.push(userPackage[i + 1].client);
                userPackage[i + 1].client = arr
                userPackage.splice(i, 1);
                i--;
            }
        }
    }



    const columns = useMemo(
        () => [
            {

                Header: "Package",
                columns: [
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
                            return <>
                                <button className='text-nowrap' onClick={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.row.original.id, actionType: 'create', type: 'Group Class', duration: row.row.original.duration })
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
                            return <>
                                {row.value === "N/A" ? <p className='text-center mb-0'>N/A</p> :
                                    row.value.length === 1 ?
                                        <img
                                            src="https://picsum.photos/200/100" alt='profile-pic'
                                            style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                        :
                                        <div className='position-relative mx-auto' style={{ width: '8rem', height: '5rem' }}>
                                            {row.value.slice(0, 4).map((item, index) => {
                                                let postionLeft = 20;
                                                return <img
                                                    key={index}
                                                    src="https://picsum.photos/200/100" alt='profile-pic'
                                                    style={{ width: '60px', height: '60px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                    className='position-absolute ml-2'
                                                />
                                            })}
                                        </div>
                                }


                                {row.value === "N/A" ? "" :
                                    row.value.length === 1 ? <p className='text-center'>{row.value}</p> : <p className='text-center'>{row.value.length} people</p>

                                }
                            </>
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
                            const actionClick1 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Group Class", rowData: "" })
                            }
                            const actionClick2 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Group Class", rowData: row.original })
                            }

                            const actionClick3 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.proManagerId, actionType: 'allClients', type: 'Group Class' })
                            }


                            const arrayAction = [
                                { actionName: 'Manage', actionClick: actionClick1 },
                                { actionName: 'Details', actionClick: actionClick2 },
                                { actionName: 'All Clients', actionClick: actionClick3 },
                            ]

                            return <ActionButton
                                arrayAction={arrayAction}
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
