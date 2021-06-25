import { useContext, useMemo, useState } from "react";
import { Button, Card, Dropdown, OverlayTrigger, Popover, TabContent } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { gql, useQuery,useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { getAllJSDocTags } from "typescript";

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);

    // console.log(auth.userid);

    const GET_TABLEDATA = gql`
        query ExercisesQuery($id: String) {
            exercises(sort: "updatedAt", where: {users_permissions_user: {id: $id}}){
                id
                updatedAt
                exercisename
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
            [...data.exercises].map((detail) => {
                console.log(detail);
                return {
                    exerciseName: detail.exercisename,
                    discipline: detail.fitnessdiscipline.disciplinename,
                    muscleGroup: detail.exercisemusclegroups[0].name,
                    equipment: detail.equipment_lists[0].name,
                    updatedOn: getDate(Date.parse(detail.updatedAt))
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
            "ui:placeholder": "Search"
        },
        "muscleGroup": {
            "ui:placeholder": "Search"
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