import { useQuery } from '@apollo/client'
import React, { useMemo, useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import Table from '../table/index'
import { GET_ALL_CLIENT_PACKAGE_BY_ID } from '../../builders/session-builder/graphQL/queries'
import ActionButton from '../actionbutton'
import moment from 'moment'

export default function ClientModal(props) {
    const { id, render, setRender } = props
    const [dataTable, setDataTable] = useState<any[]>([])


    const FetchData = () => useQuery(GET_ALL_CLIENT_PACKAGE_BY_ID, {
        variables: {
            id: id,
        },
        onCompleted: (data) => loadData(data)
    })

    const loadData = (data) => {
        setDataTable(
            [...data.userPackages].map((packageItem) => {
                const startDate = moment(packageItem.effective_date).format('MMMM DD,YYYY');
                const endDate = moment(startDate).add(packageItem.fitnesspackages[0].duration, "days").format("MMMM DD,YYYY");
                return {
                    client: packageItem.users_permissions_user.username,
                    startDate: startDate,
                    endDate: endDate,
                    programStatus: packageItem.program_managers.length > 0 ? "Assigned" : "Not Assigned",
                }
            })
        )
    }

    FetchData()

    const columns = useMemo(
        () => [
            {
                accessor: "client",
                Header: "Client",
                Cell: (row) => {
                    return <div >
                        {typeof row.value === "string" ?
                            <img
                                src="https://picsum.photos/200/100" alt='profile-pic'
                                style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                            :
                            <div className='position-relative' style={{ width: '8rem', height: '5rem' }}>
                                {row.value.slice(0, 4).map((item, index) => {
                                    let postionLeft = 20;
                                    return <img
                                        key={index}
                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                        className='position-absolute'
                                    />
                                })}
                            </div>
                        }
                        {typeof row.value === 'string' ? <p className='text-center'>{row.value}</p> : <p className='text-center'>{row.value.length} people</p>}
                    </div>
                }
            },

            { accessor: 'startDate', Header: 'Start Date' },
            { accessor: 'endDate', Header: 'End Date' },

            {
                accessor: "programStatus",
                Header: "Program Status",
                Cell: (row: any) => {
                    return <>
                        {row.value === "Assigned" ?
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
                        action1='Manage'
                        // actionClick1={() => {
                        //     fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData:""})
                        // }}

                        action2='Details'
                        actionClick2={() => {
                            // fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                        }}
                    >
                    </ActionButton>
                }
            }

        ],
        []
    );





    return (
        <>
            <Modal show={render} size="xl" onHide={() => setRender(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Clients</Modal.Title>
                </Modal.Header>

                <Table columns={columns} data={dataTable} />

                <Modal.Footer>
                    <Button variant="danger" onClick={() => setRender(false)}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}
