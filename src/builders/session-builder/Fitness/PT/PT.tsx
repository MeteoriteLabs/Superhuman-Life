import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context"
import PTTable from '../../../../components/table/PtTable/PTTable'
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction'



export default function Group(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);

    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Personal Training'
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('query data', data);
        // const PTdata = data.userPackages[0].fitnesspackages.filter(item => item.fitness_package_type.type === "Personal Training")
        // console.log("🚀 ~ file: PT.tsx ~ line 40 ~ loadData ~ PTdata", PTdata)
        setUserPackage(
            [...data.userPackages].map((packageItem, index) => {
                return {
                    id: packageItem.id,
                    packageName: packageItem.fitnesspackages.map(item => item.packagename),
                    effectiveDate: moment(packageItem.effective_date).format("DD/MM/YYYY"),
                    packageStatus: packageItem.fitnesspackages.map(item => item.Status ? "Active" : "Inactive"),
                    packageRenewal: "25/10/20",


                    client: packageItem.fitnessprograms.map(item => item.users_permissions_user.username),
                    programName: packageItem.fitnessprograms.map(item => item.title),
                    programStatus: "Assigned",
                    programRenewal: "25/07/20",
                }
            })
        )
    }


    FetchData();
    console.log('userPackage', userPackage);


    const dataTable: any[] = []
    new Array(2).fill(0).map((_, index) => {
        dataTable.push({
            id: userPackage[0]?.id,
            packageName: userPackage[0]?.packageName[index],
            effectiveDate: userPackage[0]?.effectiveDate,
            packageStatus: userPackage[0]?.packageStatus[index],
            packageRenewal: "25/10/20",


            client: userPackage[0]?.client[index],
            programName: userPackage[0]?.programName[index],
            programStatus: "Assigned",
            programRenewal: "25/07/20",

        })
    })

    console.log('dataTable', dataTable);

    // const dataTable = useMemo<any>(() => [
    //     {
    //         id: '1',
    //         packageName: "Package Name 1",
    //         packageStatus: 'Active',
    //         startDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programs: [
    //             {
    //                 programName: "Pirates of the Carribean 2",
    //                 client: "John",
    //                 programStatus: "Assigned",
    //                 programRenewal: "26/04/20",
    //             },
    //             {
    //                 programName: "Pirates of the Carribean 4",
    //                 client: "Mary",
    //                 programStatus: "Not Assigned",
    //                 programRenewal: "25/04/20"
    //             }
    //         ]
    //     },


    //     {
    //         id: '2',
    //         packageName: "Package Name 2",
    //         packageStatus: 'Active',
    //         startDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programs: [{
    //             programName: "Pirates of the Carribean 3",
    //             client: "Harry",
    //             programStatus: "Not Assigned",
    //             programRenewal: "25/04/20"
    //         }]
    //     },

    // ], []);


    // const dataTable2 = useMemo<any>(() => [
    //     {
    //         id: '1',
    //         packageName: "Package Name 1",
    //         packageStatus: 'Active',
    //         effectiveDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programName: "Pirates of the Carribean 2",
    //         client: "John",
    //         programStatus: "Assigned",
    //         programRenewal: "26/04/20",

    //     },

    //     {
    //         id: '1',
    //         packageName: "Package Name 1",
    //         packageStatus: 'Active',
    //         effectiveDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programName: "Pirates of the Carribean 3",
    //         client: "Mary",
    //         programStatus: "Assigned",
    //         programRenewal: "26/04/20",

    //     },


    //     {
    //         id: '2',
    //         packageName: "Package Name 2",
    //         packageStatus: 'Active',
    //         effectiveDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programName: "Pirates of the Carribean 3",
    //         client: "Harry",
    //         programStatus: "Not Assigned",
    //         programRenewal: "25/04/20"

    //     },




    // ], []);






    // const newData: Array<any> = [];

    // dataTable.forEach(obj => {
    //     obj.programs.forEach(program => {
    //         newData.push({
    //             id: obj.id,
    //             packageName: obj.packageName,
    //             packageStatus: obj.packageStatus,
    //             startDate: obj.startDate,
    //             packageRenewal: obj.packageRenewal,


    //             client: program.client,
    //             programName: program.programName,
    //             programStatus: program.programStatus,
    //             programRenewal: program.programRenewal,
    //         });
    //     });
    // });


    // console.log("newData", dataTable2)


    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: 'id', Header: "ID" },
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
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
                    { accessor: "effectiveDate", Header: "Effective Date", enableRowSpan: true },
                    { accessor: "packageRenewal", Header: 'Renewal Date', enableRowSpan: true },
                ]
            },

            { accessor: ' ', Header: '' },

            {
                Header: "Program",
                columns: [
                    { accessor: "client", Header: 'Client' },
                    { accessor: "programName", Header: 'Name' },
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
                    { accessor: "programRenewal", Header: "Renewal Date" },
                    {
                        id: "edit",
                        Header: "Actions",
                        Cell: ({ row }: any) => {
                            return <ActionButton
                                action1='Build'
                                actionClick1={() => {
                                    console.log(fitnessActionRef)
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'build', type: "Personal Training" })
                                }}
                                action2='Assign'
                                actionClick2={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'assign', type: "Personal Training" })
                                }}
                                action3='Edit'
                                actionClick3={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'edit', type: "Personal Training" })
                                }}
                                action4='View'
                                actionClick4={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'view', type: "Personal Training" })
                                }}
                                action5='Details'
                                actionClick5={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training" })
                                }}
                            >
                            </ActionButton>
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
                    <PTTable columns={columns} data={dataTable} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>
            </Row>
        </div>
    )
}




class Package {
    createPackage = (packageName, packageStatus, startDate, packageRenewal, programName, client, programStatus, programRenewal) => {
        let updatePackage: any = {};
        updatePackage.packageName = packageName;
        updatePackage.packageStatus = packageStatus;
        updatePackage.startDate = startDate;
        updatePackage.packageRenewal = packageRenewal;
        updatePackage.programName = programName;
        updatePackage.client = client;
        updatePackage.programStatus = programStatus;
        updatePackage.programRenewal = programRenewal;
        return updatePackage
    }
}

export const updatePackage = new Package();