import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import Table from '../table/index'
import { GET_CLIENTS_BY_TAG } from '../../builders/session-builder/graphQL/queries'
import ActionButton from '../actionbutton'
import moment from 'moment'
import FitnessAction from '../../builders/session-builder/Fitness/FitnessAction'
import { flattenObj } from '../../components/utils/responseFlatten'

// eslint-disable-next-line
const ClientModal: React.FC<{
    id: string
    type: string
    show: boolean
    onHide: () => void
    modalTrigger: any
}> = (props) => {
    const { id, type } = props
    // eslint-disable-next-line
    const [dataTable, setDataTable] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [queryName, setQueryName] = useState<string>('')
    const fitnessActionRef = useRef<any>(null)

    useEffect(() => {
        if (type === 'Classic') {
            setQueryName('GET_ALL_CLASSIC_CLIENT_BY_ID')
        } else {
            // setQueryName("GET_ALL_GROUP_CLIENT_BY_ID")
        }
    }, [type])

    const FetchData = () =>
        useQuery(GET_CLIENTS_BY_TAG, {
            variables: {
                id: id
            },
            onCompleted: (data) => loadData(data)
        })

    const loadData = (data) => {
        const flattenData = flattenObj({ ...data })
        setDataTable(
            [...flattenData.tags[0].client_packages].map((packageItem) => {
                const startDate = moment(packageItem.effective_date)
                const endDate = moment(startDate)
                    .add(flattenData.tags[0].fitnesspackage.duration, 'days')
                    .format('MMMM DD,YYYY')
                return {
                    programName: flattenData.tags[0].fitnesspackage.packagename,
                    client: packageItem.users_permissions_user.username,
                    duration: flattenData.tags[0].fitnesspackage.duration,
                    level: flattenData.tags[0].fitnesspackage.level,
                    startDate: startDate.format('MMMM DD,YYYY'),
                    endDate: endDate,
                    programStatus:
                        flattenData.tags[0].sessions.length > 0 ? 'Assigned' : 'Not Assigned'
                }
            })
        )
    }

    FetchData()

    const columns = useMemo(
        () => [
            {
                accessor: 'client',
                Header: 'Client'
            },

            { accessor: 'startDate', Header: 'Start Date' },
            { accessor: 'endDate', Header: 'End Date' },
            {
                accessor: 'programStatus',
                Header: 'Program Status',
                Cell: (row: any) => {
                    return (
                        <>
                            {row.value === 'Assigned' ? (
                                <Badge
                                    className="px-3 py-1"
                                    style={{ fontSize: '1rem', borderRadius: '10px' }}
                                    variant="success"
                                >
                                    {row.value}
                                </Badge>
                            ) : (
                                <Badge
                                    className="px-3 py-1"
                                    style={{ fontSize: '1rem', borderRadius: '10px' }}
                                    variant="danger"
                                >
                                    {row.value}
                                </Badge>
                            )}
                        </>
                    )
                }
            },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const manageHandler = () => {
                        fitnessActionRef.current.TriggerForm({
                            id: row.original.id,
                            actionType: 'manage',
                            rowData: ''
                        })
                    }

                    const arrayAction = [{ actionName: 'Manage', actionClick: manageHandler }]

                    return <ActionButton arrayAction={arrayAction}></ActionButton>
                }
            }
        ],
        []
    )

    return (
        <>
            <Modal size="xl" show={props.show} onHide={props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Clients</Modal.Title>
                </Modal.Header>

                <Table columns={columns} data={dataTable} />
                <FitnessAction ref={fitnessActionRef} callback={FetchData} />
                <Modal.Footer>
                    <Button variant="danger" onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ClientModal
