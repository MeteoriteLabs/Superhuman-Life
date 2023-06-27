import React from 'react';
import { Badge, Row, Col } from 'react-bootstrap';
import { useMemo } from 'react';
import Table from '../../../components/table/index';
export default function Platform() {
    const dataTable = [
        {
            id: '98756',
            package: 'PT Package',
            purchaseDate: '25/06/20',
            mrp: 10,
            totalFee: 1000,
            earning: 1000,
            status: 'Transfered'
        },

        {
            id: '98756',
            package: 'Group Package',
            purchaseDate: '25/06/20',
            mrp: 10,
            totalFee: 1000,
            earning: 1000,
            status: 'Cancelled'
        },

        {
            id: '98756',
            package: 'Classic Package',
            purchaseDate: '25/06/20',
            mrp: 10,
            totalFee: 1000,
            earning: 1000,
            status: 'Pending'
        }
    ];

    const columns = useMemo(
        () => [
            { accessor: 'id', Header: 'T-ID' },
            { accessor: 'package', Header: 'Package' },

            { accessor: 'purchaseDate', Header: 'Purchase Date' },
            {
                accessor: 'mrp',
                Header: 'Mrp',
                Cell: ({ row }: any) => {
                    return <p className="mb-0">Rs {row.values.mrp}</p>;
                }
            },
            {
                accessor: 'totalFee',
                Header: 'Total Fee',
                Cell: ({ row }: any) => {
                    return <p className="mb-0">Rs {row.values.totalFee}</p>;
                }
            },
            {
                accessor: 'earning',
                Header: 'Earning',
                Cell: ({ row }: any) => {
                    return <p className="mb-0">Rs {row.values.earning}</p>;
                }
            },
            {
                accessor: 'status',
                Header: 'Status',
                Cell: ({ row }: any) => {
                    let statusColor = '';
                    switch (row.values.status) {
                        case 'Transfered':
                            statusColor = 'success';
                            break;

                        case 'Cancelled':
                            statusColor = 'danger';
                            break;

                        case 'Pending':
                            statusColor = 'warning';
                            break;
                    }
                    return (
                        <>
                            <Badge
                                className="py-3 px-5"
                                style={{ fontSize: '1rem', borderRadius: '10px' }}
                                variant={statusColor}
                            >
                                {row.values.status}
                            </Badge>
                        </>
                    );
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
    );
}
