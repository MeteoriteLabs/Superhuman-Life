import { useMemo, useContext, useState } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
// import BuildWorkout from './buildWorkout';
// import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { useQuery } from "@apollo/client";
import { GET_TABLEDATA } from './queries';
import AuthContext from "../../../context/auth-context";
// import EquipmentSearch from '../search-builder/equipmentList';
// import MuscleGroupSearch from '../search-builder/muscleGroupList';
// import TextEditor from '../search-builder/textEditor';
// import MultiSelect from './fitnessMultiSelect';

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    // const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);

    function FetchData(_variables: {} = { id: auth.userid }) {
        useQuery(GET_TABLEDATA, { variables: _variables, onCompleted: loadData })
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
        //console.log(data);
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
                    equipment: detail.equipment_lists.map((equipment: any) => {
                        return equipment.name
                    }).join(", "),
                    updatedOn: getDate(Date.parse(detail.updatedAt))
                }
            })
        )
        // setFitnessDisciplines(
        //     [...data.fitnessdisciplines].map((discipline) => {
        //         return {
        //             id: discipline.id,
        //             disciplineName: discipline.disciplinename,
        //             updatedAt: discipline.updatedAt
        //         }
        //     })
        // );
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

    // let equipmentListarray: any;
    // function handleEquipmentCallback(data: any) {
    //     equipmentListarray = data;
    // }

    // let muscleGroupListarray: any;
    // function handleMuscleGroupCallback(data:any){
    //     muscleGroupListarray = data;
    // }

    // let editorTextString: any;
    // function handleEditorTextCallBack(data:any){
    //     editorTextString = data;
    // }


    // let fitnessDiscplinesListarray: any;
    // function handleFitnessDiscplinesListCallback(data: any){
    //     fitnessDiscplinesListarray = data;
    // }


    // const eventSchema: any = require("./workout.json");
    // const uiSchema: any = {
    //     "level": {
    //         "ui:widget": "radio",
    //         "ui:options": {
    //             "inline": true
    //         }
    //     },
    //     "intensity": {
    //         "ui:widget": "radio",
    //         "ui:options": {
    //             "inline": true
    //         }
    //     },
    //     "about": {
    //         "ui:widget": "textarea",
    //         "ui:options": {
    //             "rows": 3
    //         }
    //     },
    //     "benefits": {
    //         "ui:widget": "textarea",
    //         "ui:options": {
    //             "rows": 1
    //         }
    //     },
    //     "equipment": {
    //         "ui:widget": () => {
    //             return (
    //                 <div>
    //                     <EquipmentSearch equipmentList={handleEquipmentCallback}/>
    //                 </div>
    //             )
    //         }
    //     },
    //     "muscleGroup": {
    //         "ui:widget": () => {
    //             return (
    //                 <div>
    //                     <MuscleGroupSearch muscleGroupList={handleMuscleGroupCallback}/>
    //                 </div>
    //             )
    //         }
    //     },
    //     "discipline": {
    //         "ui:widget": () => {
    //             return (
    //                 <div>
    //                     <MultiSelect options={fitnessdisciplines} fitnessdisciplinesList={handleFitnessDiscplinesListCallback}/>
    //                 </div>
    //             )
    //         }
    //     },
    //     "addWorkout": {
    //         "Add Text": {
    //             "ui:widget": () => {
    //                 return (
    //                     <TextEditor editorText={handleEditorTextCallBack}/>
    //                 )
    //             }
    //         },
    //         "Upload": {
    //             "ui:options": {
    //                 "accept": ".mp4"
    //             }
    //         },
    //         "build": {
    //             "ui:widget": () => {
    //                 return (
    //                     <div>
    //                         <BuildWorkout/>
    //                     </div>
    //                 )
    //             }
    //         }
    //    }
    // }

    // const [createWorkout, { error }] = useMutation(CREATE_WORKOUT);

    // let authid = auth.userid;
    // enum ENUM_EXERCISES_EXERCISELEVEL {
    //     Beginner,
    //     Intermediate,
    //     Advance,
    //     None
    // }


    // enum ENUM_WORKOUTS_INTENSITY {
    //     Low,
    //     Medium,
    //     High
    // }


    // function onSubmit(formData: any) {
    //     let levelIndex = formData.level
    //     let intensityIndex = formData.intensity
    //     console.log(formData);

    //     createWorkout (
    //         {
    //             variables: {
    //                 workouttitle: formData.workout,
    //                 level: ENUM_EXERCISES_EXERCISELEVEL[levelIndex],
    //                 intensity: ENUM_WORKOUTS_INTENSITY[intensityIndex],
    //                 fitnessdisciplines: fitnessDiscplinesListarray.map((val: any) => {
    //                     return val.id;
    //                 }),
    //                 About: formData.about,
    //                 Benefits: formData.benefits,
    //                 users_permissions_user: authid,
    //                 workout_text: (!editorTextString ? null : editorTextString),
    //                 equipment_lists: equipmentListarray.map((val: any) => {
    //                     return val.id;
    //                 }),
    //                 muscle_groups: muscleGroupListarray.map((val: any) => {
    //                     return val.id;
    //                 })
    //             }
    //         }
    //     )
    // }

    // if (error) return <span>{`Error! ${error.message}`}</span>;

    FetchData({id: auth.userid});


    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                {/* <ModalView
                    name="Create Template"
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={eventSchema}
                    formSubmit={onSubmit}
                    formData={{ level: ENUM_EXERCISES_EXERCISELEVEL.Beginner, intensity: ENUM_WORKOUTS_INTENSITY.Low}}
                /> */}
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}