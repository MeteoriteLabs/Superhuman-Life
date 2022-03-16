import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';

import AuthContext from "../../../../context/auth-context"
import { GET_ALL_CLIENT_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';
import { flattenObj } from '../../../../components/utils/responseFlatten';

export default function Custom(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);



    const FetchData = () => {
        useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Custom',
            },
            onCompleted: (data) => loadData(data)
        })

    }


    const loadData = (data) => {
        const flattenData = flattenObj({ ...data });
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
                    programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
                    programId: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].id,
                    programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
                    programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : calculateProgramRenewal(packageItem.program_managers[0].fitnessprograms[0].duration_days, packageItem.effective_date, packageItem.program_managers[0].fitnessprograms[0].renewal_dt),
                }

            })
        )
    }

    function calculateProgramRenewal(duration, effectiveDate, renewalDate) {
        const dates: string[] = []; 

        for(var i=0; i<duration; i++){
            const t = moment(effectiveDate).add(i, 'days').format("MMMM DD,YYYY");
            dates.push(t);
        }
        return dates[renewalDate-1];
    }


    FetchData();

    function handleRedirect(id: any, clientId: any) {
        if(id === 'N/A'){
            alert('No Program Assigned');
            return;
        }
        window.location.href = `/custom/session/scheduler/${clientId}/${id}`
    }

    const columns = useMemo<any>(() => [
        {
            accessor: "client",
            Header: "Client",
            Cell: (row: any) => {
                return <div className='text-center'>
                    <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                    <p className='mt-3'>{row.value}</p>
                </div>
            }
        },

        {
            Header: "Package",
            columns: [
                {
                    accessor: "packageName",
                    Header: "Name"
                },
                {
                    accessor: "packageStatus",
                    Header: "Status",
                    Cell: (row: any) => {
                        return <>
                            {(row.value === "Active" || row.value === "Private") ?
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                            }
                        </>
                    }
                },
                { accessor: "effectiveDate", Header: "Effective Date" },
                { accessor: "packageRenewal", Header: "Renewal Date" },

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
                            {row.value === "Assigned" ?
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                            }
                        </>
                    }
                },
                { accessor: "programRenewal", Header: "Renewal" },
                {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => {
                        const actionClick1 = () => {
                            handleRedirect(row.original.programId, row.original.clientId);
                        };

                        const actionClick2 = () => {
                            fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Custom Fitness", rowData: row.original })
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
    ], []);


    return (
        <div className="mt-5">
            <Row>
                <Col>

                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
