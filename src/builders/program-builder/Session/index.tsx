import { useMemo, useContext, useState, useRef, useEffect } from 'react';
import {
    Button,
    Card,
    TabContent,
    Modal,
    FormControl,
    Col,
    InputGroup,
    Row,
    Container
} from 'react-bootstrap';
import Table from 'components/table';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INDUSTRY_SESSIONS, CREATE_INDUSTRY_SESSION } from './queries';
import AuthContext from 'context/auth-context';
import ActionButton from 'components/actionbutton';
import CreateEditWorkout from './createoredit-workout';
import { flattenObj } from 'components/utils/responseFlatten';
import moment from 'moment';

export default function EventsTab(industry): JSX.Element {
    const auth = useContext(AuthContext);
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [frm, setFrm] = useState<any>();
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditWorkoutComponent = useRef<any>(null);
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<HTMLInputElement>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const [createWorkout] = useMutation(CREATE_INDUSTRY_SESSION, {
        onCompleted: () => {
            refetchQueryCallback();
        }
    });
console.log("p");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = useMemo<any>(
        () => [
            { accessor: 'workoutName', Header: 'Session Name' },
            { accessor: 'equipment', Header: 'Things you need' },
            { accessor: 'about', Header: 'About' },
            { accessor: 'agenda', Header: 'Agenda' },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const handleEdit = () => {
                        createEditWorkoutComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'edit'
                        });
                    };
                    const handleView = () => {
                        createEditWorkoutComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'view'
                        });
                    };
                    const handleDuplicate = () => {
                        setName(row.original.workoutName + ' copy');
                        setFrm(row.original);
                        handleShow();
                    };
                    const handleDelete = () => {
                        createEditWorkoutComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'delete'
                        });
                    };

                    const arrayAction = [
                        { actionName: 'Edit', actionClick: handleEdit },
                        { actionName: 'View', actionClick: handleView },
                        { actionName: 'Duplicate', actionClick: handleDuplicate },
                        { actionName: 'Delete', actionClick: handleDelete }
                    ];

                    return <ActionButton arrayAction={arrayAction}></ActionButton>;
                }
            }
        ],
        []
    );

    const fetch = useQuery(GET_INDUSTRY_SESSIONS, {
        variables: {
            id: auth.userid,
            filter: searchFilter,
            start: page * 10 - 10,
            limit: 10,
            industryId: industry.industry.industry.id
        },
        onCompleted: (data) => {
            setTotalRecords(data.industrySessions.meta.pagination.total);
            loadData(data);
            console.log(data);
        }
    });

    function refetchQueryCallback() {
        fetch.refetch();
    }

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });
        console.log(flattenData);
        setTableData(
            [...flattenData.industrySessions].map((detail) => {
                return {
                    id: detail.id,
                    workoutName: detail.title,

                    equipment: detail.equipment_lists
                        .map((equipment: any) => {
                            return equipment.name;
                        })
                        .join(', '),
                    agenda: detail.agenda,
                    about: detail.about,

                    users_permissions_user: detail.users_permissions_user.id
                };
            })
        );
    }

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };

    useEffect(() => {
        if (tableData.length === 0 && page > 1) {
            setPage(page - 1);
        }
    }, [tableData]);

    return (
        <TabContent>
            <hr />
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        searchInput.current &&
                                            setSearchFilter(searchInput.current.value);
                                    }}
                                >
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Card.Title className="text-right">
                            <Button
                                variant="dark"
                                size="sm"
                                onClick={() => {
                                    createEditWorkoutComponent.current.TriggerForm({
                                        id: null,
                                        type: 'create',
                                        industry: industry
                                    });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i> Create Session
                            </Button>
                            <CreateEditWorkout
                                ref={createEditWorkoutComponent}
                                callback={refetchQueryCallback}
                            ></CreateEditWorkout>
                            {
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Change name</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <FormControl
                                            value={name}
                                            onChange={(e: any) => setName(e.target.value)}
                                        />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button
                                            variant="success"
                                            onClick={() => {
                                                handleClose();
                                                // CreateWorkout({ id: auth.userid, frm: frm });
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            }
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={tableData} />
            {tableData && tableData.length ? (
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
                        disabled={totalRecords > page * 10 - 10 + tableData.length ? false : true}
                    >
                        Next
                    </Button>
                    <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                        page * 10 - 10 + tableData.length
                    }`}</span>
                </Row>
            ) : null}
        </TabContent>
    );
}
