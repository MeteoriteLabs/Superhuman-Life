import React from 'react'
import { Badge, Row, Col, Button } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from "../../../components/table/index"
import ActionButton from '../../../components/actionbutton';
import FinanceActions from "../FinanceActions"

export default function Vouchers() {


    const financeActionsRef = useRef<any>(null)

    const dataTable = [
        {
            code: "Code123",
            discount: 50,
            expiry: 30,
            usage: "Single use",
            status: 'Active',
        },

        {
            code: "Code123",
            discount: 80,
            expiry: 30,
            usage: "Multi use",
            status: 'Expired',
        },


        {
            code: "Code123",
            discount: 80,
            expiry: 30,
            usage: "Single use",
            status: 'Disables',
        },


    ]

    const columns = useMemo(
        () => [
            { accessor: 'code', Header: 'Code' },
            {
                accessor: 'discount', Header: 'Discount', Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.discount} %</p>
                }
            },
            {
                accessor: 'expiry', Header: 'Expiry', Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.expiry} Days</p>
                }
            },
            { accessor: 'usage', Header: 'Usage' },
            {
                accessor: "status", Header: "Status", Cell: ({ row }: any) => {
                    console.log({ row })
                    let statusColor = ""
                    switch (row.values.status) {
                        case "Active":
                            statusColor = "success";
                            break;

                        case "Expired":
                            statusColor = "danger";
                            break;

                        case "Disables":
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
                    const actionClick4 = () => {
                        // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData: "" })
                    };
                    const arrayAction = [
                        { actionName: 'View', actionClick: actionClick1 },
                        { actionName: 'Edit', actionClick: actionClick2 },
                        { actionName: 'Delete', actionClick: actionClick3 },
                        { actionName: 'Status', actionClick: actionClick4 },
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
            <div className="d-flex justify-content-end mb-5 mr-5">
                <Button onClick={() => {
                     financeActionsRef.current.TriggerForm({actionType: 'createVoucher'})
                }}>Create Voucher</Button>
            </div>
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                    <FinanceActions ref={financeActionsRef} />
                </Col>
            </Row>
        </div>
    )
}

