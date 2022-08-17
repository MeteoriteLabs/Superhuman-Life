import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, TabContent, Modal, FormControl } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TABLEDATA, CREATE_WORKOUT } from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditWorkout from "./createoredit-workout";
import {flattenObj} from '../../../components/utils/responseFlatten';

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [frm, setFrm] = useState<any>();
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditWorkoutComponent = useRef<any>(null);

    const [createWorkout] = useMutation(CREATE_WORKOUT, {onCompleted: () => {refetchQueryCallback()}});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function CreateWorkout(_variables: {} = {id: auth.userid, details: frm}) {
        console.log(frm, name);
        createWorkout({ variables: {
            title: name,
            fitnessdisciplines: frm.disciplineId.split(","),
            duration_days: frm.duration,
            events: frm.events,
            Is_program: false,
            level: frm.level,
            description: frm.description,
            users_permissions_user: frm.user
        } });
    }

    const columns = useMemo<any>(() => [
        { accessor: "workoutName", Header: "Workout Name" },
        { accessor: "discipline", Header: "Discipline" },
        { accessor: "level", Header: "Level" },
        { accessor: "intensity", Header: "Intensity" },
        { accessor: "calories", Header: "Calories" },
        { accessor: "muscleGroup", Header: "Muscle group" },
        { accessor: "equipment", Header: "Equipment" },
        { accessor: "updatedOn", Header: "Updated On" },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
                const actionClick1 = () => {
                    createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'edit'});
                };
                const actionClick2 = () => {
                    createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'view'});
                };
                const actionClick3 = () => {
                    setName(row.original.workoutName + " copy");setFrm(row.original);handleShow();
                };
                const actionClick4 = () => {
                    createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'delete'});
                };

                const arrayAction = [
                    { actionName: 'Edit', actionClick: actionClick1 },
                    { actionName: 'View', actionClick: actionClick2 },
                    { actionName: 'Duplicate', actionClick: actionClick3},
                    { actionName: 'Delete', actionClick: actionClick4 },
                ];

                return <ActionButton arrayAction={arrayAction}></ActionButton>
            },
        }
    ], []);

    // function FetchData(_variables: {} = { id: auth.userid }) {
        const fetch = useQuery(GET_TABLEDATA, { variables: {id: auth.userid}, onCompleted: loadData })
    // }

    function refetchQueryCallback() {
        fetch.refetch();
    }

    function getDate(time: any) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        let dateObj = new Date(time);
        let month = monthNames[dateObj.getMonth()];
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

        return (`${date}-${month}-${year}`);
    }

    function loadData(data: any) {
        const flattenData = flattenObj({...data});
        setTableData(
            [...flattenData.workouts].map((detail) => {
                return {
                    id: detail.id,
                    workoutName: detail.workouttitle,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    level: detail.level,
                    intensity: detail.intensity,
                    calories: detail.calories,
                    muscleGroup: detail.muscle_groups.map((muscle: any) => {
                        return muscle.name;
                    }).join(", "),
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
                    updatedOn: getDate(Date.parse(detail.updatedAt))
                }
            })
        )
    }

    // FetchData();


    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                <Button variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        createEditWorkoutComponent.current.TriggerForm({ id: null, type: 'create' });
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Create Workout
                </Button>
                <CreateEditWorkout ref={createEditWorkoutComponent} callback={refetchQueryCallback}></CreateEditWorkout>
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
                                <Button variant="success" onClick={() => {
                                    handleClose();
                                    CreateWorkout({id: auth.userid, frm: frm});
                                }}>
                                Save Changes
                                </Button>
                            </Modal.Footer>
                    </Modal>
                }
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}