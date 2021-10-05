import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';

import AuthContext from "../../../../context/auth-context"
import { GET_ALL_CLIENT_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';

export default function Custom(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);



    const FetchData = () => {
        useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Custom Fitness',
            },
            onCompleted: (data) => loadData(data)
        })

    }


    const loadData = (data) => {
        // console.log('custom query data', data);
        setUserPackage(
            [...data.userPackages].map((packageItem) => {
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
                    programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
                    programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
                    programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : moment(renewDay).format('MMMM DD,YYYY'),
                }

            })
        )
    }


    FetchData();

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
                        return <ActionButton
                          // actionName={["Manage", "Details"]}
                            action1='Manage'
                            
                            actionClick1={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Custom Fitness", rowData:""})
                            }}

                            action2='Details'
                            actionClick2={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Custom Fitness", rowData: row.original })
                            }}
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
