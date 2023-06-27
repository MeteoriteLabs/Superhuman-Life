import React from 'react'
import ActionButton, { ArrayAction } from '../../../../components/actionbutton'
import { Badge, Row, Col } from 'react-bootstrap'
import { useContext, useMemo, useRef, useState } from 'react'
import Table from '../../../../components/table/index'

export default function Nutrition() {
    const dataTable = [
        {
            type: 'ptOnline',
            duration: 1,
            mrp: 20,
            updated: '8:00 AM | 05/07/20'
        },
        {
            type: 'ptOffline',
            duration: 1,
            mrp: 20,
            updated: '8:00 AM | 05/07/20'
        },
        {
            type: 'groupOnline',
            duration: 1,
            mrp: 20,
            updated: '8:00 AM | 05/07/20'
        },
        {
            type: 'groupOffline',
            duration: 1,
            mrp: 20,
            updated: '8:00 AM | 05/07/20'
        },
        {
            type: 'classic',
            duration: 1,
            mrp: 100,
            updated: '8:00 AM | 05/07/20'
        }
    ]

    const columns = useMemo(
        () => [
            {
                accessor: 'type',
                Header: 'Type',
                Cell: ({ row }: any) => {
                    return (
                        <div className="d-flex justify-content-center align-items-center">
                            {row.values.type === 'ptOnline' ? (
                                <div>
                                    <img
                                        src="./assets/custompersonal-training-Online.svg"
                                        alt="PT-Online"
                                    />
                                    <p className="mb-0">PT</p>
                                </div>
                            ) : (
                                ''
                            )}
                            {row.values.type === 'ptOffline' ? (
                                <div>
                                    <img
                                        src="./assets/custompersonal-training-Offline.svg"
                                        alt="PT-Offline"
                                    />
                                    <p className="mb-0">PT</p>
                                </div>
                            ) : (
                                ''
                            )}
                            {row.values.type === 'groupOnline' ? (
                                <div>
                                    <img src="./assets/customgroup-Online.svg" alt="Group-Online" />
                                    <p className="mb-0">Group</p>
                                </div>
                            ) : (
                                ''
                            )}
                            {row.values.type === 'groupOffline' ? (
                                <div>
                                    <img
                                        src="./assets/customgroup-Offline.svg"
                                        alt="GRoup-Offline"
                                    />
                                    <p className="mb-0">Group</p>
                                </div>
                            ) : (
                                ''
                            )}
                            {row.values.type === 'classic' ? (
                                <div>
                                    <img src="./assets/customclassic.svg" alt="Classic" />
                                    <p className="mb-0">Classic</p>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    )
                }
            },
            {
                accessor: 'duration',
                Header: 'Duration',
                Cell: ({ row }: any) => {
                    return <p className="mb-0">{row.values.duration} class</p>
                }
            },
            {
                accessor: 'mrp',
                Header: 'Mrp',
                Cell: ({ row }: any) => {
                    return <p className="mb-0">Rs {row.values.mrp}</p>
                }
            },
            { accessor: 'updated', Header: 'Updated' },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "One-On-One", rowData: "" })
                    }
                    const arrayAction: ArrayAction[] = [
                        { actionName: 'Edit', actionClick: actionClick1 }
                    ]

                    return <ActionButton arrayAction={arrayAction}></ActionButton>
                }
            }
        ],
        []
    )

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                    {/* <FitnessAction ref={fitnessActionRef} /> */}
                </Col>
            </Row>
        </div>
    )
}
