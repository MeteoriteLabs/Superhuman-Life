import { useContext, useMemo, useState } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, Form } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TABLEDATA, CREATE_EXERCISE } from './queries';
import AuthContext from "../../../context/auth-context";
import EquipmentSearch from '../search-builder/equipmentList';
import MuscleGroupSearch from '../search-builder/muscleGroupList';
import TextEditor from '../search-builder/textEditor';
import CreateFitnessPackageModal from "../../../components/CreateFitnessPackageModal/CreateFitnessPackageModal";

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);
    let disc: any;

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

        setTableData(
            [...data.exercises].map((detail) => {
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
                    type: (detail.exercisetext) ? "Text" : "Video",
                }
            })
        );
        let discplines = [...data.fitnessdisciplines].map((discipline) => {
            return {
                id: discipline.id,
                disciplineName: discipline.disciplinename,
                updatedAt: discipline.updatedAt
            }
        })
        setFitnessDisciplines(
            discplines
        );
        disc = discplines[0].id

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

    let equipmentListarray: any;
    function handleEquipmentCallback(data: any) {
        equipmentListarray = data;
    }

    let muscleGroupListarray: any;
    function handleMuscleGroupCallback(data: any) {
        muscleGroupListarray = data;
    }

    let editorTextString: any;
    function handleEditorTextCallBack(data: any) {
        editorTextString = data;
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
                        <EquipmentSearch equipmentList={handleEquipmentCallback} />
                    </div>
                )
            }
        },
        "muscleGroup": {
            "ui:widget": () => {
                return (
                    <div>
                        <MuscleGroupSearch muscleGroupList={handleMuscleGroupCallback} />
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
                                    return (
                                        <option value={val.id} >{val.disciplineName}</option>
                                    );
                                })}
                            </Form.Control>
                        </Form.Group>
                    </div>
                );
            }
        },
        "addExercise": {
            "Add Text": {
                "ui:widget": () => {
                    return (
                        <TextEditor editorText={handleEditorTextCallBack} />
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


        createExercise(
            {
                variables: {
                    exercisename: formData.exercise,
                    exerciselevel: ENUM_EXERCISES_EXERCISELEVEL[levelIndex],
                    exerciseminidescription: formData.miniDescription,
                    fitnessdiscipline: disc,
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

    FetchData({ id: auth.userid });
    // FetchFitnessDisciplines();


    return (
        <TabContent>
            <hr />
            <Card.Title className="text-right">
                <CreateFitnessPackageModal
                    stepperValues={["Creator", "Details", "Program", "Schedule", "Pricing", "Preview"]}
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