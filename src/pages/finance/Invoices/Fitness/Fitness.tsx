import React from 'react'
import { Badge, Row, Col, Button } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from '../../../../components/table/index'
import ActionButton from '../../../../components/actionbutton';
import { GET_ALL_BOOKINGS_FINANCE } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import authContext from '../../../../context/auth-context';
import moment from 'moment';
import InvoicesAction from '../InvoicesAction';


export default function Fitness() {


    const InvoiceActionRef = useRef<any>(null)

    const auth = useContext(authContext);
    const [dataTable, setDataTable] = useState<any[]>([]);

    const FetchData = () => useQuery(GET_ALL_BOOKINGS_FINANCE, {
        variables: { id: auth.userid },
        onCompleted: data => loadData(data)
    })


    const loadData = (data: any) => {
        
        setDataTable(
            [...data.clientBookings.data].map(fitnessPackage => {
                const renewDay: Date = new Date(fitnessPackage.attributes.effective_date);
                renewDay.setDate(renewDay.getDate() + fitnessPackage.attributes.package_duration);
                const mrpFilter = fitnessPackage.attributes.fitnesspackages.data[0].attributes.fitnesspackagepricing.filter(item =>item.duration === fitnessPackage.attributes.package_duration);
                console.log("🚀 ~ file: Fitness.tsx ~ line 35 ~ loadData ~ mrpFilter", mrpFilter)
                
                return {
                    client: fitnessPackage.attributes.users_permissions_users.data.length > 0 ? fitnessPackage.attributes.users_permissions_users.data[0].attributes.username : "N/A",
                    clientPhoneNumber: fitnessPackage.attributes.users_permissions_users.data.length > 0 ? fitnessPackage.attributes.users_permissions_users.data[0].Phone_Number : "N/A",
                    clientAddress: fitnessPackage.attributes.users_permissions_users.data.length > 0 ? fitnessPackage.attributes.users_permissions_users.data[0].addresses : "N/A",

                    package: fitnessPackage.attributes.fitnesspackages.data[0].attributes,
                    type: fitnessPackage.attributes.fitnesspackages.data[0].attributes.fitness_package_type.data.attributes.type,

                    bookingDate: moment(fitnessPackage.attributes.booking_date).format("MMMM DD,YYYY"),
                    mode: fitnessPackage.attributes.fitnesspackages.data[0].attributes.mode,
                    packageName: fitnessPackage.attributes.fitnesspackages.data[0].attributes.packagename,
                    duration: fitnessPackage.attributes.package_duration,
                    effective: moment(fitnessPackage.attributes.effective_date).format('MMMM DD,YYYY'),
                    expiry: moment(renewDay).format('MMMM DD,YYYY'),
                    mrp: mrpFilter.length > 0 ? mrpFilter[0].mrp : 0,
                    status: fitnessPackage.attributes.booking_status,
                    userInfo:fitnessPackage.attributes.fitnesspackages.data[0].attributes.users_permissions_user.data.attributes
                }
            })

        )
    }

    FetchData();
    console.log(dataTable)


    const columns = useMemo(
        () => [
            {
                accessor: "client",
                Header: "Client",
                Cell: (row: any) => {
                    return <>
                        {row.value !== 'N/A' ? <div className='text-center'>
                            <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                            <p className='mt-3 mb-0'>{row.value}</p>
                        </div> : <p className='mt-3 mb-0'>{row.value}</p>
                        }
                    </>

                }
            },
            {
                accessor: "type", Header: "Type", Cell: ({ row }: any) => {
                    let imgName = '';
                    let name = '';

                    switch (row.original.type) {
                        case "Personal Training": {
                            switch (row.original.mode) {
                                case "Online": {
                                    imgName = "custompersonal-training-Online.svg";
                                    name = "PT";
                                    break;
                                }

                                case "Online_workout": {
                                    imgName = "custompersonal-training-Online.svg";
                                    name = "PT";
                                    break
                                }

                                case "Offline": {
                                    imgName = "custompersonal-training-Offline.svg";
                                    name = "PT";
                                    break;
                                }

                                case "Offline_workout": {
                                    imgName = "custompersonal-training-Offline.svg";
                                    name = "PT";
                                    break;
                                }

                                case "Hybrid": {
                                    imgName = "pt.svg";
                                    name = "";
                                    break;
                                }
                            }
                            break
                        }

                        case "Group Class": {
                            switch (row.original.mode) {
                                case "Online": {
                                    imgName = "customgroup-Online.svg";
                                    name = "Group Online";
                                    break;
                                }

                                case "Offline": {
                                    imgName = "customgroup-Offline.svg";
                                    name = "Group Offline";
                                    break;
                                }

                                case "Hybrid": {
                                    imgName = "group.svg";
                                    name = "";
                                    break;
                                }
                            }
                            break;
                        }

                        case "Classic Class": {
                            imgName = "customclassic.svg";
                            name = "classic";
                            break;
                        }
                        case "Custom Fitness": {
                            imgName = "CustomType.svg";
                            name = "";
                            break;
                        }
                    }

                    return <div className='d-flex justify-content-center align-items-center'>
                        <div>
                            <img src={`./assets/${imgName}`} alt={imgName} />
                            <p className='mb-0'>{name}</p>
                        </div>
                    </div>
                }
            },
            { accessor: 'packageName', Header: 'Package' },
            {
                accessor: 'duration', Header: 'Duration', Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.duration}</p>
                }
            },
            { accessor: 'effective', Header: 'Start Date' },
            { accessor: 'expiry', Header: 'Expiry' },
            {
                accessor: 'mrp', Header: 'Mrp', Cell: ({ row }: any) => {
                    return <p className="mb-0">Rs {row.values.mrp}</p>
                }
            },
            {
                accessor: "status", Header: "Status", Cell: ({ row }: any) => {
                    let statusColor = "";
                    let name = "";
                    switch (row.values.status) {
                        case "accepted":
                            name = "Paid";
                            statusColor = "success";
                            break;

                        case "rejected":
                            name = "Cancelled";
                            statusColor = "danger";
                            break;

                        case "pending":
                            name = "Processing";
                            statusColor = "warning";
                            break;
                    }
                    return <>
                        <Badge className='py-3 px-5' style={{ fontSize: '1rem', borderRadius: '10px' }} variant={statusColor}>{name}</Badge>
                    </>
                }
            },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        InvoiceActionRef.current.TriggerForm({ id: row.original.id, actionType: 'view', rowData: row.original })
                    };

                    const arrayAction = [
                        { actionName: 'View', actionClick: actionClick1 },
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
                    <Table columns={columns} data={dataTable} />
                    <InvoicesAction ref={InvoiceActionRef} />
                </Col>
            </Row>
        </div>
    )
}

