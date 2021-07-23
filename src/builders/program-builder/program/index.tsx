import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, TabContent } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery } from "@apollo/client";
import { GET_TABLEDATA } from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditProgram from './createoredit-program';

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditProgramComponent = useRef<any>(null);

    function handleRedirect(id: any) {
        window.location.href = `/programs/manage/${id}`
    };

    const columns = useMemo<any>(() => [
        { accessor: "programName", Header: "Program Name" },
        { accessor: "discipline", Header: "Discipline" },
        { accessor: "duration", Header: "Duration" },
        { accessor: "level", Header: "Level" },
        { accessor: "details", Header: "Details" },
        { accessor: "equipment", Header: "Equipment" },
        { accessor: "updatedOn", Header: "Updated On" },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => (
                <ActionButton 
                action1="Edit"
                actionClick1={() => {createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'edit'})}}
                action2="View"
                actionClick2={() => {createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'view'})}}
                action3="Delete"
                actionClick3={() => {createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'delete'})}}
                action4="Manage"
                actionClick4={() => handleRedirect(row.original.id)}
                 />
            ),
        }
    ], []);

    function FetchData(_variables: {} = {id: auth.userid}){
        useQuery(GET_TABLEDATA, {variables: _variables, onCompleted: loadData});
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
            [...data.fitnesssProgramTemplates].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.Program_template_name,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    level: detail.level,
                    duration: detail.Duration,
                    details: detail.Details,
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
                        createEditProgramComponent.current.TriggerForm({ id: null, type: 'create' });
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Create Program
                </Button>
                <CreateEditProgram ref={createEditProgramComponent}></CreateEditProgram>
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}