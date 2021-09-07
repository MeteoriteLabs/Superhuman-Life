import React, { useContext, useMemo, useState } from 'react'
import { Row, Col, Badge } from 'react-bootstrap';
import authContext from '../../../../context/auth-context';
import Table from '../../../../components/table/index'
import BookingTable from '../../../../components/table/BookingTable/BookingTable'
import ActionButton from '../../../../components/actionbutton';

export default function BookingFitness() {
    const auth = useContext(authContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    // const fitnessActionRef = useRef<any>(null);

    // const FetchData = () => {
    //     useQuery(GET_PACKAGE_BY_TYPE, {
    //         variables: {
    //             id: auth.userid,
    //             type: 'Personal Training',
    //         },
    //         onCompleted: (data) => loadData(data)
    //     })

    // }




    const loadData = (data) => {
        // console.log('pt query data', data);

    }


    // FetchData();

    const dataTable = useMemo<any>(() => [
        {
            packageName:'Package Name 1',
            fitness_package_type:'Personal Training',
            confirmations:'Auto Accept',
            requests:'Configured',
        },
        {
            packageName:'Package Name 2',
            fitness_package_type:'Group Class',
            confirmations:'Manual Accept',
            requests:'Not configured',
        },
        {
            packageName:'Package Name 3',
            fitness_package_type:'Custom Fitness',
            confirmations:'Auto Accept',
            requests:'Not configured',
        },
        {
            packageName:'Package Name 4',
            fitness_package_type:'Classic Class',
            confirmations:'Manual Accept',
            requests:'Configured',
        }


    ], []);

    const columns = useMemo(
        () => [
            { accessor: "packageName", Header: 'Name' },
            {
                accessor: "fitness_package_type", Header: 'Type',
                Cell: (row: any) => {
                    return <>
                        {row.value === "Personal Training" ? <img src='./assets/PTType.svg' alt='PT' /> : ""}
                        {row.value === "Group Class" ? <img src='./assets/GroupType.svg' alt='group' /> : ""}
                        {row.value === "Custom Fitness" ? <img src='./assets/CustomType.svg' alt='custom' /> : ""}
                        {row.value === "Classic Class" ? <img src='./assets/ClassicType.svg' alt='classic' /> : ""}
                    </>
                }
            },
            {
                accessor: "confirmations",
                Header: "Booking Confirmations",
                Cell: (row: any) => {
                    return <>
                        {row.value === "Auto Accept" ?
                            <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                            <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                        }
                    </>
                }
            },
            {
                accessor: "requests",
                Header: "Date Requests",
                Cell: (row: any) => {
                    return <>
                        {row.value === "Configured" ?
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
                    return <ActionButton
                        action1='Booking confirmation'
                        actionClick1={() => {
                        }}

                        action2='Data requests'
                        actionClick2={() => {
                        }}
                    >
                    </ActionButton>
                }
            }

        ],
        []
    );

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                </Col>
            </Row>
        </div>
    )
}
