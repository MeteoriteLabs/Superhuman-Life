import React from 'react'
import { Badge, Row, Col, Button } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from "../../../components/table/index"
import ActionButton from '../../../components/actionbutton';
import { useQuery } from '@apollo/client';
import { GET_ALL_VOUCHERS } from '../graphQL/queries';
import authContext from '../../../context/auth-context';
import moment from 'moment';
import VoucherAction from './VoucherAction';

export default function Vouchers() {

    const auth = useContext(authContext);
    const [dataTable, setDataTable] = useState<any[]>([])
    const voucherActionRef = useRef<any>(null);

    const FetchData = () => useQuery(GET_ALL_VOUCHERS, {
        variables: { id: auth.userid },
        onCompleted: data => loadData(data)
    })

    const loadData = (data) => {
        setDataTable(
            [...data.vouchers.data].map(voucher => {
                let todayDate: any = moment(new Date());
                let expiryDate: any = moment(voucher.attributes.expiry_date);
                let diff = expiryDate.diff(todayDate, 'day')
                return {
                    id: voucher.id,
                    voucher_name: voucher.attributes.voucher_name,
                    discount_percentage: voucher.attributes.discount_percentage,
                    expiry_date: moment(voucher.attributes.expiry_date).format('MMMM DD,YYYY'),
                    Usage_restriction: voucher.attributes.Usage_restriction,
                    Status:( diff <= 0 || voucher.attributes.Usage_restriction <= 0 )? "Expired" : voucher.attributes.Status
                }
            })
        )
    }

    FetchData();

    const columns = useMemo(
        () => [
            { accessor: 'voucher_name', Header: 'Code' },
            {
                accessor: 'discount_percentage', Header: 'Discount', Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.discount_percentage} %</p>
                }
            },
            {
                accessor: 'expiry_date', Header: 'Expiry', Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.expiry_date}</p>
                }
            },
            { accessor: 'Usage_restriction', Header: 'Usage' },
            {
                accessor: "Status", Header: "Status", Cell: ({ row }: any) => {
                    let statusColor = ""
                    switch (row.values.Status) {
                        case "Active":
                            statusColor = "success";
                            break;

                        case "Expired":
                            statusColor = "danger";
                            break;

                        case "Disabled":
                            statusColor = "warning";
                            break;
                    }
                    return <>
                        <Badge className='py-3 px-5' style={{ fontSize: '1rem', borderRadius: '10px' }} variant={statusColor}>{row.values.Status}</Badge>
                    </>
                }
            },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        voucherActionRef.current.TriggerForm({ id: row.original.id, actionType: 'view' })
                    };
                    const actionClick2 = () => {
                        voucherActionRef.current.TriggerForm({ id: row.original.id, actionType: 'edit' })
                    };
                    const actionClick3 = () => {
                        voucherActionRef.current.TriggerForm({ id: row.original.id, actionType: 'delete' })
                    };
                    const actionClick4 = () => {
                        voucherActionRef.current.TriggerForm({ id: row.original.id, actionType: 'toggle-status', current_status: row.original.Status })
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
                    voucherActionRef.current.TriggerForm({ actionType: 'create' })
                }}>Create Voucher</Button>
            </div>
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                    <VoucherAction ref={voucherActionRef} />
                </Col>
            </Row>
        </div>
    )
}

