import { useContext, useMemo, useState, useRef } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { useQuery,useMutation } from "@apollo/client";
import { GET_TABLEDATA, CREATE_EXERCISE } from './queries';
import AuthContext from "../../../context/auth-context";
import EquipmentSearch from '../search-builder/equipmentList';
import MuscleGroupSearch from '../search-builder/muscleGroupList';
import TextEditor from '../search-builder/textEditor';
import FitnessSelect from './fitnessSelect';
import ActionButton from "../../../components/actionbutton";
import CreateEditExercise from "./createoredit-exercise";


export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);
    const createEditExerciseComponent = useRef<any>(null);

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
        console.log(data);
        setTableData(
            [...data.exercises].map((detail) => {
                return {
                    exerciseName: detail.exercisename,
                    discipline: detail.fitnessdisciplines.map((disc:any) => {
                        return disc.disciplinename;
                    }),
                    level: detail.exerciselevel,
                    muscleGroup: detail.exercisemusclegroups.map((muscle: any) => {
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
                <ActionButton 
                action1="Edit"
                actionClick1={() => {createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'edit'})}}
                action2="View"
                actionClick2={() => {createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'view'})}}
                action3="Delete"
                actionClick3={() => {createEditExerciseComponent.current.TriggerForm({id: row.original.id, type: 'delete'})}}
                 />
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

    let fitnessDiscplinesListarray: any;
    function handleFitnessDiscplinesListCallback(data: any){
        // console.log(data[0].id);
        fitnessDiscplinesListarray = data;
    }

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
                        <FitnessSelect options={fitnessdisciplines} fitnessdisciplinesList={handleFitnessDiscplinesListCallback}/>
                    </div>
                );
            }
        },
        "addExercise": {
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
        
        let levelIndex = formData.level;
        console.log(formData);
        
        createExercise(
            {
                variables: {
                    exercisename: formData.exercise,
                    exerciselevel: ENUM_EXERCISES_EXERCISELEVEL[levelIndex],
                    exerciseminidescription: formData.miniDescription,
                    fitnessdisciplines: fitnessDiscplinesListarray.map((val: any) => {
                        return val.id
                    }),
                    exercisetext: (!editorTextString ? null : editorTextString),
                    exerciseurl: formData.addExercise.AddURL,
                    users_permissions_user: authid,
                    equipment_lists: equipmentListarray.map((val: any) => {
                        return val.id;
                    }),
                    exercisemusclegroups: muscleGroupListarray.map((val: any) => {
                        return val.id;
                    })
                }
            }
        )
    }
    if (error) return <span>{`Error! ${error.message}`}</span>;

    FetchData({id: auth.userid});    
    
    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                <Button variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        createEditExerciseComponent.current.TriggerForm({ id: null, type: 'create' });
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Create New
                </Button>
                <CreateEditExercise ref={createEditExerciseComponent}></CreateEditExercise>
                <ModalView
                    name="Create Template"
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={eventSchema}
                    formSubmit={onSubmit}
                    formData={{ level: ENUM_EXERCISES_EXERCISELEVEL.Beginner }}
                />
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}