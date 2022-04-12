import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import Table from '../table/index'
import { GET_ALL_CLASSIC_CLIENT_BY_ID, GET_ALL_GROUP_CLIENT_BY_ID, GET_CLIENTS_BY_TAG } from '../../builders/session-builder/graphQL/queries'
import ActionButton from '../actionbutton'
import moment from 'moment'
import FitnessAction from '../../builders/session-builder/Fitness/FitnessAction'
import { flattenObj } from '../../components/utils/responseFlatten'


export default function ClientModal(props) {
    const { id, modalTrigger, type } = props

    const [dataTable, setDataTable] = useState<any[]>([]);
    const [queryName, setQueryName] = useState<any>("")
    const fitnessActionRef = useRef<any>(null)


    const [show, setShow] = useState<boolean>(false);


    modalTrigger.subscribe((res: boolean) => {
        setShow(res);
    });



    useEffect(() => {
        if (type === 'Classic') {
            setQueryName("GET_ALL_CLASSIC_CLIENT_BY_ID")
        } else {
            setQueryName("GET_ALL_GROUP_CLIENT_BY_ID")
        }
    }, [type]);



    const FetchData = () => useQuery(GET_CLIENTS_BY_TAG, {
        variables: {
            id: id,
        },
        onCompleted: (data) => loadData(data)
    })



    const loadData = (data) => {
        const flattenData = flattenObj({ ...data });
        setDataTable(
            [...flattenData.tags[0].client_packages].map((packageItem) => {
                const startDate = moment(packageItem.effective_date);
                const endDate = moment(startDate).add(flattenData.tags[0].fitnesspackage.duration, "days").format("MMMM DD,YYYY");
                return {
                    programName:flattenData.tags[0].fitnesspackage.packagename,
                    client: packageItem.users_permissions_user.username,
                    duration: flattenData.tags[0].fitnesspackage.duration,
                    level:flattenData.tags[0].fitnesspackage.level,
                    // description: packageItem.program_managers.length > 0 ? packageItem.program_managers[0].fitnessprograms[0].description : "",
                    startDate: startDate.format("MMMM DD,YYYY"),
                    endDate: endDate,
                    programStatus: flattenData.tags[0].sessions.length > 0 ? "Assigned" : "Not Assigned",
                }
            })
        )
    }

    FetchData()
    // console.log(dataTable)

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
                    const actionClick1 = () => {
                        fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', rowData: "" })
                    };

                    const arrayAction = [
                        { actionName: 'Manage', actionClick: actionClick1 },
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
        <>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered  >
                <Modal.Header closeButton>
                    <Modal.Title>Clients</Modal.Title>
                </Modal.Header>

                <Table columns={columns} data={dataTable} />
                <FitnessAction ref={fitnessActionRef} />
                <Modal.Footer>
                    <Button variant="danger" onClick={() => modalTrigger.next(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
