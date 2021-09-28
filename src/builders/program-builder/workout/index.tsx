import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, TabContent } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery } from "@apollo/client";
import { GET_TABLEDATA } from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditWorkout from "./createoredit-workout";

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditWorkoutComponent = useRef<any>(null);

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
            Cell: ({ row }: any) => (
                <ActionButton 
                action1="Edit"
                actionClick1={() => {createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'edit'})}}
                action2="View"
                actionClick2={() => {createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'view'})}}
                action3="Delete"
                actionClick3={() => {createEditWorkoutComponent.current.TriggerForm({id: row.original.id, type: 'delete'})}}
                 />
            ),
        }
    ], []);

    function FetchData(_variables: {} = {id: auth.userid}){
        useQuery(GET_TABLEDATA, {variables: _variables, onCompleted: loadData})
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
        setTableData(
            [...data.workouts].map((detail) => {
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

    FetchData({id: auth.userid});


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
                <CreateEditWorkout ref={createEditWorkoutComponent}></CreateEditWorkout>
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}