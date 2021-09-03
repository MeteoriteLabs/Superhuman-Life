import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import { GET_ALL_PACKAGES } from '../../../resource-builder/graphQL/queries';
import AuthContext from "../../../../context/auth-context"
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';

export default function Custom(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);

    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Custom Fitness',
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('custom query data', data)
        setUserPackage(
            [...data.userPackages].map((packageItem, index) => {
                return {

                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.effective_date).format("DD/MM/YYYY"),
                   
                    packageDisciplines: packageItem.fitnesspackages[0].disciplines.map(item => {
                        return {
                            value: item.id,
                            label: item.disciplinename
                        }
                    }),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: "25/10/20",


                    programId: packageItem.fitnessprograms[0].id,
                    client: packageItem.fitnessprograms[0].users_permissions_user.username,
                    programName: packageItem.fitnessprograms[0].title,
                    description: packageItem.fitnessprograms[0].description,
                    level: packageItem.fitnessprograms[0].level,
                    programDisciplines: packageItem.fitnessprograms[0].fitnessdisciplines.map(item => {
                        return {
                            value: item.id,
                            label: item.disciplinename
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
                { accessor: "effectiveDate", Header: "Effect Date" },
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
    ], []);



    const dataTable = useMemo<any>(() => [
        {
            "students": 'https://picsum.photos/200',
            "name": "Exercise-1",
            "status": "Active",
            "startDate": "25/06/20",
            "packageRenewal": "25/07/20",

            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },

        {
            "students": 'https://picsum.photos/200',
            "name": "Exercise-1",
            "status": "Active",
            "startDate": "25/06/20",
            "packageRenewal": "25/07/20",

            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },

        {
            "students": 'https://picsum.photos/200',
            "name": "Exercise-1",
            "status": "Active",
            "startDate": "25/06/20",
            "packageRenewal": "25/07/20",

            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },

    ], []);

    return (
        <div className="mt-5">
            <Row>
                <Col>

                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef}  />
                </Col>

            </Row>
        </div>
    )
}
