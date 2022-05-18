/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useContext} from 'react';
import { GET_TABLEDATA, GET_ALL_FITNESS_PACKAGE_BY_TYPE, GET_ALL_PROGRAM_BY_TYPE, GET_ALL_CLIENT_PACKAGE, GET_TAG_BY_ID } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import {Row, Col, Button, Dropdown} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import AuthContext from '../../../../context/auth-context';
import { Link } from 'react-router-dom';

import { flattenObj } from '../../../../components/utils/responseFlatten';
import '../Group/actionButton.css'

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState(false);
    // const [totalClasses, setTotalClasses] = useState<any>([]);
    const [tag, setTag] = useState<any>();
    let programIndex;

    const fitnessActionRef = useRef<any>(null);
    
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show]);

    useQuery(GET_TAG_BY_ID, { variables: {id: tagId}, onCompleted: (data) => loadTagData(data) });

    function loadTagData(data: any){
        const flattenData = flattenObj({...data});
        let total = [0];
        const values = [...flattenData.tags[0]?.sessions];
        for(let i = 0; i < values.length; i++){
            if(values[i].tag === "Classic"){
                total[0] += 1;
            }
        }
        // setTotalClasses(total);
        setTag(flattenData.tags[0]);
    }

    function calculateLastSession(sessions) {
        if(sessions.length === 0){
            return "N/A"
        }

        let moments = sessions.map(d => moment(d.session_date)),
        maxDate = moment.max(moments)

        return maxDate.format('MMM Do,YYYY');
    }

    function calculateDuration(sd: any, ed: any){
        let start = moment(sd);
        let end = moment(ed);
        return end.diff(start, 'days') + 1;
    }

    function calculateDailySessions(sessions){
        const dailySessions = sessions.filter((ses: any) => ses.session_date === moment().format('YYYY-MM-DD'));
        return dailySessions.length >= 1 ? dailySessions.length : 'N/A';
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
                        <Col style={{ borderRight: '2px dotted grey '}}>
                            <Row>
                                <div style={{ top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%, -50%)'}}>
                                    <h3 className="text-center">{tag.fitnesspackage.packagename}</h3>
                                    <span>{moment(tag.fitnesspackage.Start_date).format("DD MMMM, YYYY")}</span>
                                    &nbsp;to&nbsp;
                                    <span>{moment(tag.fitnesspackage.End_date).format("DD MMMM, YYYY")}</span>
                                </div>
                            </Row>
                        </Col>
                        <Col style={{ borderRight: '2px dotted grey '}}>
                            <Row>
                            <Col>
                                    <span><b>Active Subscribers: </b></span>
                                </Col>
                                <Col lg={7}>
                                    <Row style={{ justifyContent: 'center'}}>
                                        <div className='position-relative'>
                                        {tag.client_packages.length === 0 ? <span>N/A</span> : tag.client_packages.slice(0,4).map((item, index) => {
                                            let postionLeft = 8;
                                            return (
                                                <img
                                                    key={index}
                                                    src="https://picsum.photos/200/100" alt='profile-pic'
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                />
                                            )
                                        })}
                                    </div>    
                                    </Row>                      
                                    <Row style={{ justifyContent: 'center'}}>
                                        <span>{tag.client_packages.length} people</span>
                                    </Row>          
                                    <Row style={{ justifyContent: 'center'}}>
                                    <button style={{ border: 'none', backgroundColor: 'white', color: '#006E99', cursor: 'pointer'}} onClick={() => {
                                            fitnessActionRef.current.TriggerForm({ id: last[0], actionType: 'allClients', type: "Cohort" })
                                        }}>View all</button>
                                    </Row>
                                </Col>
                            </Row>
                                <div><b>Status:</b> {tag.fitnesspackage.Status === true ? <span className='text-success'>Active</span> : <span className='text-danger'>Inactive</span>}</div>
                                <br />  
                                <div><b>Level:</b> {tag.fitnesspackage.level}</div>
                                <br />  
                                <div><b>Type:</b> {tag.fitnesspackage.residential_type}</div>
                        </Col>
                        <Col>
                            <Row>
                            <Col lg={8}>
                                <div><b>Last scheduled session:</b> {calculateLastSession(tag.sessions)}</div>
                                <br />     
                                <div><b>No of session daily:</b> {calculateDailySessions(tag.sessions)}</div>
                                <br />      
                                <div><b>Program Status:</b> {tag.fitnesspackage.level}</div> 
                            </Col>    
                            <Col className='text-right'>
                                <Dropdown className="ml-5">
                                    <Dropdown.Toggle id="dropdown-basic" as="button" className="actionButtonDropDown">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Not Assignes</Dropdown.Item>
                                        <Dropdown.Item>Pending</Dropdown.Item>
                                        <Dropdown.Item>Scheduled</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            </Row>    
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col lg={11} className="pl-0 pr-0">
                    <div className="mt-5">
                        <SchedulerPage type="date" days={calculateDuration(tag?.fitnesspackage?.Start_date, tag?.fitnesspackage?.End_date)} restDays={tag?.sessions.filter((ses) => ses.type === "restday")} classType={'Cohort'} programId={tagId} startDate={tag?.fitnesspackage?.Start_date} />
                    </div>
                </Col>
                <FitnessAction ref={fitnessActionRef} />
            </Row>
        </>
    );
};

export default Scheduler;