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
                type: 'Personal Training',
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('pt query data', data)
        setUserPackage(
            [...data.userPackages].map((packageItem, index) => {
                return {
                  
                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.effective_date).format("DD/MM/YYYY"),
                    packageDisciplines: packageItem.fitnesspackages[0].disciplines.map(item => {
                        return {
                            value:item.id,
                            label:item.disciplinename
                        }
                    }),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: "25/10/20",


                    programId:packageItem.fitnessprograms[0].id,
                    client:packageItem.fitnessprograms[0].users_permissions_user.username,
                    programName: packageItem.fitnessprograms[0].title,
                    description:packageItem.fitnessprograms[0].description,
                    level: packageItem.fitnessprograms[0].level,
                    programDisciplines: packageItem.fitnessprograms[0].fitnessdisciplines.map(item => {
                        return {
                            value:item.id,
                            label:item.disciplinename
                        }
                    }),
                    users_permissions_user: packageItem.fitnessprograms[0].users_permissions_user.id,
                    programStatus: "Assigned",
                    programRenewal: "25/07/20",
                }
            })
        )
    }


    FetchData();
    // console.log('userPackage', userPackage);


    // const dataTable: any[] = []
    // new Array(2).fill(0).map((_, index) => {
    //     dataTable.push({
    //         id: userPackage[0]?.id,
    //         packageName: userPackage[0]?.packageName[index],
    //         effectiveDate: userPackage[0]?.effectiveDate,
    //         packageStatus: userPackage[0]?.packageStatus[index],
    //         packageRenewal: "25/10/20",


    //         client: userPackage[0]?.client[index],
    //         programName: userPackage[0]?.programName[index],
    //         programStatus: "Assigned",
    //         programRenewal: "25/07/20",

    //     })
    // })

    // console.log('dataTable', dataTable);

    


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
                    // { accessor: 'id', Header: "ID" },
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
                    {
                        accessor: "client",
                        Header: "Client",
                        Cell: (row: any) => {
                            return <div className='text-center'>
                                <img  src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                                <p className='mt-3'>{row.value}</p>
                            </div>
                        }
                    },
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
                        console.log("🚀 ~ file: PT.tsx ~ line 233 ~ PT ~ row", row)
                            return <ActionButton
                                action1='Manage'
                                // actionClick1={() => {
                                //     fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData:""})
                                // }}
                             
                                action2='Details'
                                actionClick2={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
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
                    <PTTable columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef}  />
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