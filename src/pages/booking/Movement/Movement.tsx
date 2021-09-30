import { useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import ActionButton from '../../../components/actionbutton';
import BookingTable from '../../../components/table/BookingTable/BookingTable'
import authContext from '../../../context/auth-context';
import { GET_ALL_BOOKINGS } from '../graphQL/queries';
import BookingAction from './BookingAction'

export default function Movement(props) {


    const auth = useContext(authContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [start, setStart] = useState(0);
    const [endRow, setEndRow] = useState(1);
    const [page, setPage] = useState(0);
    const limit = 2
    const dataLengthRef = useRef<number | null>(0)
    console.log("🚀 ~ file: Movement.tsx ~ line 21 ~ Movement ~ dataLengthRef", dataLengthRef)




    // const [newPackageCount, setNewPackageCount] = useState(0)



    const bookingActionRef = useRef<any>(null)
    const fetchIdRef = React.useRef(0)




    useQuery(GET_ALL_BOOKINGS, {
        variables: {
            id: auth.userid,
            start: start,
            limit: limit
        },
        onCompleted: (data) => loadData(data)
    })

    // console.log('repeat')
    // console.log('bottom page')
    // console.log('page', page, 'startRow', start)


 
    useEffect(() => {

        const scrollFunction = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                setPage(page + 1)
                setStart((limit * page) + 1);
            }
        };


        if (userPackage.length > 1) {
            for (let i = 0; i < userPackage.length; i++) {
                for (let j = i + 1; j < userPackage.length; j++) {
                    if (userPackage[i].id === userPackage[j].id) {
                        userPackage.splice(j, 1);
                        break
                    }
                }
            }
        }
        dataLengthRef.current = userPackage.length

        setTimeout(() => {
            window.addEventListener('scroll', scrollFunction);
        }, 1000)

        return () => window.removeEventListener('scroll', scrollFunction)

    }, [page])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])



    const loadData = (data: { clientBookings: any[]; }) => {
        let existingData = [...userPackage];
        let newData = [...data.clientBookings.map(packageItem => {
            const renewDay: Date = new Date(packageItem.effective_date);
            renewDay.setDate(renewDay.getDate() + packageItem.package_duration);
            return {
                id: packageItem.id,
                booking_date: packageItem.booking_date,
                client: packageItem.users_permissions_user.username,
                packageName: packageItem.fitnesspackages[0].packagename,
                fitness_package_type: packageItem.fitnesspackages[0].fitness_package_type.type,
                effectiveDate: packageItem.effective_date,
                packageRenewal: renewDay,
                duration: packageItem.package_duration,
                price: 'Rs 4000',
                payment_status: "Paid",
                Status: packageItem.booking_status,
            }
        })]

        setUserPackage(
            existingData.concat(newData)
        )
    };


    console.log({ userPackage })


    // New package count
    let newPackageCount = 0
    userPackage.forEach((item: { booking_date: moment.MomentInput; }) => {
        let booking_date: any = new Date(moment(item.booking_date).format('MM/DD/YYYY'));
        let currentDate: any = new Date(moment().format('MM/DD/YYYY'));
        const diffTime = Math.abs(booking_date - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 5) {
            newPackageCount++
        }
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
                accessor: "booking_date", Header: 'Booking Date ',
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
                        {row.value === "accepted" ? <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> : ""}
                        {row.value === "rejected" ? <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge> : ""}
                        {row.value === "pending" ? <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="warning">{row.value}</Badge> : ""}
                    </>
                }
            },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    return <ActionButton
                        status={row.original.Status}
                        action1='Go To Client'
                        actionClick1={() => {
                            bookingActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage' })
                        }}

                        action2='View Invoice'
                        actionClick2={() => {
                            bookingActionRef.current.TriggerForm({ id: row.original.id, actionType: 'view' })
                        }}
                        action3='Request Data'
                        actionClick3={() => {
                            bookingActionRef.current.TriggerForm({ id: row.original.id, actionType: 'request' })
                        }}

                        action4='Accept'
                        actionClick4={() => {
                            bookingActionRef.current.TriggerForm({ id: row.original.id, formData: row.original, actionType: 'accept' })
                        }}
                        action5='Reject'
                        actionClick5={() => {
                            bookingActionRef.current.TriggerForm({ id: row.original.id, actionType: 'reject' })
                        }}
                    >
                    </ActionButton>
                }

            },
        ],
        []
    );



    // const fetchDataTable = React.useCallback(({ pageSize, pageIndex }) => {

    //     const fetchId = ++fetchIdRef.current


    //     setTimeout(() => {
    //         if (fetchId === fetchIdRef.current) {
    //             setStartRow(pageSize * pageIndex);
    //             setEndRow(startRow + pageSize)
    //         }
    //     }, 1000)
    // }, [])

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <BookingTable
                        columns={columns}
                        data={userPackage}
                        newPackageCount={newPackageCount}

                    />

                    <BookingAction ref={bookingActionRef} />
                </Col>
            </Row>
        </div>
    )
}
