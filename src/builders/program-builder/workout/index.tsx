import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, FormControl, Form } from "react-bootstrap";
import BuildWorkout from './buildWorkout';
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { gql, useQuery,useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import EquipmentSearch from '../search-builder/equipmentList';
import MuscleGroupSearch from '../search-builder/muscleGroupList';
import TextEditor from '../search-builder/textEditor';

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);


    const GET_FITNESSDISCIPLINES = gql`
        query fitnessdisciplines{
            fitnessdisciplines(sort: "updatedAt"){
                id
                disciplinename
                updatedAt
            }
        }
    `

    const GET_TABLEDATA = gql`
        query WorkoutQuery($id: String) {
            workouts(where: {users_permissions_user: {id: $id}}) {
                id
                workouttitle
                intensity
                level
                updatedAt
                calories
                users_permissions_user
                fitnessdisciplines{
                    id
                    disciplinename
                }
                muscle_groups {
                    name
                }
                equipment_lists {
                    id
                    updatedAt
                    name
                    image{
                        id
                        updatedAt
                    }
                }
            }
        }
    `

    function FetchFitnessDisciplines(){
        useQuery(GET_FITNESSDISCIPLINES, {onCompleted: loadFitnessDisciplines});
    }

    function loadFitnessDisciplines(data: any){
        setFitnessDisciplines(
            [...data.fitnessdisciplines].map((discipline) => {
                return {
                    id: discipline.id,
                    disciplineName: discipline.disciplinename,
                    updatedAt: discipline.updatedAt
                }
            })
        );
    }

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
                // console.log(detail);
                return {
                    workoutName: detail.workouttitle,
                    discipline: detail.fitnessdisciplines.disciplinename,
                    level: detail.level,
                    intensity: detail.intensity,
                    calories: detail.calories,
                    muscleGroup: detail.muscle_groups.name,
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
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

    let equipmentListarray: any;
    function handleEquipmentCallback(data: any) {
        equipmentListarray = data;
    }

    let muscleGroupListarray: any;
    function handleMuscleGroupCallback(data:any){
        muscleGroupListarray = data;
    }

    let editorTextString: any;
    function handleEditorTextCallBack(data:any){
        editorTextString = data;
    }

    let disc: any;
    const eventSchema: any = require("./workout.json");
    const uiSchema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "intensity": {
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
            "ui:widget": () => {
                return (
                    <div>
                        <EquipmentSearch equipmentList={handleEquipmentCallback}/>
                    </div>
                )
            }
        },
        "muscleGroup": {
            "ui:widget": () => {
                return (
                    <div>
                        <MuscleGroupSearch muscleGroupList={handleMuscleGroupCallback}/>
                    </div>
                )
            }
        },
        "discipline": {
            "ui:widget": () => {
                return (
                    <div>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Fitness Discipline</Form.Label>
                            <Form.Control as="select" custom onChange={(e) => { disc = e.target.value }}>
                                {fitnessdisciplines.map((val: any) => {
                                    return <option value={val.id} >{val.disciplineName}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                    </div>
                )
            }
        },
        "addWorkout": {
            "Add Text": {
                "ui:widget": () => {
                    return (
                        <TextEditor editorText={handleEditorTextCallBack}/>
                    )
                }
            },
            "Upload": {
                "ui:options": {
                    "accept": ".mp4"
                }
            },
            "build": {
                "ui:widget": () => {
                    return (
                        <div>
                            <BuildWorkout/>
                        </div>
                    )
                }
            }
       }
    }

    let authid = auth.userid;
    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advance,
        None
    }

    enum ENUM_WORKOUTS_INTENSITY {
        Low,
        Medium,
        High
    }

    function onSubmit(formData: any) {
        alert("Values submitted: " + JSON.stringify(formData, null, 2));
    }

    FetchData({id: auth.userid});
    FetchFitnessDisciplines();


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
                    formData={{ level: ENUM_EXERCISES_EXERCISELEVEL.Beginner, intensity: ENUM_WORKOUTS_INTENSITY.Low}}
                />
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}