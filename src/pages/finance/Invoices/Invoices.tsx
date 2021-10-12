import React from 'react'
import { Badge, Row, Col, Button } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from "../../../components/table/index"
import ActionButton from '../../../components/actionbutton';
import FinanceActions from "../FinanceActions"

export default function Invoices() {


    const financeActionsRef = useRef<any>(null)

    const dataTable = [
        {
            client: "Michael Hubbard",
            type: "ptOnline",
            package: "PT Package",
            duration: "1 Month",
            effective: '25/06/20',
            expiry:"25/07/20",
            mrp:10,
            status: 'Paid',
        },

        {
            client: "Jhone Doe",
            type: "groupOffline",
            package: "Group Offline",
            duration: "1 Month",
            effective: '25/06/20',
            expiry:"25/07/20",
            mrp:50,
            status: 'Cancelled',
        },

        {
            client: "Walter White",
            type: "classic",
            package: "Group Offline",
            duration: "1 Month",
            effective: '25/06/20',
            expiry:"25/07/20",
            mrp:50,
            status: 'Processing',
        },

        
        {
            client: "Walter White",
            type: "custom",
            package: "Custom Package",
            duration: "6 Month",
            effective: '25/06/20',
            expiry:"25/07/20",
            mrp:50,
            status: 'Processing',
        },

    ]

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
                    return <div className='d-flex justify-content-center align-items-center'>
                        {row.values.type === "ptOnline" ?
                            <div>
                                <img src='./assets/custompersonal-training-Online.svg' alt="PT-Online" />
                                <p className="mb-0">PT</p>
                            </div>
                            : ""}
                        {row.values.type === "ptOffline" ?
                            <div>
                                <img src='./assets/custompersonal-training-Offline.svg' alt="PT-Offline" />
                                <p className="mb-0">PT</p>
                            </div> : ""}
                        {row.values.type === "groupOnline" ?
                            <div>
                                <img src='./assets/customgroup-Online.svg' alt="Group-Online" />
                                <p className="mb-0">Group</p>
                            </div> : ""}
                        {row.values.type === "groupOffline" ?
                            <div>
                                <img src='./assets/customgroup-Offline.svg' alt="Group-Offline" />
                                <p className="mb-0">Group</p>
                            </div> : ""}
                        {row.values.type === "classic" ?
                            <div>
                                <img src='./assets/customclassic.svg' alt="Classic" />
                                <p className="mb-0">Classic</p>
                            </div> : ""}

                            {row.values.type === "custom" ?
                            <div>
                                <img src='./assets/CustomType.svg' alt="custom" />
                                {/* <p className="mb-0">Custom</p> */}
                            </div> : ""}
                    </div>
                }
            },
            { accessor: 'package', Header: 'Package' },
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
                    console.log({ row })
                    let statusColor = ""
                    switch (row.values.status) {
                        case "Paid":
                            statusColor = "success";
                            break;

                        case "Cancelled":
                            statusColor = "danger";
                            break;

                        case "Processing":
                            statusColor = "warning";
                            break;
                    }
                    return <>
                        <Badge className='py-3 px-5' style={{ fontSize: '1rem', borderRadius: '10px' }} variant={statusColor}>{row.values.status}</Badge>
                    </>
                }
            },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData: "" })
                    };
                    const actionClick2 = () => {
                        // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData: "" })
                    };
                    const actionClick3 = () => {
                        // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData: "" })
                    };
                    const arrayAction = [
                        { actionName: 'View', actionClick: actionClick1 },
                        { actionName: 'Edit', actionClick: actionClick2 },
                        { actionName: 'Delete', actionClick: actionClick3 },
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
                    <FinanceActions ref={financeActionsRef} />
                </Col>
            </Row>
        </div>
    )
}

