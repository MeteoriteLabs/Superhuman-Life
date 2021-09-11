import { useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import ActionButton from '../../../components/actionbutton';
import BookingTable from '../../../components/table/BookingTable/BookingTable'
import authContext from '../../../context/auth-context';
import { FILTER_PACKAGES, GET_ALL_PACKAGES } from '../graphQL/queries';

export default function Movement(props) {


    const auth = useContext(authContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const bookingAction = useRef(null)



    const FetchData = () => {
        useQuery(GET_ALL_PACKAGES, {
            variables: {
                id: auth.userid
            },
            onCompleted: (data) => loadData(data)
        })
    }



    const loadData = (data: { userPackages: any[]; }) => {
        setUserPackage(
            [...data.userPackages.map(packageItem => {
                const renewDay: Date = new Date(packageItem.effective_date);
                renewDay.setDate(renewDay.getDate() + packageItem.package_duration);
                return {
                    purchase_date: packageItem.purchase_date,
                    client: packageItem.users_permissions_user.username,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    fitness_package_type: packageItem.fitnesspackages[0].fitness_package_type.type,
                    effectiveDate: packageItem.effective_date,
                    packageRenewal: renewDay,
                    duration: packageItem.package_duration,
                    price: 'Rs 4000',
                    payment_status: "Paid",
                    Status: "Accepted",
                }
            })]
        )
    };

    FetchData();

    let newPackageCount = 0
    userPackage.forEach((item: { purchase_date: moment.MomentInput; }) => {
        let purchaseDate: any = new Date(moment(item.purchase_date).format('MM/DD/YYYY'));
        let currentDate: any = new Date(moment().format('MM/DD/YYYY'));
        const diffTime = Math.abs(purchaseDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newPackageCount = diffDays
    })


    const columns = useMemo(
        () => [
            {
                accessor: "client",
                Header: "Client",
                Cell: (row: any) => {
                    return <div className='text-center'>
                        <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                        <p className='mt-3'>{row.value}</p>
                    </div>
                },
                disableSortBy: true
            },
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
            { accessor: "packageName", Header: 'Package Name', disableSortBy: true },
            {
                accessor: "purchase_date", Header: 'Purchase Date ',
                Cell: (row: any) => {
                    return <div>
                        <p>{moment(row.value).format('MMMM DD, YYYY')}</p>
                        <p>{moment(row.value).format('hh:mm a')}</p>
                    </div>
                },

            },
            {
                accessor: "effectiveDate", Header: "Effective Date",
                Cell: (row: any) => {
                    return <p>{moment(row.value).format('MMMM DD, YYYY')}</p>
                }
            },
            {
                accessor: "packageRenewal", Header: 'Renewal Date',
                Cell: (row: any) => {
                    return <p>{moment(row.value).format('MMMM DD, YYYY')}</p>
                }
            },
            { accessor: "duration", Header: 'Duration ', disableSortBy: true },
            { accessor: "price", Header: 'Price', },

            {
                accessor: "payment_status",
                Header: "Payment Status",
                Cell: (row: any) => {
                    return <>
                        {row.value === "Paid" ?
                            <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                            <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                        }
                    </>
                }
            },
            {
                accessor: "Status",
                Header: "Status",
                Cell: (row: any) => {
                    return <>
                        {row.value === "Accepted" ?
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
                        action1='Go To Client'
                        actionClick1={() => {
                            // bookingAction.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData:""})
                        }}

                        action2='View Invoice'
                        actionClick2={() => {
                            // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                        }}
                        action3='Request Data'
                        actionClick3={() => {
                            // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                        }}
                        action4='Accept'
                        actionClick4={() => {
                            // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                        }}
                        action5='Reject'
                        actionClick5={() => {
                            // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                        }}
                    >
                    </ActionButton>
                }

            },
        ],
        []
    );

    // const dataTable2 = useMemo<any>(() => [
    //     {
    //         purchase_date: '2021-08-03T19:00:00.000Z',
    //         client: 'Arjun Nair',
    //         packageName: "Package Name 1",
    //         fitness_package_type: "Personal Training",
    //         effectiveDate: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         packageRenewal: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         duration: '30 days',
    //         price: 'Rs 4000',
    //         payment_status: "Paid",
    //         Status: "Accepted",
    //     },

    //     {
    //         purchase_date: '2021-08-03T19:00:00.000Z',
    //         client: 'Sophiya D’Cruz',
    //         packageName: "Package Name 2",
    //         fitness_package_type: "Group Class",
    //         effectiveDate: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         packageRenewal: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         duration: '30 days',
    //         price: 'Rs 4000',
    //         payment_status: "unPaid",
    //         Status: "Accepted",
    //     },

    //     {
    //         purchase_date: '2021-08-03T19:00:00.000Z',
    //         client: 'Michael Wong',
    //         packageName: "Package Name 3",
    //         fitness_package_type: "Custom Fitness",
    //         effectiveDate: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         packageRenewal: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         duration: '30 days',
    //         price: 'Rs 4000',
    //         payment_status: "Paid",
    //         Status: "Accepted",
    //     },

    //     {
    //         purchase_date: '2021-08-03T19:00:00.000Z',
    //         client: 'Michael Wong',
    //         packageName: "Package Name 4",
    //         fitness_package_type: "Classic Class",
    //         effectiveDate: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         packageRenewal: moment("2021-08-04T19:00:00.000Z").format('DD/MM/YYYY'),
    //         duration: '30 days',
    //         price: 'Rs 4000',
    //         payment_status: "Paid",
    //         Status: "Accepted",
    //     },
    // ], []);




    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <BookingTable
                        columns={columns}
                        data={userPackage}
                        newPackageCount={newPackageCount}
                    />
                </Col>
            </Row>
        </div>
    )
}
