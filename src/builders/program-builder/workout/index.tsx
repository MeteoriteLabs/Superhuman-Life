import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, TabContent, Modal, FormControl } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TABLEDATA, CREATE_WORKOUT } from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditWorkout from "./createoredit-workout";
import {flattenObj} from '../../../components/utils/responseFlatten';
import moment from 'moment';

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
        frm.rawDiscipline = frm.rawDiscipline.map((item: any) => item.id).join(", ").split(", ");
        frm.rawEquipment = frm.rawEquipment.map((item: any) => item.id).join(", ").split(", ");
        frm.rawMuscleGroup = frm.rawMuscleGroup.map((item: any) => item.id).join(", ").split(", ");
        console.log(frm);
        createWorkout({ variables: {
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
        }});
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
                    rawDiscipline: detail.fitnessdisciplines,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    level: detail.level,
                    intensity: detail.intensity,
                    calories: detail.calories,
                    rawMuscleGroup: detail.muscle_groups,
                    muscleGroup: detail.muscle_groups.map((muscle: any) => {
                        return muscle.name;
                    }).join(", "),
                    rawEquipment: detail.equipment_lists,
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
                    updatedOn: moment(getDate(Date.parse(detail.updatedAt))).format("Do MMM YYYY"),
                    about: detail.About,
                    benifits: detail.Benifits,
                    users_permissions_user: detail.users_permissions_user.id,
                    workout_url: detail.workout_URL,
                    workout_text: detail.workout_text,
                    warmup: detail.warmup,
                    mainmovement: detail.mainmovement,
                    cooldown: detail.cooldown,
                    workout_video_id: detail.Workout_Video_ID
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