import { useMemo, useState, useContext, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Badge, Button, Card, Col, Container, Form, Row, TabContent, DropdownButton, Dropdown } from "react-bootstrap";
import Table from "../../../components/table";
import AuthContext from "../../../context/auth-context";
import './fitness.css'
import ActionButton from "../../../components/actionbutton";
import CreateEditViewPersonalTraining from './personal-training/CreateEditView';
import CreateEditViewOnDemandPt from './onDemand-PT/CreateEditView';
import CreateEditViewGroupClass from './group/CreateEditView';
import CreateEditViewClassicClass from './classic/CreateOrEdit';
import CreateEditViewCustomFitness from './custom/CreateOrEdit';
import CreateEditViewChannel from './live-stream/CreateEditView-Channel';
import CreateEditViewCohort from "./cohort/CreateEditView-Cohort";
import { GET_FITNESS } from "./graphQL/queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from 'moment';
import OfferingsDisaplyImage from "../../../components/customWidgets/offeringsDisplayImage";


export default function FitnessTab(props) {
    const auth = useContext(AuthContext);

    const createEditViewPersonalTrainingRef = useRef<any>(null);
    const CreateEditViewOnDemandPtRef = useRef<any>(null);
    const CreateEditViewGroupClassRef = useRef<any>(null);
    const CreateEditViewClassicClassRef = useRef<any>(null);
    const CreateEditViewCustomFitnessRef = useRef<any>(null);
    const createEditViewChannelRef = useRef<any>(null);
    const createEditViewCohortRef = useRef<any>(null);
    const [selectedDuration, setSelectedDuration] = useState<any>('');
    const [currentIndex, setCurrentIndex] = useState<any>('');

    function handleModalRender(id: string | null, actionType: string, type: string, current_status?: boolean){

        switch(type){
            case 'One-On-One':
                createEditViewPersonalTrainingRef.current.TriggerForm({id: id, type: actionType, actionType: type, current_status: current_status});
                break;
            case 'On-Demand PT':
                CreateEditViewOnDemandPtRef.current.TriggerForm({id: id, type: actionType, actionType: type, current_status: current_status});
                break;
            case 'Group Class':
                CreateEditViewGroupClassRef.current.TriggerForm({id: id, type: actionType, actionType: type, current_status: current_status});
                break;
            case 'Classic Class':
                CreateEditViewClassicClassRef.current.TriggerForm({id: id, type: actionType, actionType: type, current_status: current_status});
                break;
            case 'Custom Fitness':
                CreateEditViewCustomFitnessRef.current.TriggerForm({id: id, type: actionType, actionType: type, current_status: current_status});
                break;
            case 'Live Stream Channel':
                createEditViewChannelRef.current.TriggerForm({id: id, type: actionType, packageType: type, current_status: current_status});
                break;
            case 'Cohort':
                createEditViewCohortRef.current.TriggerForm({id: id, type: actionType, packageType: type, current_status: current_status});
                break;
        }
    }

    const columns = useMemo<any>(() => [
        { accessor: "packagename", Header: "Package Name" },
        {
            accessor: "type", Header: "Type", Cell: ({ row }: any) => {
                return <div >
                    {row.original.type === "Group Class" ? <div>
                        <img src='./assets/GroupType.svg' alt="GroupType" />
                    </div> : ""}
                    {row.original.type === "On-Demand PT" ? <div>
                        <img src='./assets/PTType.svg' alt="GroupType" />
                    </div> : ""}
                    {row.original.type === "One-On-One" ? <div>
                        <img src='./assets/PTType.svg' alt="PTType" />
                    </div> : ""}
                    {row.original.type === "Classic Class" ? <div>
                        <img src='./assets/ClassicType.svg' alt="ClassicType" />
                    </div> : ""}
                    {row.original.type === "Custom Fitness" ? <div>
                        <img src='./assets/CustomType.svg' alt="CustomType" />
                    </div> : ""}
                    {row.original.type === "Cohort" ? <div>
                        <img src='./assets/cohort.svg' alt="CohortType" />
                    </div> : ""}
                    {row.original.type === "Live Stream Channel" ? <div>
                        <img src='./assets/livestream.svg' alt="live stream" />
                    </div> : ""}
                </div>
            }
        },
        {
            accessor: "details", Header: "Details",
            Cell: ({ row }: any) => {

                return <div className='d-flex justify-content-center align-items-center'>
                    {row.values.details[0] !== null && row.values.details[0] !== 0 ?
                        <div className="text-center">
                            <OfferingsDisaplyImage mode={row.original?.mode === 'Hybrid' ? 'Online' : row.original?.mode} packageType={row.original?.type}/>
                            {/* <img src='./assets/custompersonal-training-Online.svg' alt="PT-Online" /> */}
                            <p>{(row.original.details[0] * currentIndex[row.index])}</p>
                        </div>
                        : ""}
                    {row.values.details[1] !== null && row.values.details[1] !== 0 ?
                        <div className="text-center">
                            <OfferingsDisaplyImage mode={row.original?.mode === 'Hybrid' ? 'Offline' : row.original?.mode} packageType={row.original?.type === 'Custom Fitness' ? "One-On-One" : row.original?.type}/>
                            {/* <img src='./assets/custompersonal-training-Offline.svg' alt="PT-Offline" /> */}
                            <p>{row.values.details[1] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[2] !== null && row.values.details[2] !== 0 ?
                        <div className="text-center">
                            <OfferingsDisaplyImage mode={row.original?.mode === 'Hybrid' ? 'Online' : row.original?.mode} packageType={row.original?.type}/>
                            {/* <img src='./assets/customgroup-Online.svg' alt="Group-Online" /> */}
                            <p>{row.original?.freeClass ? row.original.pricing[selectedDuration[row.index]]?.classes : row.values.details[2] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[3] !== null && row.values.details[3] !== 0 ?
                        <div className="text-center">
                            <OfferingsDisaplyImage mode={row.original?.mode === 'Hybrid' ? 'Offline' : row.original?.mode} packageType={row.original?.type === 'Custom Fitness' ? 'Group Class' : row.original?.type}/>
                            {/* <img src='./assets/customgroup-Offline.svg' alt="GRoup-Offline" /> */}
                            <p>{row.original?.freeClass ? row.original.pricing[selectedDuration[row.index]]?.classes : row.values.details[3] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[4] !== null && row.values.details[4] !== 0 ?
                        <div className="text-center">
                            <OfferingsDisaplyImage mode={row.original?.type === 'Custom Fitness' ? 'Online' : row.original?.mode} packageType={row.original?.type === "Custom Fitness" ? "Classic Class" : row.original?.type}/>
                            {/* <img src='./assets/customclassic.svg' alt="Classic" /> */}
                            <p>{row.values.details[4] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[5] !== null && row.values.details[4] === null ?
                        <div className="text-center">
                            {/* <OfferingsDisaplyImage mode={row.original?.mode} packageType={row.original?.type}/> */}
                            {row.values.details[6] === "Online" ? <OfferingsDisaplyImage mode={'Online'} packageType={row.original?.type}/> : <OfferingsDisaplyImage mode={'Offline'} packageType={row.original?.type}/>}
                            {/* <img src={row.values.details[6] === "Online" ? './assets/cohort_online.svg' : './assets/cohort_offline.svg'} alt="cohort" /> */}
                            <p>{row.values.details[5] * currentIndex[row.index]}</p>
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

                                let value = 1;
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
                                return <option key={index} value={index}>{item !== 0 && item} days</option>
                            })}
                        </Form.Control>
                    </Form.Group>
                </>
            }
        },
        {
            accessor: "mrp", Header: "MRP",
            Cell: ({ row }: any) => {
                const pricing = row.values.mrp[selectedDuration[row.index]];
                return <>
                    <p className={`text-capitalize ${pricing === "free" ? "text-success font-weight-bold" : ""}`}>{pricing === "free" ? "" : "\u20B9"} {pricing}</p>
                </>
            }
        },

        { accessor: "Status", Header: "Status", Cell: (v: any) => {
            return <div><Badge className='py-3 px-5' style={{ fontSize: '1rem' }} variant={v.value === "Active" ? "success" : "danger"}>{v.value === "Active" ? "Published" : "Draft"}</Badge>
                {moment(v?.row?.original?.publishingDate).isAfter(moment()) && v.value === "Active" && <p className="small text-muted">This will be published on {moment(v?.row?.original?.publishingDate).format("Do, MMM-YY")}</p>}
            </div>
            }
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
                const actionClick1 = () => {
                    handleModalRender(row.original.id, "edit", row.original.type);
                };
                const actionClick2 = () => {
                    handleModalRender(row.original.id, "view", row.original.type);
                };
                const actionClick3 = () => {
                    handleModalRender(row.original.id, "toggle-status", row.original.type, row.original.Status === "Active" ? false : true);
                };
                const actionClick4 = () => {
                    handleModalRender(row.original.id, "delete", row.original.type);
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

    const query = useQuery(GET_FITNESS, {
        variables: { id: auth.userid, },
        onCompleted: (data) => loadData(data),
        
    });

    function refetchQueryCallback() {
        query.refetch();
    }

    const loadData = (data: any) => {
        const flattenData = flattenObj({...data});
        setDataTable(
            [...flattenData.fitnesspackages].map(item => {
               
                return {
                    id: item.id,
                    packagename: item.packagename,
                    type: item.fitness_package_type.type,
                    details: [item.ptonline,item.ptoffline,item.grouponline,item.groupoffline,item.recordedclasses,item.duration, item.mode],
                    duration: item.fitnesspackagepricing.map(i => i.duration),
                    mrp: item.fitnesspackagepricing.map(i => i.mrp),
                    Status: item.Status ? "Active" : "Inactive",
                    publishingDate: item.publishing_date,
                    mode: item.mode,
                    days: item.duration,
                    pricing: item.fitnesspackagepricing,
                    freeClass: item.groupinstantbooking
                }
            })
        )
        setSelectedDuration(new Array(flattenData.fitnesspackages.length).fill(0));
        setCurrentIndex(new Array(flattenData.fitnesspackages.length).fill(1))
    }

    return (
        <TabContent>
            <div className="justify-content-lg-center d-flex overflow-auto p-3">
            <DropdownButton className='mx-3' variant="outline-secondary" id="dropdown-basic-button" title={
                <span>
                    <i className='fas fa-plus-circle'></i> One-On-One
                </span>
            }>
                <Dropdown.Item onClick={() => {
                    handleModalRender( null, 'create',"One-On-One");
                }}>PT Package</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                    handleModalRender( null, 'create','On-Demand PT');
                }}>Private Session</Dropdown.Item>
            </DropdownButton>
                <Button style={{ whiteSpace: 'nowrap', textAlign: 'center'}} className='mx-3' variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        handleModalRender( null, 'create','Group Class');
                    }}
                >
                    <i className="fas fa-plus-circle"></i> Group
                </Button>
                <Button style={{ whiteSpace: 'nowrap', textAlign: 'center'}}  className='mx-3' variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        handleModalRender( null, 'create','Classic Class');
                    }}
                >
                    <i className="fas fa-plus-circle"></i> Recorded
                </Button>
                <Button style={{ whiteSpace: 'nowrap', textAlign: 'center'}}  className='mx-3' variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        handleModalRender( null, 'create','Custom Fitness');
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Custom
                </Button>
                <Button style={{ whiteSpace: 'nowrap', textAlign: 'center'}}  className='mx-3' variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        handleModalRender( null, 'create','Live Stream Channel');
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Live Stream
                </Button>
                <Button style={{ whiteSpace: 'nowrap', textAlign: 'center'}}  className='mx-3' variant={true ? "outline-secondary" : "light"} size="sm"
                    onClick={() => {
                        handleModalRender( null, 'create', 'Cohort');
                    }}
                >
                    <i className="fas fa-plus-circle"></i>{" "}Cohort
                </Button>
            </div>
            <Container>
                <Row>
                    <Col>
                        <Card.Title className="text-center">
                            <CreateEditViewChannel ref={createEditViewChannelRef} callback={refetchQueryCallback}></CreateEditViewChannel>
                            <CreateEditViewCohort ref={createEditViewCohortRef} callback={refetchQueryCallback}></CreateEditViewCohort>
                            <CreateEditViewPersonalTraining ref={createEditViewPersonalTrainingRef} callback={refetchQueryCallback}/>
                            <CreateEditViewOnDemandPt ref={CreateEditViewOnDemandPtRef}  callback={refetchQueryCallback}/>
                            <CreateEditViewGroupClass ref={CreateEditViewGroupClassRef}  callback={refetchQueryCallback}/>
                            <CreateEditViewClassicClass ref={CreateEditViewClassicClassRef} callback={refetchQueryCallback}/>
                            <CreateEditViewCustomFitness ref={CreateEditViewCustomFitnessRef} callback={refetchQueryCallback}/>
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={dataTable} />
        </TabContent>
    );
}
