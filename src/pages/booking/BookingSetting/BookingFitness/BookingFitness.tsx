import React, { useContext, useMemo, useRef, useState } from 'react'
import { Row, Col, Badge } from 'react-bootstrap';
import authContext from '../../../../context/auth-context';
import Table from '../../../../components/table/index'
import ActionButton from '../../../../components/actionbutton';
import ConfirmRequestAction from './ConfirmRequestAction';

import { BOOKING_CONFIG } from '../../GraphQL/queries';
import { useQuery } from '@apollo/client';

export default function BookingFitness() {
    const auth = useContext(authContext);
    const [bookingPackage, setBookingPackage] = useState<any>([]);
    const bookingFitnessActionRef = useRef<any>(null);



    const FetchData = () => {
        useQuery(BOOKING_CONFIG, {
            variables: {
                id: auth.userid,
            },
            onCompleted: (data) => loadData(data)
        })

    }


    const loadData = (data) => {
        // console.log('booking setting data', { data });
        setBookingPackage(
            [...data.bookingConfigs?.map((fitnessPackage, index) => {
                return {
                    id: fitnessPackage.id,
                    packageName: fitnessPackage.fitnesspackage.packagename,
                    fitness_package_type: fitnessPackage.fitnesspackage.fitness_package_type.type,
                    bookingPerMonth: fitnessPackage.BookingsPerMonth,
                    bookingPerDay: fitnessPackage.bookingsPerDay,
                    confirmations: fitnessPackage.isAuto ? "Auto Accept" : "Manual Accept",
                    requests: 'Configured',
                }
            })]
        )
    }


    FetchData();

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
                    const actionClick1 = () => {
                        bookingFitnessActionRef.current.TriggerForm({ actionType: 'confirmation', formData: row.original });
                    };

                    const actionClick2 = () => {
                        bookingFitnessActionRef.current.TriggerForm({ actionType: 'request' });
                    };


                    const arrayAction = [
                        { actionName: 'Booking confirmation', actionClick: actionClick1 },
                        { actionName: 'Data requests', actionClick: actionClick2 },
                    ]
                    return <ActionButton
                        arrayAction={arrayAction}
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
                    <Table columns={columns} data={bookingPackage} />
                    <ConfirmRequestAction ref={bookingFitnessActionRef} />
                </Col>
            </Row>
        </div>
    )
}
