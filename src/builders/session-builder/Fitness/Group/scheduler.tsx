import React, {useState, useEffect, useRef, useContext} from 'react';
import { GET_TABLEDATA, GET_ALL_FITNESS_PACKAGE_BY_TYPE, GET_ALL_PROGRAM_BY_TYPE, GET_ALL_CLIENT_PACKAGE} from '../../graphQL/queries';
import {UPDATE_STARTDATE} from '../../graphQL/mutation';
import { useQuery, useMutation } from '@apollo/client';
import {Row, Col, Button, Dropdown, Modal, InputGroup, FormControl} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import '../fitness.css';
import FitnessAction from '../FitnessAction';
import AuthContext from '../../../../context/auth-context';

import './actionButton.css';

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);   
    const [userPackage, setUserPackage] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState(false);
    const [startDate, setStartDate] = useState("");

    let programIndex;
    
    const fitnessActionRef = useRef<any>(null);
    
    const handleCloseDatesModal = () => setEditdatesModal(false);
    const handleShowDatesModal = () => setEditdatesModal(true);

    const [updateDate] = useMutation(UPDATE_STARTDATE, {onCompleted: (r: any) => {console.log(r)}});

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500)
    }, [show]);

    const { data: data4 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    });

    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },

    });

    const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },

    });

    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Group Class'
        },
        onCompleted: () => loadData()
    })

    const loadData = () => {

        setData(
            [...data4.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    level: detail.level,
                    sdate: detail.start_dt,
                    edate: detail.end_dt,
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: detail.rest_days
                }
            })
        );
        let arrayFitnessPackage: any[] = [];
        let arrayData: any[] = []

        let fitnessProgramItem: any = {};
        for (let i = 0; i < data1?.fitnesspackages.length; i++) {
            for (let j = 0; j < data2?.programManagers.length; j++) {
                if (data1.fitnesspackages[i].id === data2.programManagers[j].fitnesspackages[0].id) {
                    fitnessProgramItem.proManagerFitnessId = data2.programManagers[j].fitnessprograms[0].id;
                    fitnessProgramItem.title = data2.programManagers[j].fitnessprograms[0].title;
                    fitnessProgramItem.published_at = data2.programManagers[j].fitnessprograms[0].published_at
                    fitnessProgramItem.proManagerId = data2.programManagers[j].id;

                    arrayData.push({ ...data1.fitnesspackages[i], ...fitnessProgramItem });
                }
            }
        }

        let arrayA = arrayData.map(item => item.id);

        const filterPackage = data1?.fitnesspackages.filter((item: { id: string; }) => !arrayA.includes(item.id));
        filterPackage.forEach(item => {
            arrayData.push(item)
        })

        for (let i = 0; i < arrayData.length; i++) {
            for (let j = 0; j < data3.userPackages.length; j++) {
                if (data3.userPackages[j].program_managers.length > 0) {
                    if (arrayData[i].proManagerFitnessId === data3.userPackages[j].program_managers[0].fitnessprograms[0].id) {
                        arrayFitnessPackage.push({ ...arrayData[i], ...data3.userPackages[j].users_permissions_user });
                    } else {
                        arrayFitnessPackage.push(arrayData[i]);
                        break;
                    }
                }
            }
        }

        setUserPackage(
            [...arrayFitnessPackage.map((packageItem) => {
                return {
                    id: packageItem.id,
                    packageName: packageItem.packagename,
                    duration: packageItem.duration,
                    expiry: moment(packageItem.expiry_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.Status ? "Active" : "Inactive",

                    proManagerId: packageItem.proManagerId,
                    proManagerFitnessId: packageItem.proManagerFitnessId,
                    client: packageItem.username ? packageItem.username : "N/A",
                    time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
                    programName: packageItem.title ? packageItem.title : "N/A",
                    programStatus: packageItem.username ? "Assigned" : "N/A",
                    renewal: packageItem.title ? "25/08/2021" : "N/A",
                }
            })]
        )
    }

    let arr: any = []
    for (let i = 0; i < userPackage.length - 1; i++) {
        if (userPackage[i].id === userPackage[i + 1].id) {
            if (userPackage[i].proManagerFitnessId === userPackage[i + 1].proManagerFitnessId) {
                if (typeof userPackage[i].client === "string") {
                    arr[0] = userPackage[i].client;
                };
                arr.push(userPackage[i + 1].client);
                userPackage[i + 1].client = arr
                userPackage.splice(i, 1);
                i--;
            }
        }
    }

    if(userPackage.length > 0){ 
        programIndex = userPackage.findIndex(item => item.proManagerId === last[1] && item.proManagerFitnessId === last[0]);
    }
    
    function handleDateEdit(){

        let edate = moment(startDate).add(moment(data[0].edate).diff(data[0].sdate, 'days'), 'days');

        updateDate({
            variables: {
                id: last[0],
                startDate: moment(startDate).format("YYYY-MM-DD"),
                endDate: moment(edate).format("YYYY-MM-DD") 
            }
        });

        handleCloseDatesModal();
        
    }

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>
            <Row>
                <Col lg={11} className="p-4 shadow-lg bg-white" style={{ borderRadius: '10px'}}>
                    <Row>
                        <Col lg={8}>
                            <Row>
                                <h3 className="text-capitalize">{data[0].programName}</h3>
                            </Row>
                            <Row>
                                <span>{userPackage[programIndex].packageName}</span>
                                <div className="ml-3 mt-1" style={{ borderLeft: '1px solid black', height: '20px' }}></div>
                                <span className="ml-4">{moment(data[0].edate).diff(data[0].sdate, 'days') + " days"}</span>
                                <div className="ml-3" style={{ borderLeft: '1px solid black', height: '20px' }}></div>
                                <span className="ml-4">{"Level: " + data[0].level}</span>
                            </Row>
                             <Row>
                                <Col lg={4} className="pl-0 pr-0">
                                <Col className="ml-1 mt-3" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                    <Row>
                                        <h5><b>Clients</b></h5>
                                    </Row>
                                <Col lg={{ offset: 2}}>
                                    <Row className="">
                                    <div className="text-center ml-2">
                                        {userPackage[programIndex].client === "N/A" ? <div className="mb-0"></div>:
                                            userPackage[programIndex].client.slice(0,4).map((item, index) => {
                                                let postionLeft = 8;
                                                return (
                                                    <img
                                                        key={index}
                                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                        className='position-absolute'
                                                    />
                                                )
                                            })}                                        
                                        <Button onClick={() => {
                                            fitnessActionRef.current.TriggerForm({ id: last[1], actionType: 'allClients', type: "Group Class" })
                                        }} style={{ marginLeft: '120px'}} variant="outline-primary">All clients</Button>
                                    </div>
                                    </Row>
                                    <Row className="mt-1 ml-1">
                                        <span className="text-capitalize"><b style={{ color: 'gray'}}>{userPackage[programIndex].client === "N/A" ? 0 : userPackage[programIndex].client.length} people</b></span>
                                    </Row>
                                </Col>
                                </Col>
                                </Col>
                                <Col lg={7} className="mt-4 ml-2">
                                        <div className="mb-4">
                                            <Row>
                                                <Col lg={1}>
                                                    <span>Date:</span>
                                                </Col>
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 ml-2 scheduler-badge">{moment(data[0].sdate).format("MMMM DD, YY")}</span>
                                                </Col>
                                                    to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">{moment(data[0].edate).format("MMMM DD, YY")}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <Row>
                                                <Col lg={1}>
                                                    <span>Time:</span>
                                                </Col>
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">8:00 am</span>
                                                </Col>
                                                    to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">7:00 pm</span>
                                                </Col>
                                            </Row>
                                        </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={3} xs={11} style={{ borderLeft: '2px dashed gray'}}>
                        <div className="m-2 ml-2 text-center p-2" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                <h4><b>Movement</b></h4>
                                <Row style={{ justifyContent: 'space-between' }}>
                                    <Col>
                                    <img
                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                        style={{ width: '40px', height: '40px', borderRadius: '50%'}}
                                    /><br/>
                                    <span>20 Recorded</span><br/>
                                    <span><b>05</b></span><br/>
                                    </Col>
                                    <Col>
                                    <img
                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                        style={{ width: '40px', height: '40px', borderRadius: '50%'}}
                                    /><br/>
                                    <span>20 Recorded</span><br/>
                                    <span><b>05</b></span><br/>
                                    </Col>
                                </Row>
                                <span><b style={{ color: 'gray'}}>Left to assign:</b> 7/{moment(data[0].edate).diff(data[0].sdate, 'days') + " days"}</span>
                           </div>
                        </Col> 
                        <Dropdown className="ml-5">
                            <Dropdown.Toggle id="dropdown-basic" as="button" className="actionButtonDropDown">
                                <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Edit Details</Dropdown.Item>
                                <Dropdown.Item onClick={handleShowDatesModal}>Edit Dates</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                </Col> 
            </Row>
            <Row>
                <Col lg={11} className="pl-0 pr-0">
                    <div className="mt-5">
                        <SchedulerPage type="date" days={moment(data[0].edate).diff(data[0].sdate, 'days')} restDays={data[0].restDays} programId={last[0]} startDate={moment(data[0].sdate).format("MMMM DD,YYYY")}/>
                    </div>
                </Col>
                <FitnessAction ref={fitnessActionRef} />
            </Row>
            <Modal show={editDatesModal} onHide={handleCloseDatesModal}>
                <Modal.Body>
                    <label>Edit Start Date: </label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={startDate === "" ? data[0].sdate : startDate}
                        onChange={(e) => {setStartDate(e.target.value)}}
                        type="date"
                    />
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="outline-danger" onClick={handleCloseDatesModal}>
                    Close
                </Button>
                <Button variant="outline-success" disabled={startDate === "" ? true : false} onClick={() => { handleDateEdit()}}>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Scheduler;;