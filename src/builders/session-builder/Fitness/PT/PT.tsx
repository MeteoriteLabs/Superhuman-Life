import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context"
import PTTable from '../../../../components/table/PtTable/PTTable'
import { GET_ALL_CLIENT_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction'
import { flattenObj } from '../../../../components/utils/responseFlatten';


export default function Group(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);

    const FetchData = () => {
        useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Personal Training',
            },
            onCompleted: (data) => loadData(data)
        })
    }


    const loadData = (data) => {
        const flattenData = flattenObj({...data});
        setUserPackage(
            [...flattenData.clientPackages].map((packageItem) => {
                let renewDay: any = '';
                if (packageItem.fitnesspackages.length !== 0) {
                    renewDay = new Date(packageItem.effective_date);
                    renewDay.setDate(renewDay.getDate() + packageItem.fitnesspackages[0].duration)
                }
                return {
                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.effective_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: moment(renewDay).format("MMMM DD,YYYY"),

                    client: packageItem.users_permissions_user.username,
                    clientId: packageItem.users_permissions_user.id,
                    level: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].level,
                    discipline: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].fitnessdisciplines,
                    description: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].description,
                    programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
                    programId: packageItem.program_managers.length === 0 ? null : packageItem.program_managers[0].fitnessprograms[0].id,
                    programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
                    programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : calculateProgramRenewal(packageItem.program_managers[0].fitnessprograms[0].duration_days, packageItem.program_managers[0].fitnessprograms[0].start_dt, packageItem.program_managers[0].fitnessprograms[0].renewal_dt),
                }
            })
        )
    }

    function calculateProgramRenewal(duration, effectiveDate, renewalDate) {
        // console.log('calculateProgramRenewal', duration, effectiveDate, renewalDate);
        
        const dates: string[] = []; 

        for(var i=0; i<duration; i++){
            const t = moment(effectiveDate).add(i, 'days').format("MMMM DD,YYYY");
            dates.push(t);
        }
        return dates[renewalDate-1];
    }

    FetchData();

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

    function handleRedirect(id: any, client: any, clientId: any){
        if(id === null){
            alert("Please assign a program to this client first");
            return;
        }
        window.location.href = `/pt/session/scheduler/${clientId}/${client}/${id}`
    }


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
                            return <>
                                {row.value !== 'N/A' ? <div className='text-center'>
                                    <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                                    <p className='mt-3'>{row.value}</p>
                                </div> : <p className='mt-3'>{row.value}</p>
                                }
                            </>

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
                            const actionClick1 = () => {
                                handleRedirect(row.original.programId, row.original.id, row.original.clientId);
                            };

                            const actionClick2 = () => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                            };

                            const arrayAction = [
                                { actionName: 'Manage', actionClick: actionClick1 },
                                { actionName: 'Details', actionClick: actionClick2 },
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

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <PTTable columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>
            </Row>
        </div>
    )
}


