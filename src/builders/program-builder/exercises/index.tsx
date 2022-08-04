import { useContext, useMemo, useState, useRef } from "react";
import { Button, Card, TabContent } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery } from "@apollo/client";
import { GET_TABLEDATA} from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditExercise from "./createoredit-exercise";
import {flattenObj} from '../../../components/utils/responseFlatten';


export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditExerciseComponent = useRef<any>(null);

    const columns = useMemo<any>(() => [
        { accessor: "exerciseName", Header: "Exercise Name" },
        { accessor: "discipline", Header: "Discipline" },
        { accessor: "level", Header: "Level" },
        { accessor: "type", Header: "Type" },
        { accessor: "muscleGroup", Header: "Muscle group" },
        { accessor: "equipment", Header: "Equipment" },
        { accessor: "updatedOn", Header: "Updated On" },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
                const actionClick1 = () => {
                    createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'edit'})
                };
                const actionClick2 = () => {
                    createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'view'})
                };
                const actionClick3 = () => {
                    createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'delete'})
                };

                const arrayAction = [
                    {actionName: 'Edit', actionClick: actionClick1},
                    {actionName: 'View', actionClick: actionClick2},
                    {actionName: 'Delete', actionClick: actionClick3},
                ];
                return <ActionButton arrayAction={arrayAction}></ActionButton>
            },
        }
    ], []);

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

    // function FetchData(_variables: {} = {id: auth.userid}){
        const fetch = useQuery(GET_TABLEDATA, {variables: {id: auth.userid}, onCompleted: loadData});
    // }

    function refetchQueryCallback() {
        fetch.refetch();
    }

    function loadData(data: any) {
        const flattenData = flattenObj({...data});
        setTableData(
            [...flattenData.exercises].map((detail) => {
                return {
                    id: detail.id,
                    exerciseName: detail.exercisename,
                    discipline: detail.fitnessdisciplines.map((disc:any) => {
                        return disc.disciplinename;
                    }),
                    level: detail.exerciselevel,
                    muscleGroup: detail.muscle_groups.map((muscle: any) => {
                        return muscle.name
                    }).join(", "),
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
                    updatedOn: getDate(Date.parse(detail.updatedAt)),
                    type: (detail.exercisetext) ? "Text": "Video" ,
                }
            })
        );
    }


    // FetchData({id: auth.userid});    
    
    
    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                <Button variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        createEditExerciseComponent.current.TriggerForm({ id: null, type: 'create' });
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Create Exercise
                </Button>
                <CreateEditExercise ref={createEditExerciseComponent} callback={refetchQueryCallback}></CreateEditExercise>
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}