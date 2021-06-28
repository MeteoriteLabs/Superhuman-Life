import { useContext, useMemo, useState, useRef } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, Form, InputGroup, FormControl } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { gql, useQuery,useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);
    const [equipmentList, setEquipmentList] = useState<any[]>([]);


    const GET_EQUIPMENTLIST = gql`
        query equipmentListQuery {
            equipmentLists(sort: "updatedAt"){
                id
                name
            }
        }
    `

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
        query ExercisesQuery($id: String) {
            exercises(where: {users_permissions_user: { id: $id}}) {
                id
                updatedAt
                exercisename
                exerciselevel
                users_permissions_user {
                    id
                }
                fitnessdiscipline {
                id
                disciplinename
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
                exercisemusclegroups {
                    name
                  }
            }
        }
    `

    const CREATE_EXERCISE = gql`
        
        mutation createexercise(
            $exercisename: String
            $exerciselevel: ENUM_EXERCISES_EXERCISELEVEL
            $exerciseminidescription: String
            $exercisetext: String
            $exerciseurl: String
            $users_permissions_user: ID
        ){
            createExercise (
                input: {
                    data: {
                        exercisename: $exercisename
                        exerciselevel: $exerciselevel
                        exerciseminidescription: $exerciseminidescription
                        exercisetext: $exercisetext
                        exerciseurl: $exerciseurl
                        users_permissions_user: $users_permissions_user
                    }
                }
            ){
                exercise {
                    id
                    exercisename
                }
            }
        }
    `

    function FetchEquipmentList(){
        useQuery(GET_EQUIPMENTLIST, {onCompleted: loadEquipmentList});
    }

    function loadEquipmentList(data: any){
        setEquipmentList (
            [...data.equipmentLists].map((equipment) => {
                return {
                    id: equipment.id,
                    name: equipment.name
                }
            })
        );
    }

    function FetchFitnessDisciplines(){
        useQuery(GET_FITNESSDISCIPLINES, {onCompleted: loadFitnessDisciplines});
    }

    function loadFitnessDisciplines(data: any){
        setFitnessDisciplines(
            [...data.fitnessdisciplines].map((discipline) => {
                console.log(discipline);
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
            [...data.exercises].map((detail) => {
                //console.log(detail);
                return {
                    exerciseName: detail.exercisename,
                    discipline: detail.fitnessdiscipline.disciplinename,
                    level: detail.exerciselevel,
                    muscleGroup: detail.exercisemusclegroups.map((muscle: any) => {
                        return muscle.name
                    }).join(", "),
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
                    updatedOn: getDate(Date.parse(detail.updatedAt)),
                    type: (detail.exerciseText && detail.exerciseText.length) ? "Text": "Video" ,
                }
            })
        );
    }

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

    const eventSchema: any = require("./exercises.json");
    const uiSchema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "description": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "miniDescription": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "equipment": {
            "ui:widget": () => {
                return (
                    <div>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Equipment</Form.Label>
                        <Form.Control as="select">
                            {equipmentList.map((val: any) => {
                                return <option>{val.name}</option>
                            })}
                        </Form.Control>
                    </Form.Group> 
                    </div>
                )
            }
        },
        "muscleGroup": {
            "ui:placeholder": "Search"
        },
        "discipline": {
            "ui:widget": () => {
                return (
                    <div>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Fitness Discipline</Form.Label>
                            <Form.Control as="select" custom>
                                {fitnessdisciplines.map((val: any) => {
                                    return <option>{val.disciplineName}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                    </div>
                );
            }
        },
        "addExercise": {
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
            }
       }
    }

    const [createExercise, { error }] = useMutation(CREATE_EXERCISE);
    let authid = auth.userid;
    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advance,
        None
    }

    function onSubmit(formData: any) {
        console.log(formData);
        let levelIndex = formData.exerciselevel;
        
        // createExercise(
        //     {
        //         variables: {
        //             exercisename: formData.exercise,
        //             exerciselevel: ENUM_EXERCISES_EXERCISELEVEL[levelIndex],
        //             exerciseminidescription: formData.miniDescription,
        //             exercisetext: (!formData.addExercise.AddText ? " " : formData.addExercise.AddText),

        //             exerciseurl: formData.addExercise.AddURL,
        //             users_permissions_user: authid
        //         }
        //     }
        // )
    }
    if (error) return <span>{`Error! ${error.message}`}</span>;

    FetchData({id: auth.userid});
    FetchFitnessDisciplines();
    FetchEquipmentList();
    
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