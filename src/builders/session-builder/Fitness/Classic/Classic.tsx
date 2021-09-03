import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import AuthContext from "../../../../context/auth-context"
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment'
import FitnessAction from '../FitnessAction';
import ActionButton from '../../../../components/actionbutton';

export default function Classic(props) {

    const auth = useContext(AuthContext);

    const [userPackage, setUserPackage]: any[] = useState('')
    console.log("🚀 ~ file: Classic.tsx ~ line 16 ~ Classic ~ userPackage", userPackage)
    const fitnessActionRef = useRef<any>(null)





    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Classic Class'
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('classsic query data', data);
        setUserPackage(
            [...data.userPackages].map((packageItem, index) => {
                return {
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration.toString(),
                    // expiry: moment(packageItem.fitnesspackages[0].expiry_date).format("DD/MM/YY"),
                    expiry: "30/7/22",
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",

                    client: packageItem.fitnessprograms[0].users_permissions_user.username,
                    programName: packageItem.fitnessprograms[0].title,
                    programStatus: "Assigned",
                    programRenewal: "25/07/20",
                }
            })
        )
    }


    FetchData();


    const columns = useMemo<any>(() => [
        {
            Header: "Package",
            columns: [
                {
                    accessor: "packageName",
                    Header: "Name"
                },
                { accessor: "duration", Header: "Duration" },
                { accessor: "expiry", Header: "Expiry" },
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
                    accessor: "client",
                    Header: "Client",
                    Cell: (row: any) => {
                        return <div className='text-center'>
                            <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                            <p className='mt-3'> {row.value}</p>
                        </div>
                    }
                },
                { accessor: 'programName', Header: "Name" },
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
                            actionClick1={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'build', type: 'Classic Class' })
                            }}
                            action2='Edit'
                            actionClick2={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'edit', type: 'Classic Class' })
                            }}
                            action3='View'
                            actionClick3={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'view', type: 'Classic Class' })
                            }}
                            action4='Details'
                            actionClick4={() => {
                                fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: 'Classic Class' })
                            }}
                        />
                    }
                }

            ]
        },
    ], []);

    const dataTable = useMemo<any>(() => [
        {
            "packageName": "Package Name",
            "duration": "10 days",
            "expiry": "25/07/20",
            "packageStatus": "Active",

            "programName": "Package Name",
            "client": 'Peter',
            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },
        {
            "packageName": "Package Name",
            "duration": "1 days",
            "expiry": "25/07/20",
            "packageStatus": "Inactive",

            "programName": "Package Name",
            "client": 'Mary',
            "programStatus": "Assigned",
            "programRenewal": "25/07/20",
        },
        {
            "packageName": "Package Name",
            "duration": "10 days",
            "expiry": "25/07/20",
            "packageStatus": "Active",

            "programName": "Package Name",
            "client": 'Lisa',
            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },

    ], []);


    // console.log(userPackage);
    // console.log(dataTable)

    return (
        <div className="mt-5">
            <Row>
                <Col>

                    <Table columns={columns} data={dataTable} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
