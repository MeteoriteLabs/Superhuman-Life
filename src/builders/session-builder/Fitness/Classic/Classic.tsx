import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col, Form } from "react-bootstrap";
import Table from '../../../../components/table';
import AuthContext from "../../../../context/auth-context";
import { GET_TAGS_FOR_CLASSIC } from '../../graphQL/queries';
import FitnessAction from '../FitnessAction';
import ActionButton from '../../../../components/actionbutton';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

export default function Classic(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [showHistory, setShowHistory] = useState(false);


    const fitnessActionRef = useRef<any>(null);

    const mainQuery = useQuery(GET_TAGS_FOR_CLASSIC, {variables: {id: auth.userid}, onCompleted: (data) => loadData(data)});

    // const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic'
    //     },

    // });

    // const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic'
    //     },

    // });



    // const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic'
    //     },
    //     onCompleted: (data) => conso()
    // })



    const loadData = (data: any) => {
        // const arrayData: any[] = [];

        // const flattenData1 = flattenObj({...data1});
        // const flattenData2 = flattenObj({...data2});
        // const flattenData3 = flattenObj({...data3});

        // let fitnessProgramItem: any = {};
        // for (let i = 0; i < flattenData1?.fitnesspackages.length; i++) {
        //     for (let j = 0; j < flattenData2?.programManagers.length; j++) {
            
        //         if (flattenData1.fitnesspackages[i].id === flattenData2.programManagers[j].fitnesspackages[0].id) {
        //             fitnessProgramItem.proManagerFitnessId = flattenData2.programManagers[j].fitnessprograms[0].id;
        //             fitnessProgramItem.title = flattenData2.programManagers[j].fitnessprograms[0].title;
        //             fitnessProgramItem.published_at = flattenData2.programManagers[j].fitnessprograms[0].published_at;
        //             fitnessProgramItem.proManagerId = flattenData2.programManagers[j].id;

        //             arrayData.push({ ...flattenData1.fitnesspackages[i], ...fitnessProgramItem });
        //         }
             
        //     }
        // }


        // const arrayA = arrayData.map(item => item.id);

        // const filterPackage = flattenData1?.fitnesspackages.filter((item: { id: string; }) => !arrayA.includes(item.id));
        // filterPackage.forEach(item => {
        //     arrayData.push(item)
        // })

     

        // const arrayFitnessPackage = arrayData.map(fitnessPackage => {
        //     let client: string[] = [];

        //     flattenData3?.clientPackages?.forEach((userPackage: { fitnesspackages: { id: string; }; users_permissions_user: { username: string; }; }) => {
        //         if (fitnessPackage.id === userPackage.fitnesspackages[0].id) {
        //             client.push(userPackage.users_permissions_user.username)
        //         }
        //         fitnessPackage = { ...fitnessPackage, client }
        //     })

        //     return fitnessPackage
        // })



        // for (let i = 0; i < arrayFitnessPackage.length - 1; i++) {
        //     if (arrayFitnessPackage[i].id === arrayFitnessPackage[i + 1].id) {
        //         arrayFitnessPackage.splice(arrayFitnessPackage[i], 1)
        //     }
        // }

        const flattenData = flattenObj({...data});
        console.log(flattenData);


        setUserPackage(
            [...flattenData.tags.map((packageItem) => {
                return {
                    tagId: packageItem.id,
                    id: packageItem.id,
                    packageName: packageItem.fitnesspackage.packagename,
                    duration: packageItem.fitnesspackage.duration,
                    expiry: moment(packageItem?.fitnesspackage?.expiry_date).format("MMMM DD,YYYY"),
                    // packageStatus: packageItem.Status ? "Active" : "Inactive",

                    // proManagerId: packageItem.proManagerId,
                    // proManagerFitnessId: packageItem.proManagerFitnessId,
                    // client: packageItem.client ? packageItem.client : "N/A",
                    // time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
                    programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
                    // programStatus: packageItem.client?.length > 0 ? "Assigned" : "N/A",
                    // renewal: packageItem.title ? "25/08/2021" : "N/A",
                }
            })]
        )

    }

    // const FetchData = () => useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic Class',
    //     },
    //     onCompleted: (data) => loadData(data)
    // })


    // const loadData = (data) => {
    //     // console.log('Classic query data', data);
    //     setUserPackage(
    //         [...data.userPackages].map((packageItem) => {
    //             // let renewDay: any = '';
    //             // if (packageItem.fitnesspackages.length !== 0) {
    //             //     renewDay = new Date(packageItem.effective_date);
    //             //     renewDay.setDate(renewDay.getDate() + packageItem.fitnesspackages[0].duration)
    //             // }

    //             return {
    //                 id: packageItem.fitnesspackages[0].id,
    //                 packageName: packageItem.fitnesspackages[0].packagename,
    //                 duration: packageItem.fitnesspackages[0].duration,
    //                 expiry: moment(packageItem.expiry_date).format("MMMM DD,YYYY"),
    //                 packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
    //                 // effective_date: moment(packageItem.effective_date).format("MMMM DD,YYYY"),


    //                 client: packageItem.users_permissions_user.username,
    //                 programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
    //                 programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
    //                 // programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : moment(renewDay).format('MMMM DD,YYYY'),
    //             }

    //         })
    //     )
    // }


    // FetchData();

    // console.log('user package', userPackage)

    // let arr: any = []
    // for (let i = 0; i < userPackage.length - 1; i++) {
    //     if ((userPackage[i].id === userPackage[i + 1].id && userPackage[i].duration === userPackage[i + 1].duration)) {
    //         if (userPackage[i].client.length > 0) {
    //             arr[0] = userPackage[i].client;
    //         };

    //         arr.push(userPackage[i + 1].client);
    //         userPackage[i].client = arr
    //         userPackage.splice(i + 1, 1);
    //         i--;


    //         // if (userPackage[i].programName === userPackage[i + 1].programName) {
    //         // }
    //     }
    // }

    function handleRedirect(id: any){
        window.location.href = `/classic/session/scheduler/${id}`;
    };

    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
                    { accessor: 'duration', Header: 'Duration' },
                    { accessor: 'expiry', Header: 'Expiry' },
                    // {
                    //     accessor: "packageStatus",
                    //     Header: "Status",
                    //     Cell: (row: any) => {
                    //         return <>
                    //             {row.value === "Active" ?
                    //                 <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                    //                 <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                    //             }
                    //         </>
                    //     },
                    //     enableRowSpan: true
                    // },
                ]
            },

            { accessor: ' ', Header: '' },

            {
                Header: "Class Details",
                columns: [
                    { accessor: "programName", Header: 'Class Name' },
                    {
                        accessor: "client",
                        Header: "Client",
                        Cell: (row) => {
                            return <div >
                                {row.value?.length === undefined ? <p className='text-center mb-0'>N/A</p> :
                                    row.value?.length === 1 ?
                                        <img
                                            src="https://picsum.photos/200/100" alt='profile-pic'
                                            style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                        :
                                        <div className='position-relative mx-auto' style={{ width: '8rem', height: '5rem' }}>
                                            {row.value?.slice(0, 4).map((item, index) => {
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
                                {row.value?.length === undefined  ? "" :
                                    row.value?.length === 1 ? <p className='text-center'>{row.value}</p> : <p className='text-center'>{row.value?.length} people</p>
                                }


                            </div>
                        }
                    },

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
                    {
                        id: "edit",
                        Header: "Actions",
                        Cell: ({ row }: any) => {
                            const actionClick1 = () => {
                                handleRedirect(row.original.tagId);
                            }
                            const actionClick2 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Classic Class", rowData: row.original })
                            }

                            const actionClick3 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'allClients', type: "Classic Class" })
                            }

                            const arrayAction = [
                                { actionName: 'Manage', actionClick: actionClick1 },
                                { actionName: 'Details', actionClick: actionClick2 },
                                { actionName: 'All Clients', actionClick: actionClick3 },
                            ]
                            return <ActionButton
                                arrayAction={arrayAction}
                            >
                            </ActionButton>
                        }
                    }
                ]
            },
        ],
        []
    );

    function handleHistoryPackage(data: any){
        const flattenData = flattenObj({...data});

        setUserPackage(
            [...flattenData.tags.map((packageItem) => {
                return {
                    tagId: packageItem.id,
                    id: packageItem.id,
                    packageName: packageItem.fitnesspackage.packagename,
                    duration: packageItem.fitnesspackage.duration,
                    expiry: moment(packageItem?.fitnesspackage?.expiry_date).format("MMMM DD,YYYY"),
                    // packageStatus: packageItem.Status ? "Active" : "Inactive",

                    // proManagerId: packageItem.proManagerId,
                    // proManagerFitnessId: packageItem.proManagerFitnessId,
                    // client: packageItem.client ? packageItem.client : "N/A",
                    // time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
                    programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
                    // programStatus: packageItem.client?.length > 0 ? "Assigned" : "N/A",
                    // renewal: packageItem.title ? "25/08/2021" : "N/A",
                }
            })]
        )
    }

    if (!showHistory) {
        if (userPackage.length > 0) {
            userPackage.filter((item: any, index: any) => moment(item.expiry).isBefore(moment()) === true ? userPackage.splice(index, 1) : null);
        }
    }

    return (
        <div className="mt-5">
            <div className='mb-3'>
                <Form>
                    <Form.Check 
                        type="switch"
                        id="custom-switch4"
                        label="Show History"
                        defaultChecked={showHistory}
                        onClick={() => { setShowHistory(!showHistory); mainQuery.refetch().then((res: any) => {
                            handleHistoryPackage(res.data);
                        }) }}
                    />
                </Form>
            </div>
            <Row>
                <Col>
                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
