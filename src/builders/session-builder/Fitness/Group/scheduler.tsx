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
import {Link} from 'react-router-dom';
import TimePicker from 'rc-time-picker';

import 'rc-time-picker/assets/index.css';
import './actionButton.css';

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);   
    const [userPackage, setUserPackage] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState(false);
    const [editTimeModal, setEditTimeModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    // const [editTime, setEditTime] = useState<any>({});
    const [tagSeperation, setTagSeperation] = useState<any>([]);
    const [statusDays, setStatusDays] = useState();

    let programIndex;
    
    const fitnessActionRef = useRef<any>(null);
    
    const handleCloseDatesModal = () => setEditdatesModal(false);
    const handleShowDatesModal = () => setEditdatesModal(true);

    const handleCloseTimeModal = () => setEditTimeModal(false);
    const handleShowTimeModal = () => setEditTimeModal(true);

    const [updateDate] = useMutation(UPDATE_STARTDATE);
    // const [updateTime] = useMutation(UPDATE_FITNESSPACKAGE_GROUP_TIME);

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
    });

    function handleEventsSeperation(data: any, rest_days: any){
        var grouponline: number = 0;
        var groupoffline: number = 0;
        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].tag === 'Group Class'){
                    if(data[i].mode === 'Online'){
                        grouponline++;
                    }else{
                        groupoffline++;
                    }
                }
            }
            setTagSeperation([grouponline, groupoffline]);
            var arr: any = [];
            for(var j=0; j<data.length; j++){
                if(arr.includes(parseInt(data[j].day)) === false) arr.push(parseInt(data[j].day));
            }
            var restDays = rest_days === null ? 0 : rest_days.length;
            setStatusDays(arr.length + restDays);
        }
    }

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
                    events: handleEventsSeperation(detail.events, detail.rest_days),
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
                    details: [packageItem.ptonline, packageItem.ptoffline, packageItem.grouponline, packageItem.groupoffline, packageItem.recordedclasses, packageItem.restdays],
                    groupStart: packageItem.groupstarttime,
                    groupEnd: packageItem.groupendtime,
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

    function handleTimeFormatting(data: any, duration: number){
        var digits = duration <= 30 ? 2 : 3;
        return (data).toLocaleString('en-US', { minimumIntegerDigits: digits.toString(), useGrouping: false });
    }
    
    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>
            <div className="mb-3">
                <span style={{ fontSize: '30px'}}>
                    <Link to="/session"><i className="fa fa-arrow-circle-left" style={{ color: 'black'}}></i></Link>
                    <b> back</b>
                </span>
            </div>
            <Row>
                <Col lg={11} className="p-4 shadow-lg bg-white" style={{ borderRadius: '10px'}}>
                    <Row>
                        <Col lg={7}>
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
                                    <Row>
                                    <div className="text-center ml-2">
                                        {userPackage[programIndex].client === "N/A" ? <div className="mb-0"></div>:
                                            userPackage[programIndex].client.slice(0,4).map((item, index) => {
                                                let postionLeft = 8;
                                                return (
                                                    <div>
                                                        <img
                                                            key={index}
                                                            src="https://picsum.photos/200/100" alt='profile-pic'
                                                            style={{ width: '40px', height: '40px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                            className='position-absolute'
                                                        />
                                                    </div>
                                                )
                                            })}                                        
                                        <Button onClick={() => {
                                            fitnessActionRef.current.TriggerForm({ id: last[1], actionType: 'allClients', type: "Group Class" })
                                        }} style={{ marginLeft: '90px'}} variant="outline-primary">All clients</Button>
                                    </div>
                                    </Row>
                                    <Row className="mt-1">
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
                                                    <span className="p-1 scheduler-badge">{userPackage[programIndex].groupStart.slice(0,2) + ":" + userPackage[programIndex].groupStart.slice(2,4)}</span>
                                                </Col>
                                                    to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">{userPackage[programIndex].groupEnd.slice(0,2) + ":" + userPackage[programIndex].groupEnd.slice(2,4)}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={4} xs={11} style={{ borderLeft: '2px dashed gray'}}>
                        <div className="m-2 ml-2 text-center p-2" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                <h4><b>Movement</b></h4>
                                <Row>
                                    <Col>
                                        <Row style={{ justifyContent: 'space-around'}}>
                                        {userPackage[programIndex].details[0] !== null && userPackage[programIndex].details[0] !== 0 ?
                                            <div>
                                                <img src='/assets/custompersonal-training-Online.svg' alt="PT-Online" /><br/>
                                                <span></span>
                                            </div>
                                            : ""}
                                        {userPackage[programIndex].details[1] !== null && userPackage[programIndex].details[1] !== 0 ?
                                            <div>
                                                <img src='/assets/custompersonal-training-Offline.svg' alt="PT-Offline" />
                                            </div> : ""}
                                        {userPackage[programIndex].details[2] !== null && userPackage[programIndex].details[2] !== 0 ?
                                            <div>
                                                <img src='/assets/customgroup-Online.svg' alt="Group-Online" /><br/>
                                                <span>{userPackage[programIndex].details[2]} Group</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[0] === 0 ? handleTimeFormatting(0, moment(data[0].edate).diff(data[0].sdate, 'days')) : handleTimeFormatting(tagSeperation[0], moment(data[0].edate).diff(data[0].sdate, 'days'))}</b></span>
                                            </div> : ""}
                                        {userPackage[programIndex].details[3] !== null && userPackage[programIndex].details[3] !== 0 ?
                                            <div>
                                                <img src='/assets/customgroup-Offline.svg' alt="GRoup-Offline" /><br/>
                                                <span>{userPackage[programIndex].details[3]} Group</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[1] === 0 ? handleTimeFormatting(0, moment(data[0].edate).diff(data[0].sdate, 'days')) : handleTimeFormatting(tagSeperation[1], moment(data[0].edate).diff(data[0].sdate, 'days'))}</b></span>
                                            </div> : ""}
                                        {userPackage[programIndex].details[4] !== null && userPackage[programIndex].details[4] !== 0 ?
                                            <div>
                                                <img src='/assets/customclassic.svg' alt="Classic" />
                                            </div> : ""}
                                        </Row>
                                        <Row>
                                            
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <span><b style={{ color: 'gray'}}>Status: </b> {statusDays === undefined ? 'N/A' : statusDays}/{moment(data[0].edate).diff(data[0].sdate, 'days') + " days"}</span>        
                                    </Col>
                                    <Col lg={6}>
                                        <span><b style={{ color: 'gray'}}>Rest-Days: </b> {userPackage[programIndex].details[5]} days</span>
                                    </Col>
                                </Row>
                           </div>
                        </Col> 
                        <Dropdown className="ml-5">
                            <Dropdown.Toggle id="dropdown-basic" as="button" className="actionButtonDropDown">
                                <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleShowDatesModal}>Edit Dates</Dropdown.Item>
                                <Dropdown.Item onClick={handleShowTimeModal}>Edit Time</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                </Col> 
            </Row>
            <Row>
                <Col lg={11} className="pl-0 pr-0">
                    <div className="mt-5">
                        <SchedulerPage 
                            type="date" 
                            days={moment(data[0].edate).diff(data[0].sdate, 'days')} 
                            restDays={data[0].restDays} programId={last[0]} 
                            startDate={moment(data[0].sdate).format("MMMM DD,YYYY")}
                        />
                    </div>
                </Col>
                <FitnessAction ref={fitnessActionRef} />
            </Row>
            {
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
            }{
                <Modal show={editTimeModal} onHide={handleCloseTimeModal}>
                    <Modal.Body>
                        <label>Edit Group Start Time: </label>
                        <Row>
                                <Col lg={4}>
                                    <TimePicker showSecond={false} minuteStep={15} onChange={(e) => {}}/>
                                </Col>
                        </Row>
                        <label>Edit Group End Time: </label>
                        <Row>
                                <Col lg={4}>
                                    <TimePicker showSecond={false} minuteStep={15} onChange={(e) => {}}/>
                                </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="outline-danger" onClick={handleCloseTimeModal}>
                        Close
                    </Button>
                    <Button variant="outline-success" onClick={() => { handleDateEdit()}}>
                        Submit
                    </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default Scheduler;;