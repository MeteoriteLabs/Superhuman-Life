import { useMemo, useContext, useState, useRef } from "react";
import { Button, Card, TabContent, Modal, FormControl } from "react-bootstrap";
import Table from "../../../components/table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TABLEDATA, CREATE_PROGRAM } from './queries';
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton";
import CreateEditProgram from './createoredit-program';
import {flattenObj} from '../../../components/utils/responseFlatten';
import moment from 'moment';

export default function EventsTab() {

    const auth = useContext(AuthContext);
    const [tableData, setTableData] = useState<any[]>([]);
    const createEditProgramComponent = useRef<any>(null);
    function handleRedirect(id: any) {
        window.location.href = `/programs/manage/${id}`
    };

    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [frm, setFrm] = useState<any>();
    const [createProgram] = useMutation(CREATE_PROGRAM, {onCompleted: () => {refetchQueryCallback()}});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function CreateProgram(_variables: {} = {id: auth.userid, details: frm}) {
        createProgram({ variables: {
            title: name,
            fitnessdisciplines: frm.disciplineId.split(","),
            duration_days: frm.duration,
            level: frm.level,
            sessions: frm.sessionId.split(","),
            description: frm.description,
            users_permissions_user: frm.user
        } });
    }

    const columns = useMemo<any>(() => [
        { accessor: "programName", Header: "Program Name" },
        { accessor: "discipline", Header: "Discipline" },
        { accessor: "duration", Header: "Duration" },
        { accessor: "level", Header: "Level" },
        { accessor: "description", Header: "description" },
        { accessor: "updatedOn", Header: "Updated On" },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
                const actionClick1 = () => {
                    createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'edit'});
                };
                const actionClick2 = () => {
                    createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'view'});
                };
                const actionClick3 = () => {
                    createEditProgramComponent.current.TriggerForm({id: row.original.id, type: 'delete'});
                };
                const actionClick4 = () => {
                    handleRedirect(row.original.id);
                };
                const actionClick5 = () => {
                    setName(row.original.programName + " copy");setFrm(row.original);handleShow();
                };

                const arrayAction = [
                    { actionName: 'Edit', actionClick: actionClick1 },
                    { actionName: 'View', actionClick: actionClick2 },
                    { actionName: 'Delete', actionClick: actionClick3 },
                    { actionName: 'Manage', actionClick: actionClick4 },
                    { actionName: 'Duplicate', actionClick: actionClick5 },
                ];

                return <ActionButton arrayAction={arrayAction}></ActionButton>
            },
        }
    ], []);

    // function FetchData(_variables: {} = {id: auth.userid}){
        const fetch = useQuery(GET_TABLEDATA, {variables: {id: auth.userid}, onCompleted: loadData});
    // }

    function refetchQueryCallback() {
        fetch.refetch();
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
        const flattenData = flattenObj({...data});
        console.log(flattenData);
        setTableData(
            [...flattenData.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    disciplineId: detail.fitnessdisciplines.map((val: any) => {
                        return val.id;
                    }).join(","),
                    level: detail.level,
                    sessionId: detail.sessions.map((val: any) => {
                        return val.id;
                    }).join(","),
                    duration: detail.duration_days,
                    description: detail.description,
                    user: detail.users_permissions_user.id,
                    updatedOn: moment(getDate(Date.parse(detail.updatedAt))).format("Do MMM YYYY")
                }
            })
        )
    }

    // FetchData();


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
                <CreateEditProgram ref={createEditProgramComponent} callback={refetchQueryCallback}></CreateEditProgram>
                {
                    <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Change name</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormControl
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose}>
                                Close
                                </Button>
                                <Button variant="success" onClick={() => {
                                    handleClose();
                                    CreateProgram({id: auth.userid, frm: frm});
                                }}>
                                Save Changes
                                </Button>
                            </Modal.Footer>
                    </Modal>
                }
            </Card.Title>
            <Table columns={columns} data={tableData} />
        </TabContent>
    );
}