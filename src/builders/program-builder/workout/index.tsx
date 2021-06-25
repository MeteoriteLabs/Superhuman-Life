import { useMemo, useContext, useState } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import BuildWorkout from './buildWorkout';
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { gql, useQuery,useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);

    const GET_TABLEDATA = gql`
        query WorkoutQuery {
            workouts {
                id
                workouttitle
                intensity
                level
                updatedAt
                calories
                fitnessdisciplines{
                    disciplinename
                }
                muscle_groups {
                    name
                }
            }
        }
    `

    useQuery(GET_TABLEDATA, {
        onCompleted: loadData
    })
    
    function getDate(time: any) {
        let dateObj = new Date(time);
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();

        return (`${date}/${month}/${year}`);
    }

    function loadData(data: any) {
        setTableData(
            [...data.workouts].map((detail) => {
                console.log(detail);
                return {
                    workoutName: detail.workouttitle,
                    discipline: detail.fitnessdisciplines.disciplinename,
                    level: detail.level,
                    intensity: detail.intensity,
                    calories: detail.calories,
                    muscleGroup: detail.muscle_groups.name,
                    equipment: detail.equipment_lists[0].name,
                    updatedOn: getDate(Date.parse(detail.updatedAt))
                }
            })
        );
    }

    const columns = useMemo<any>(() => [
        { accessor: "workoutName", Header: "Workout Name" },
        { accessor: "discipline", Header: "Discipline" },
        { accessor: "duration", Header: "Duration" },
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
                <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={
                        <Popover id="action-popover">
                            <Popover.Content>
                                <Dropdown.Item>View</Dropdown.Item>
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>Delete</Dropdown.Item>
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <Button variant="white">
                        <i className="fas fa-ellipsis-v"></i>
                    </Button>
                </OverlayTrigger>
            ),
        }
    ], []);
    const eventSchema: any = require("./workout.json");
    const uiSchema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "about": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 1
            }
        },
        "equipment": {
            "ui:placeholder": "Search"
        },
        "muscleGroup": {
            "ui:placeholder": "Search"
        },
        "addWorkout": {
            "Add Text": {
                "ui:widget": "textarea",
                "ui:options": {
                    "rows": 3
                }
            },
            "Upload": {
                "ui:options": {
                    "accept": ".mp4"
                }
            },
            "build": {
                "ui:widget": (props: any) => {
                    return (
                        <div>
                            {BuildWorkout(props)}
                        </div>
                    )
                }
            }
       }
    }

    function onSubmit(formData: any) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                <ModalView
                    name="Create Template"
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={eventSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}