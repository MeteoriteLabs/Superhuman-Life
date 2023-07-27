import React, { useMemo, useRef, useState, useContext  , useEffect} from 'react';
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
} from 'react-bootstrap';
import Table from '../../../components/table';
import { useQuery } from '@apollo/client';
import AuthContext from '../../../context/auth-context';
import CreateEditMessage from './createoredit-message';
import ActionButton from '../../../components/actionbutton/index';
import { GET_MESSAGES } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';

const MindsetPage: React.FC = () => {
    const [searchFilter, setSearchFilter] = useState<string>('');
    const searchInput = useRef<any>();
    const auth = useContext(AuthContext);
    const createEditMessageComponent = useRef<any>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const columns = useMemo<any>(
        () => [
            { accessor: 'title', Header: 'Title' },
            {
                accessor: 'type',
                Header: 'Type'
            },
            { accessor: 'tags', Header: 'Tags' },
            { accessor: 'minidesc', Header: 'Mini Description' },
            {
                accessor: 'status',
                Header: 'Status',
                Cell: (v: any) => (
                    <Badge
                        className="px-3 py-1"
                        style={{ fontSize: '1rem', borderRadius: '10px' }}
                        variant={v.value === 'Active' ? 'success' : 'danger'}
                    >
                        {v.value}
                    </Badge>
                )
            },
            { accessor: 'updatedon', Header: 'Updated On' },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const editHandler = () => {
                        createEditMessageComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'edit'
                        });
                    };
                    const viewHandler = () => {
                        createEditMessageComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'view'
                        });
                    };
                    const statusChangeHandler = () => {
                        createEditMessageComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'toggle-status',
                            current_status: row.original.status === 'Active'
                        });
                    };
                    const deleteHandler = () => {
                        createEditMessageComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'delete'
                        });
                    };

                    const arrayAction = [
                        { actionName: 'Edit', actionClick: editHandler },
                        { actionName: 'View', actionClick: viewHandler },
                        { actionName: 'Status', actionClick: statusChangeHandler },
                        { actionName: 'Delete', actionClick: deleteHandler }
                    ];

                    return <ActionButton arrayAction={arrayAction}></ActionButton>;
                }
            }
        ],
        []
    );

    function getDate(time: number) {
        const dateObj = new Date(time);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const date = dateObj.getDate();

        return `${date}/${month}/${year}`;
    }

    const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

    const fetch = useQuery(GET_MESSAGES, {
        variables: { filter: searchFilter, id: auth.userid, start: page * 10 - 10, limit: 10 },
        onCompleted: (data) => {
            setTotalRecords(data.prerecordedMessages.meta.pagination.total);
            loadData(data);
        }
    });

    function loadData(data) {
        const flattenData = flattenObj({ ...data });

        setDataTable(
            [...flattenData.prerecordedMessages].map((Detail) => {
                return {
                    id: Detail.id,
                    title: Detail.Title,
                    tags: Detail.tags,
                    type: Detail.resourcetype.name,
                    minidesc: Detail.minidescription,
                    status: Detail.Status ? 'Active' : 'Inactive',
                    updatedon: getDate(Date.parse(Detail.updatedAt))
                };
            })
        );
    }

    function refetchQueryCallback() {
        fetch.refetch();
    }

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };

    useEffect(() => {
        if (datatable.length === 0 && page > 1) {
            setPage(page - 1);
        }
    }, [datatable]);
    return (
        <>
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
                                            e.preventDefault();
                                            setSearchFilter(searchInput.current.value);
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
                                    variant="dark"
                                    size="sm"
                                    onClick={() => {
                                        createEditMessageComponent.current.TriggerForm({
                                            id: null,
                                            type: 'create',
                                            modal_status: true
                                        });
                                    }}
                                >
                                    <i className="fas fa-plus-circle"></i> Create New
                                </Button>
                                <CreateEditMessage
                                    ref={createEditMessageComponent}
                                    callback={refetchQueryCallback}
                                ></CreateEditMessage>
                            </Card.Title>
                        </Col>
                    </Row>
                </Container>
                <Table columns={columns} data={datatable} />
            </TabContent>

            {/* Pagination */}
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
        </>
    );
};

export default MindsetPage;
