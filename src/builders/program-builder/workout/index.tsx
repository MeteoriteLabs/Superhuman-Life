import { useMemo, useContext, useState, useRef ,useEffect} from 'react';
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
import { GET_TABLEDATA, CREATE_WORKOUT } from './queries';
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

    const [createWorkout] = useMutation(CREATE_WORKOUT, {
        onCompleted: () => {
            refetchQueryCallback();
        }
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function CreateWorkout(
        _variables: Record<string, unknown> = { id: auth.userid, details: frm }
    ) {
        frm.rawDiscipline = frm.rawDiscipline
            .map((item: any) => item.id)
            .join(', ')
            .split(', ');
        frm.rawEquipment = frm.rawEquipment
            .map((item: any) => item.id)
            .join(', ')
            .split(', ');
        frm.rawMuscleGroup = frm.rawMuscleGroup
            .map((item: any) => item.id)
            .join(', ')
            .split(', ');

        createWorkout({
            variables: {
                workouttitle: name,
                intensity: frm.intensity,
                level: frm.level,
                fitnessdisciplines: frm.rawDiscipline,
                About: frm.about,
                Benifits: frm.benifits,
                warmup: frm.warmup,
                mainmovement: frm.mainmovement,
                cooldown: frm.cooldown,
                workout_text: frm.workout_text,
                workout_URL: frm.workout_url,
                Workout_Video_ID: frm.workout_video_id,
                calories: frm.calories,
                equipment_lists: frm.rawEquipment,
                muscle_groups: frm.rawMuscleGroup,
                users_permissions_user: frm.users_permissions_user
            }
        });
    }

    const columns = useMemo<any>(
        () => [
            { accessor: 'workoutName', Header: 'Workout Name' },
            { accessor: 'discipline', Header: 'Discipline' },
            { accessor: 'level', Header: 'Level' },
            { accessor: 'intensity', Header: 'Intensity' },
            { accessor: 'calories', Header: 'Calories' },
            { accessor: 'muscleGroup', Header: 'Muscle group' },
            { accessor: 'equipment', Header: 'Equipment' },
            { accessor: 'updatedOn', Header: 'Updated On' },
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
console.log(industry);
    const fetch = useQuery(GET_TABLEDATA, {
        variables: { id: auth.userid, filter: searchFilter, start: page * 10 - 10, limit: 10,industryId: industry.industry.industry.id},
        onCompleted: (data) => {
            setTotalRecords(data.workouts.meta.pagination.total);
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
            [...flattenData.workouts].map((detail) => {
                return {
                    id: detail.id,
                    workoutName: detail.workouttitle,
                    rawDiscipline: detail.fitnessdisciplines,
                    discipline: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.disciplinename;
                        })
                        .join(', '),
                    level: detail.level,
                    intensity: detail.intensity,
                    calories: detail.calories,
                    rawMuscleGroup: detail.muscle_groups,
                    muscleGroup: detail.muscle_groups
                        .map((muscle: any) => {
                            return muscle.name;
                        })
                        .join(', '),
                    rawEquipment: detail.equipment_lists,
                    equipment: detail.equipment_lists
                        .map((equipment: any) => {
                            return equipment.name;
                        })
                        .join(', '),
                    updatedOn: moment(getDate(Date.parse(detail.updatedAt))).format('Do MMM YYYY'),
                    about: detail.About,
                    benifits: detail.Benifits,
                    users_permissions_user: detail.users_permissions_user.id,
                    workout_url: detail.workout_URL,
                    workout_text: detail.workout_text,
                    warmup: detail.warmup,
                    mainmovement: detail.mainmovement,
                    cooldown: detail.cooldown,
                    workout_video_id: detail.Workout_Video_ID
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
                                        type: 'create'
                                    });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i> Create Workout
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
                                                CreateWorkout({ id: auth.userid, frm: frm });
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
