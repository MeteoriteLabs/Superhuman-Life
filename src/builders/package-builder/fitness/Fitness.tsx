import { useMemo, useState, useContext, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Badge, Button, Card, Col, Container, Form, Row, TabContent } from "react-bootstrap";
import Table from "../../../components/table";
import AuthContext from "../../../context/auth-context";
import './fitness.css'
import _ from 'lodash'
import ActionButton from "../../../components/actionbutton";

import CreateEditFitness from "./personal-training/createoredit-fitness";
import { GET_FITNESS } from "./graphQL/queries";


export default function FitnessTab(props) {
    const auth = useContext(AuthContext);

    const createEditPackage = useRef<any>(null);
    const [selectedDuration, setSelectedDuration] = useState<any>('');
    const [currentIndex, setCurrentIndex] = useState<any>('');

    useEffect(() => {

    }, [])
    console.log('selectedDuration', selectedDuration);
    console.log('currentIndex', currentIndex)

    const columns = useMemo<any>(() => [
        { accessor: "packagename", Header: "Package Name" },
        { accessor: "type", Header: "Type" },
        {
            accessor: "details", Header: "Details",
            Cell: ({ row }: any) => {
                return <div className='d-flex justify-content-center align-items-center'>
                    {row.values.details[0] !== null && row.values.details[0] !== 0 ?
                        <div>
                            <img src='./assets/PT-Online.svg' alt="PT-Online" />
                            <p>{row.values.details[0] * currentIndex[row.index]}</p>
                        </div>
                        : ""}
                    {row.values.details[1] !== null && row.values.details[1] !== 0 ?
                        <div>
                            <img src='./assets/PT-Offline.svg' alt="PT-Offline" />
                            <p>{row.values.details[1] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[2] !== null && row.values.details[2] !== 0 ?
                        <div>
                            <img src='./assets/Group-Online.svg' alt="Group-Online" />
                            <p>{row.values.details[2] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[3] !== null && row.values.details[3] !== 0 ?
                        <div>
                            <img src='./assets/Group-Offline.svg' alt="GRoup-Offline" />
                            <p>{row.values.details[3] * currentIndex[row.index]}</p>
                        </div> : ""}
                    {row.values.details[4] !== null && row.values.details[4] !== 0 ?
                        <div>
                            <img src='./assets/Classic.svg' alt="Classic" />
                            <p>{row.values.details[4] * currentIndex[row.index]}</p>
                        </div> : ""}
                </div>
            }
        },
        {
            accessor: "duration", Header: "Duration",
            Cell: ({ row }: any) => {
                // console.log('current row', row)
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
            Cell: ({ row }: any) => (
                <ActionButton
                    action1="Edit"
                    actionClick1={() => { createEditPackage.current.TriggerForm({ id: row.original.id, actionType: 'edit' }) }}
                    action2="View"
                    actionClick2={() => { createEditPackage.current.TriggerForm({ id: row.original.id, actionType: 'view' }) }}
                    action3="Status"
                    actionClick3={() => { createEditPackage.current.TriggerForm({ id: row.original.id, actionType: 'toggle-status', current_status: (row.original.status === "Active") }) }}
                    action4="Delete"
                    actionClick4={() => { createEditPackage.current.TriggerForm({ id: row.original.id, actionType: 'delete' }) }}
                />
            ),
        }
    ], [selectedDuration, currentIndex]);

    const [dataTable, setDataTable] = useState<any>([]);


    const FetchData = () => {
        useQuery(GET_FITNESS, {
            variables: { id: auth.userid },
            onCompleted: (data) => loadData(data)
        });
    }

    const loadData = (data: any) => {
        console.log('query data', data)
        setDataTable(
            [...data.fitnesspackages].map(item => {
                return {
                    packagename: item.packagename,
                    type: item.fitness_package_type.type,
                    details: [item.ptonline, item.ptoffline, item.grouponline, item.groupoffline, item.recordedclasses],
                    duration: item.fitnesspackagepricing[0].packagepricing.map(i => i.duration),
                    mrp: item.fitnesspackagepricing[0].packagepricing.map(i => i.mrp),
                    Status: item.Status ? "Active" : "Inactive",
                }
            })
        )
        setSelectedDuration(new Array(data.fitnesspackages.length).fill(0));
        setCurrentIndex(new Array(data.fitnesspackages.length).fill(1))
    }
    console.log(dataTable)
    FetchData()


    return (
        <TabContent>
            <Container>
                <Row>
                    <Col>
                        <Card.Title className="text-center">
                            <Button variant={true ? "outline-secondary" : "light"} size="sm"
                                onClick={() => {
                                    createEditPackage.current.TriggerForm({ id: null, actionType: 'create' });
                                }}
                            >
                                <i className="fas fa-plus-circle"></i>{" "}Create PT Package
                            </Button>
                            <CreateEditFitness ref={createEditPackage}></CreateEditFitness>
                        </Card.Title>
                    </Col>
                </Row>
            </Container>
            <Table columns={columns} data={dataTable} />
        </TabContent>
    );
}
