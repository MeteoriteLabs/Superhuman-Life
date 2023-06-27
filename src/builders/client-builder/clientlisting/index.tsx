import { useMemo, useContext, useRef, useState } from 'react'
import ActionButton from '../../../components/actionbutton/index'
import {
    Badge,
    Button,
    TabContent,
    InputGroup,
    FormControl,
    Card,
    Container,
    Row,
    Col
} from 'react-bootstrap'
import AuthContext from '../../../context/auth-context'
import { useQuery } from '@apollo/client'
import { GET_CLIENT_NEW } from './queries'
import CreateClient from './addclientcomponent'
import Table from '../../../components/table'
import { flattenObj } from '../../../components/utils/responseFlatten'

function ClientListingPage() {
    const auth = useContext(AuthContext)
    const [searchFilter, setSearchFilter] = useState('')
    const searchInput = useRef<any>()
    const CreateClientComponent = useRef<any>(null)
    const [page, setPage] = useState<number>(1)
    const [totalRecords, setTotalRecords] = useState<number>(0)

    function handleRedirect(id: any) {
        window.location.href = `/client/home/${id}`
    }

    const columns = useMemo<any>(
        () => [
            { accessor: 'clientname', Header: 'Name' },
            { accessor: 'clientemail', Header: 'Email' },
            { accessor: 'clientphone', Header: 'Phone' },
            { accessor: 'clientlocation', Header: 'Location' },
            {
                Header: 'No of Bookings',
                accessor: 'bookings',
                Cell: (row: any) => {
                    return (
                        <>
                            <p className="ml-5 pl-4">{row.value[0][row.value[1]]}</p>
                        </>
                    )
                }
            },
            {
                accessor: 'status',
                Header: 'Status',
                Cell: (v: any) => (
                    <Badge
                        className="px-3 py-1"
                        style={{ fontSize: '1rem', borderRadius: '10px' }}
                        variant={v.value === 'Assigned' ? 'success' : 'danger'}
                    >
                        {v.value}
                    </Badge>
                )
            },

            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        handleRedirect(row.original.id)
                    }
                    const actionClick2 = () => {
                        //CreateClientComponent.current.TriggerForm({id: row.original.id, type: 'view'})
                    }
                    const actionClick3 = () => {
                        window.location.href = '/chats'
                    }
                    const actionClick4 = () => {
                        window.location.href = '/packages'
                    }
                    const actionClick5 = () => {
                        CreateClientComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'delete'
                        })
                    }

                    const arrayAction = [
                        { actionName: 'Go to client', actionClick: actionClick1 },
                        { actionName: 'Build Program', actionClick: actionClick2 },
                        { actionName: 'Chat', actionClick: actionClick3 },
                        { actionName: 'Build Package', actionClick: actionClick4 },
                        { actionName: 'Remove Client', actionClick: actionClick5 }
                    ]

                    return <ActionButton arrayAction={arrayAction}></ActionButton>
                }
            }
        ],
        []
    )

    const [datatable, setDataTable] = useState<Record<string, unknown>[]>([])
    const fetch = useQuery(GET_CLIENT_NEW, {
        variables: { filter: searchFilter, id: auth.userid, start: page * 10 - 10, limit: 10 },
        onCompleted: (data) => {
            setTotalRecords(data.clientPackages.meta.pagination.total)
            loadData(data)
        }
    })

    function refetchQueryCallback() {
        fetch.refetch()
    }

    function loadData(data: any) {
        const clientnamecount = {}
        let flag: any
        const namearr: any = []

        const flattenData = flattenObj({ ...data })

        setDataTable(
            [...flattenData.clientPackages].flatMap((Detail) => {
                const clientname: any = Detail.users_permissions_user.username
                const clientemail: any = Detail.users_permissions_user.email

                if (!clientnamecount[clientname]) {
                    clientnamecount[clientname] = 1
                } else {
                    clientnamecount[clientname] += 1
                }
                if (!namearr.includes(clientemail)) {
                    flag = true
                    namearr.push(clientemail)
                }
                if (flag) {
                    flag = false
                    return {
                        id: Detail.users_permissions_user.id,
                        clientname: Detail.users_permissions_user.username,
                        clientemail: Detail.users_permissions_user.email,
                        clientphone: Detail.users_permissions_user.Phone_Number,
                        clientlocation:
                            Detail.users_permissions_user?.addresses &&
                            Detail.users_permissions_user?.addresses.length
                                ? Detail.users_permissions_user?.addresses[0]?.city
                                : 'N/A',
                        bookings: [clientnamecount, Detail.users_permissions_user.username],
                        status: 'Assigned'
                    }
                } else {
                    return []
                }
            })
        )
    }
    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber)
    }

    return (
        <TabContent>
            <Container>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="basic-addon1"
                                placeholder="Search"
                                ref={searchInput}
                            />
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    onClick={(e: any) => {
                                        e.preventDefault()
                                        setSearchFilter(searchInput.current.value)
                                    }}
                                >
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Card.Title className="text-center">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                    window.open('/add_client', '_self')
                                }}
                            >
                                <i className="fas fa-plus-circle"></i> Add Client
                            </Button>
                            <CreateClient
                                ref={CreateClientComponent}
                                callback={refetchQueryCallback}
                            ></CreateClient>
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={datatable} />
            {datatable && datatable.length ? (
                <Row className="justify-content-end">
                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page - 1)}
                        disabled={page === 1 ? true : false}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page + 1)}
                        disabled={totalRecords > page * 10 - 10 + datatable.length ? false : true}
                    >
                        Next
                    </Button>
                    <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                        page * 10 - 10 + datatable.length
                    }`}</span>
                </Row>
            ) : null}
        </TabContent>
    )
}

export default ClientListingPage
