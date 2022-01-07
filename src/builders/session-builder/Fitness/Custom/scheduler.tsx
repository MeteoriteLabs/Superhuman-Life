import React, {useState, useEffect, useContext} from 'react';
import { GET_TABLEDATA, GET_ALL_CLIENT_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import {UPDATE_USERPACKAGE_EFFECTIVEDATE} from '../../graphQL/mutation';
import { useQuery, useMutation } from '@apollo/client';
import {Row, Col, Dropdown, Modal, InputGroup, FormControl, Button} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import AuthContext from '../../../../context/auth-context';
import {Link} from 'react-router-dom';
import '../Group/actionButton.css';

import '../fitness.css';

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);   
    const [userPackage, setUserPackage] = useState<any>([]);
    const [tagSeperation, setTagSeperation] = useState<any>([]);
    const [editDatesModal, setEditdatesModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [statusDays, setStatusDays] = useState();
    let programIndex;

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show]);

    const handleCloseDatesModal = () => setEditdatesModal(false);
    const handleShowDatesModal = () => setEditdatesModal(true);

    const [updateDate] = useMutation(UPDATE_USERPACKAGE_EFFECTIVEDATE);

    const { data: data1 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    });

    const { data: data2 } = useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Custom Fitness'
        },
        onCompleted: () => loadData()
    });

    function handleEventsSeperation(data: any, rest_days: any){
        var ptonline: number = 0;
        var ptoffline: number = 0;
        var grouponline: number = 0;
        var groupoffline: number = 0;
        var classic: number = 0;
        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].tag === 'Personal Training'){
                    if(data[i].mode === 'Online'){
                        ptonline++;
                    }else{
                        ptoffline++;
                    }
                }else if(data[i].tag === 'Group Class'){
                    if(data[i].mode === 'Online'){
                        grouponline++;
                    }else{
                        groupoffline++;
                    }
                }else if(data[i].tag === 'Classic'){
                    classic++;
                }
            }
            setTagSeperation([ptonline, ptoffline, grouponline, groupoffline, classic]);
            var arr: any = [];
            for(var j=0; j<data.length; j++){
                if(arr.includes(parseInt(data[j].day)) === false) arr.push(parseInt(data[j].day));
            }

            var restDays = rest_days === null ? 0 : rest_days.length;
            setStatusDays(arr.length + restDays);
        }
    }

    function loadData() {
        setData(
            [...data1.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines.map((val: any) => {
                        return val.disciplinename;
                    }).join(", "),
                    level: detail.level,
                    events: handleEventsSeperation(detail.events, detail.rest_days),
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: detail.rest_days
                }
            })
        )

        setUserPackage(
            [...data2.userPackages].map((packageItem) => {
                let renewDay: any = '';
                if (packageItem.fitnesspackages.length !== 0) {
                    renewDay = new Date(packageItem.effective_date);
                    renewDay.setDate(renewDay.getDate() + packageItem.fitnesspackages[0].duration)
                }
                return {
                    userPackageId: packageItem.id,
                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    details: [packageItem.fitnesspackages[0].ptonline, packageItem.fitnesspackages[0].ptoffline, packageItem.fitnesspackages[0].grouponline, packageItem.fitnesspackages[0].groupoffline, packageItem.fitnesspackages[0].recordedclasses, packageItem.fitnesspackages[0].restdays],
                    duration: packageItem.fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.effective_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: moment(renewDay).format("MMMM DD,YYYY"),


                    client: packageItem.users_permissions_user.username,
                    clientId: packageItem.users_permissions_user.id,
                    programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
                    programId: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].id,
                    programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
                    programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : moment(renewDay).format('MMMM DD,YYYY'),
                }

            })
        )
    }
    
    if(userPackage.length > 0) {
        programIndex = userPackage.findIndex((item) => item.programId === last[0] && item.clientId === last[1]);
    }

    function handleDateEdit(){

        updateDate({
            variables: {
                id: userPackage[programIndex].userPackageId,
                effectiveDate: moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z"
            }
        });

        handleCloseDatesModal();
    }

    function handleTimeFormatting(data: any, duration: number){
        var digits = duration <= 30 ? 2 : 3;
        return (data).toLocaleString('en-US', { minimumIntegerDigits: digits.toString(), useGrouping: false });
    }

    function handleTotalClasses(dataArr: any){
        let sum = 0;
        for(var i=0; i<dataArr.length; i++){
            sum += dataArr[i];
        }
        return sum;
    }

    function handleAssignedClasses(dataArr: any, restDays: any){
        let sum = 0;
        for(var i=0; i<dataArr.length; i++){
            sum += dataArr[i];
        }
        return sum + restDays;
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
                                <span className="ml-4">{data[0].duration + " days"}</span>
                                <div className="ml-3" style={{ borderLeft: '1px solid black', height: '20px' }}></div>
                                <span className="ml-4">{"Level: " + data[0].level}</span>
                            </Row>
                            <Row>
                                <Col lg={4} className="pl-0 pr-0">
                                <Col className="ml-1 mt-3" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                    <Row>
                                        <h5><b>Client</b></h5>
                                    </Row>
                                <Col lg={{ offset: 4}}>
                                    <Row >
                                    <div className="ml-4">
                                        <img src="https://picsum.photos/200/100" alt="pic" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                    </div>
                                    </Row>
                                    <Row className="mt-1">
                                        <span className="text-capitalize"><b style={{ color: 'gray'}}>{userPackage[programIndex].client}</b></span>
                                    </Row>
                                </Col>
                                </Col>
                                </Col>
                                <Col lg={7} className="mt-4 ml-2">
                                        <div className="mb-4 mt-4">
                                            <Row>
                                                <Col lg={1}>
                                                    <span>Date:</span>
                                                </Col>
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 ml-2 scheduler-badge">{userPackage[programIndex].effectiveDate}</span>
                                                </Col>
                                                    to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">{userPackage[programIndex].packageRenewal}</span>
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
                                                <span>{userPackage[programIndex].details[0]} PT</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[0] === 0 ? handleTimeFormatting(0, data[0].duration) : handleTimeFormatting(tagSeperation[0], data[0].duration)}</b></span>
                                            </div>
                                            : ""}
                                        {userPackage[programIndex].details[1] !== null && userPackage[programIndex].details[1] !== 0 ?
                                            <div>
                                                <img src='/assets/custompersonal-training-Offline.svg' alt="PT-Offline" /><br/>
                                                <span>{userPackage[programIndex].details[1]} PT</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[1] === 0 ? handleTimeFormatting(0, data[0].duration) : handleTimeFormatting(tagSeperation[1], data[0].duration)}</b></span>
                                            </div> : ""}
                                        {userPackage[programIndex].details[2] !== null && userPackage[programIndex].details[2] !== 0 ?
                                            <div>
                                                <img src='/assets/customgroup-Online.svg' alt="Group-Online" /><br/>
                                                <span>{userPackage[programIndex].details[2]} Group</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[2] === 0 ? handleTimeFormatting(0, data[0].duration) : handleTimeFormatting(tagSeperation[2], data[0].duration)}</b></span>
                                            </div> : ""}
                                        {userPackage[programIndex].details[3] !== null && userPackage[programIndex].details[3] !== 0 ?
                                            <div>
                                                <img src='/assets/customgroup-Offline.svg' alt="GRoup-Offline" /><br/>
                                                <span>{userPackage[programIndex].details[3]} Group</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[3] === 0 ? handleTimeFormatting(0, data[0].duration): handleTimeFormatting(tagSeperation[3], data[0].duration)}</b></span>
                                            </div> : ""}
                                        {userPackage[programIndex].details[4] !== null && userPackage[programIndex].details[4] !== 0 ?
                                            <div>
                                                <img src='/assets/customclassic.svg' alt="Classic" /><br/>
                                                <span>{userPackage[programIndex].details[4]} Classic</span><br/>
                                                <span><b>{tagSeperation === [] || tagSeperation[4] === 0 ? handleTimeFormatting(0, data[0].duration) : handleTimeFormatting(tagSeperation[4], data[0].duration)}</b></span>
                                            </div> : ""}
                                        </Row>
                                        <Row>
                                            
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span><b style={{ color: 'gray'}}>Status:</b> {statusDays === undefined ? 0 : statusDays}/{data[0].duration} days</span>
                                    </Col>
                                    <Col>
                                        <span><b style={{ color: 'gray'}}>Rest-Days:</b> {userPackage[programIndex].details[5]} days</span>
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
                            days={data[0].duration} 
                            restDays={data[0].restDays}
                            totalClasses={handleTotalClasses(userPackage[programIndex].details)}
                            assignedClasses={handleAssignedClasses(tagSeperation, userPackage[programIndex].details[5])} 
                            programId={last[0]} 
                            startDate={userPackage[programIndex].effectiveDate}
                        />
                    </div>
                </Col>
            </Row>
            <Modal show={editDatesModal} onHide={handleCloseDatesModal}>
                <Modal.Body>
                    <label>Edit Start Date: </label>
                <InputGroup className="mb-3">
                    <FormControl
                        value={startDate === "" ? moment(userPackage[programIndex].effectiveDate).format("YYYY-MM-DD") : startDate}
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