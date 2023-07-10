import { useMemo, useContext, useState, useRef } from 'react';
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
import Table from '../../../components/table';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TABLEDATA, CREATE_PROGRAM, CREATE_SESSION } from './queries';
import AuthContext from '../../../context/auth-context';
import ActionButton from '../../../components/actionbutton';
import CreateEditProgram from './createoredit-program';
import { flattenObj } from '../../../components/utils/responseFlatten';
import moment from 'moment';
import Toaster from '../../../components/Toaster';

export default function EventsTab(): JSX.Element {
    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditProgramComponent = useRef<any>(null);
    function handleRedirect(id: any) {
        window.location.href = `/programs/manage/${id}`;
    }
    const newSessionIds: any[] = [];
    let sessionsCount = 0;
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [frm, setFrm] = useState<any>();
    const [searchFilter, setSearchFilter] = useState('');
    const searchInput = useRef<HTMLInputElement>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const [createProgram] = useMutation(CREATE_PROGRAM, {
        onCompleted: () => {
            refetchQueryCallback();
        }
    });

    const [createSession] = useMutation(CREATE_SESSION, {
        onCompleted: (e: any) => {
            setIsFormSubmitted(!isFormSubmitted);
            newSessionIds.push(e.createSession.data.id);
            if (sessionsCount === newSessionIds.length) {
                createProgram({
                    variables: {
                        title: name,
                        fitnessdisciplines: frm.disciplineId.split(','),
                        duration_days: frm.duration,
                        level: frm.level,
                        sessions: newSessionIds,
                        description: frm.description,
                        users_permissions_user: frm.user
                    }
                });
            }
        }
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function CreateProgram(
        _variables: Record<string, unknown> = { id: auth.userid, details: frm }
    ) {
        sessionsCount = frm.sessions.length;
        for (let i = 0; i < frm.sessions.length; i++) {
            createSession({
                variables: {
                    session_date: frm.sessions[i].session_date,
                    tag: frm.sessions[i].tag,
                    mode: frm.sessions[i].mode,
                    type: frm.sessions[i].type,
                    day_of_program: frm.sessions[i].day_of_program,
                    start_time: frm.sessions[i].start_time,
                    end_time: frm.sessions[i].end_time,
                    Is_restday: frm.sessions[i].Is_restday,
                    Is_program_template: frm.sessions[i].Is_program_template,
                    activity_target: frm.sessions[i].activity_target,
                    activity: frm.sessions[i].activity?.id,
                    workout: frm.sessions[i].workout?.id,
                    changemaker: auth.userid
                }
            });
        }
    }

    const columns = useMemo<any>(
        () => [
            { accessor: 'programName', Header: 'Program Name' },
            { accessor: 'discipline', Header: 'Discipline' },
            { accessor: 'duration', Header: 'Duration' },
            { accessor: 'level', Header: 'Level' },
            { accessor: 'description', Header: 'description' },
            { accessor: 'updatedOn', Header: 'Updated On' },
            {
                id: 'edit',
                Header: 'Actions',
                Cell: ({ row }: any) => {
                    const editHandler = () => {
                        createEditProgramComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'edit'
                        });
                    };
                    const viewHandler = () => {
                        createEditProgramComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'view'
                        });
                    };
                    const deleteHandler = () => {
                        createEditProgramComponent.current.TriggerForm({
                            id: row.original.id,
                            type: 'delete'
                        });
                    };
                    const manageHandler = () => {
                        handleRedirect(row.original.id);
                    };
                    const duplicateHandler = () => {
                        setName(row.original.programName + ' copy');
                        setFrm(row.original);
                        handleShow();
                    };

                    const arrayAction = [
                        { actionName: 'Manage', actionClick: manageHandler },
                        { actionName: 'Edit', actionClick: editHandler },
                        { actionName: 'View', actionClick: viewHandler },
                        { actionName: 'Delete', actionClick: deleteHandler },
                        { actionName: 'Duplicate', actionClick: duplicateHandler }
                    ];

                    return <ActionButton arrayAction={arrayAction}></ActionButton>;
                }
            }
        ],
        []
    );

    const fetch = useQuery(GET_TABLEDATA, {
        variables: { id: auth.userid, filter: searchFilter, start: page * 10 - 10, limit: 10 },
        onCompleted: (data) => {
            setTotalRecords(data.fitnessprograms.meta.pagination.total);
            loadData(data);
        }
    });

    function refetchQueryCallback() {
        fetch.refetch();
    }

    function getDate(time: any) {
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec'
        ];
        const dateObj = new Date(time);
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const date = dateObj.getDate();

        return `${date}-${month}-${year}`;
    }

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });

        setTableData(
            [...flattenData.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.disciplinename;
                        })
                        .join(', '),
                    disciplineId: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.id;
                        })
                        .join(','),
                    level: detail.level,
                    sessionId: detail.sessions
                        .map((val: any) => {
                            return val.id;
                        })
                        .join(','),
                    sessions: detail.sessions,
                    duration: detail.duration_days,
                    description: detail.description,
                    user: detail.users_permissions_user.id,
                    updatedOn: moment(getDate(Date.parse(detail.updatedAt))).format('Do MMM YYYY')
                };
            })
        );
    }

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };

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
                                    createEditProgramComponent.current.TriggerForm({
                                        id: null,
                                        type: 'create'
                                    });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i> Create Program
                            </Button>
                            <CreateEditProgram
                                ref={createEditProgramComponent}
                                callback={refetchQueryCallback}
                            ></CreateEditProgram>
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
                                                CreateProgram({ id: auth.userid, frm: frm });
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

            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(false)}
                    type={'success'}
                    msg={'Duplicate has been created successfully'}
                />
            ) : null}
        </TabContent>
    );
}
