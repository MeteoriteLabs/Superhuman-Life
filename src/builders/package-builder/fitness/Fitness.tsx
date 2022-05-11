import { useMemo, useState, useContext, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Badge, Button, Card, Col, Container, Form, Row, TabContent } from "react-bootstrap";
import Table from "../../../components/table";
import AuthContext from "../../../context/auth-context";
import './fitness.css'
import ActionButton from "../../../components/actionbutton";

import CreateEditView from "./CreateEditView";
import CreateEditViewChannel from './create-edit/CreateEditView-Channel';
import CreateEditViewCohort from "./create-edit/CreateEditView-Cohort";
import { GET_FITNESS, GET_FITNESS_PACKAGE_TYPES } from "./graphQL/queries";
import { flattenObj } from "../../../components/utils/responseFlatten";


export default function FitnessTab(props) {
    const auth = useContext(AuthContext);


    const createEditViewRef = useRef<any>(null);
    const createEditViewChannelRef = useRef<any>(null);
    const createEditViewCohortRef = useRef<any>(null);
    const [selectedDuration, setSelectedDuration] = useState<any>('');
    const [currentIndex, setCurrentIndex] = useState<any>('');



    const columns = useMemo<any>(() => [
        { accessor: "packagename", Header: "Package Name" },
        {
            accessor: "type", Header: "Type", Cell: ({ row }: any) => {
                return <div >
                    {row.original.type === "Group Class" ? <div>
                        <img src='./assets/GroupType.svg' alt="GroupType" />
                    </div> : ""}
                    {row.original.type === "Personal Training" ? <div>
                        <img src='./assets/PTType.svg' alt="PTType" />
                    </div> : ""}
                    {row.original.type === "Classic Class" ? <div>
                        <img src='./assets/ClassicType.svg' alt="ClassicType" />
                    </div> : ""}
                    {row.original.type === "Custom Fitness" ? <div>
                        <img src='./assets/CustomType.svg' alt="CustomType" />
                    </div> : ""}
                </div>
            }
        },
        {
            accessor: "details", Header: "Details",
            Cell: ({ row }: any) => {
                return <div className='d-flex justify-content-center align-items-center'>
                    {row.values.details[0] !== null && row.values.details[0] !== 0 ?
                        <div>
                            <img src='./assets/custompersonal-training-Online.svg' alt="PT-Online" />
                            <p>{row.values.details[0] * currentIndex[row.index]}</p>
                        </div>
                        : ""}
                    {row.values.details[1] !== null && row.values.details[1] !== 0 ?
                        <div>
                            <img src='./assets/custompersonal-training-Offline.svg' alt="PT-Offline" />
                            <p>{row.values.details[1] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[2] !== null && row.values.details[2] !== 0 ?
                        <div>
                            <img src='./assets/customgroup-Online.svg' alt="Group-Online" />
                            <p>{row.values.details[2] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[3] !== null && row.values.details[3] !== 0 ?
                        <div>
                            <img src='./assets/customgroup-Offline.svg' alt="GRoup-Offline" />
                            <p>{row.values.details[3] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[4] !== null && row.values.details[4] !== 0 ?
                        <div>
                            <img src='./assets/customclassic.svg' alt="Classic" />
                            <p>{row.values.details[4] * currentIndex[row.index]}</p>
                        </div> : ""}
                </div>
            }
        },
        {
            accessor: "duration", Header: "Duration",
            Cell: ({ row }: any) => {
                return <>
                    <Form.Group>
                        <Form.Control
                            id={row.index}
                            value={selectedDuration[row.index]}
                            as="select"
                            onChange={(e) => {
                                const updateSelectedDuration = [...selectedDuration];
                                const updateCurrentindex = [...currentIndex];
                                let value = 1
                                if (e.target.value === "1") {
                                    value *= 3
                                } else if (e.target.value === "2") {
                                    value *= 6
                                } else if (e.target.value === "3") {
                                    value *= 12
                                }
                                updateSelectedDuration[row.index] = Number(e.target.value);
                                updateCurrentindex[row.index] = value;
                                setSelectedDuration(updateSelectedDuration);
                                setCurrentIndex(updateCurrentindex)
                            }}>
                            {row.values.duration.map((item: number, index: number) => {
                                return <option key={index} value={index}>{item} days</option>
                            })}
                        </Form.Control>
                    </Form.Group>
                </>
            }
        },
        {
            accessor: "mrp", Header: "MRP",
            Cell: ({ row }: any) => {
                return <>
                    <p>{row.values.mrp[selectedDuration[row.index]]}</p>
                </>
            }
        },

        { accessor: "Status", Header: "Status", Cell: (v: any) => <Badge className='py-3 px-5' style={{ fontSize: '1rem' }} variant={v.value === "Active" ? "success" : "danger"}>{v.value}</Badge> },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
                const actionClick1 = () => {
                    row.original.type === "Live Stream Channel" ? createEditViewChannelRef.current.TriggerForm({ id: row.original.id, type: 'edit', packageType: row.original.type }) : row.original.type === "Cohort" ? createEditViewCohortRef.current.TriggerForm({ id: row.original.id, type: 'edit', packageType: row.original.type }) : createEditViewRef.current.TriggerForm({ id: row.original.id, type: 'edit', packageType: row.original.type });
                };
                const actionClick2 = () => {
                    row.original.type === "Live Stream Channel" ? createEditViewChannelRef.current.TriggerForm({ id: row.original.id, type: 'view', packageType: row.original.type }) : row.original.type === "Cohort" ? createEditViewCohortRef.current.TriggerForm({ id: row.original.id, type: 'view', packageType: row.original.type }) : createEditViewRef.current.TriggerForm({ id: row.original.id, type: 'view', packageType: row.original.type });
                };
                const actionClick3 = () => {
                    row.original.type === "Live Stream Channel" ? createEditViewChannelRef.current.TriggerForm({ id: row.original.id, type: 'toggle-status', packageType: row.original.type, current_status: row.original.Status === "Active" ? false : true }) : row.original.type === "Cohort" ? createEditViewCohortRef.current.TriggerForm({ id: row.original.id, type: 'toggle-status', packageType: row.original.type, current_status: row.original.Status === "Active" ? false : true }) : createEditViewRef.current.TriggerForm({ id: row.original.id, type: 'toggle-status', packageType: row.original.type });
                };
                const actionClick4 = () => {
                    row.original.type === "Live Stream Channel" ? createEditViewChannelRef.current.TriggerForm({ id: row.original.id, type: 'delete', packageType: row.original.type }) : row.original.type === "Cohort" ? createEditViewCohortRef.current.TriggerForm({ id: row.original.id, type: 'delete', packageType: row.original.type }) : createEditViewRef.current.TriggerForm({ id: row.original.id, type: 'delete', packageType: row.original.type });
                };

                const arrayAction = [
                    { actionName: 'Edit', actionClick: actionClick1 },
                    { actionName: 'View', actionClick: actionClick2 },
                    { actionName: 'Status', actionClick: actionClick3 },
                    { actionName: 'Delete', actionClick: actionClick4 },
                ];

                return <ActionButton arrayAction={arrayAction}></ActionButton>
            }

        }
    ], [selectedDuration, currentIndex]);

    const [dataTable, setDataTable] = useState<any>([]);

    const { data } = useQuery(GET_FITNESS_PACKAGE_TYPES);

    // const FetchData = () => {
    const query = useQuery(GET_FITNESS, {
        variables: { id: auth.userid, },
        onCompleted: (data) => loadData(data),
        
    });
    // }

    function refetchQueryCallback() {
        query.refetch();
    }

    const loadData = (data: any) => {
    // console.log("🚀 ~ file: Fitness.tsx ~ line 155 ~ loadData ~ data", data)
        const flattenData = flattenObj({...data});
        console.log(flattenData);
        setDataTable(
            [...flattenData.fitnesspackages].map(item => {
                return {
                    id: item.id,
                    packagename: item.packagename,
                    type: item.fitness_package_type.type,
                    details: [item.ptonline, item.ptoffline, item.grouponline, item.groupoffline, item.recordedclasses],
                    duration: item.fitnesspackagepricing.map(i => i.duration),
                    mrp: item.fitnesspackagepricing.map(i => i.mrp),
                    Status: item.Status ? "Active" : "Inactive",
                }
            })
        )
        setSelectedDuration(new Array(flattenData.fitnesspackages.length).fill(0));
        setCurrentIndex(new Array(flattenData.fitnesspackages.length).fill(1))
    }
    // FetchData()

    return (
        <TabContent>
            <Container>
                <Row>
                    <Col>
                        <Card.Title className="text-center">
                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewRef.current.TriggerForm({ id: null, actionType: 'create', type: 'Personal Training' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Personal Training
                            </Button>

                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewRef.current.TriggerForm({ id: null, actionType: 'create', type: 'Group Class' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Group
                            </Button>

                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewRef.current.TriggerForm({ id: null, actionType: 'create', type: 'Classic Class'});
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Classic
                            </Button>

                            
                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewRef.current.TriggerForm({ id: null, actionType: 'create', type: 'Custom Fitness' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Custom
                            </Button>
                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewChannelRef.current.TriggerForm({ id: null, type: 'create', packageType: 'Live Stream Channel', callback: refetchQueryCallback() });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Channel
                            </Button>
                            <Button className='mr-4' variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditViewCohortRef.current.TriggerForm({ id: null, type: 'create', packageType: 'Cohort' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Cohort
                            </Button>
                            <CreateEditView packageType={flattenObj({...data})} ref={createEditViewRef}></CreateEditView>
                            <CreateEditViewChannel ref={createEditViewChannelRef} callback={refetchQueryCallback}></CreateEditViewChannel>
                            <CreateEditViewCohort ref={createEditViewCohortRef} callback={refetchQueryCallback}></CreateEditViewCohort>
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={dataTable} />
        </TabContent>
    );
}
