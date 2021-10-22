import React, {useState, useEffect, useContext} from 'react';
import { GET_TABLEDATA, GET_ALL_CLIENT_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import {Row, Col, Button} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import AuthContext from '../../../../context/auth-context';

import '../fitness.css';

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);   
    const [userPackage, setUserPackage] = useState<any>([]);
    let programIndex;

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show]);

    const { data: data1 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    });

    const { data: data2 } = useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Personal Training'
        },
        onCompleted: () => loadData()
    });

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
                    id: packageItem.fitnesspackages[0].id,
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.effective_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: moment(renewDay).format("MMMM DD,YYYY"),

                    client: packageItem.users_permissions_user.username,
                    clientId: packageItem.users_permissions_user.id,
                    level: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].level,
                    discipline: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].fitnessdisciplines,
                    description: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].description,
                    programName: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].title,
                    programId: packageItem.program_managers.length === 0 ? 'N/A' : packageItem.program_managers[0].fitnessprograms[0].id,
                    programStatus: packageItem.program_managers.length === 0 ? 'N/A' : "Assigned",
                    programRenewal: packageItem.program_managers.length === 0 ? 'N/A' : moment(renewDay).format('MMMM DD,YYYY')
                }

            })
        )
    }

    if(userPackage.length > 0) {
        programIndex = userPackage.findIndex((item) => item.id === last[1] && item.clientId === last[2]);
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
                                    <Row>
                                    <div className="ml-2">
                                        <img src="https://picsum.photos/200/100" alt="pic" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                        <Button onClick={() => {
                                            // fitnessActionRef.current.TriggerForm({ id: last[1], actionType: 'allClients', type: "Classic Class" })
                                        }} className="ml-4" variant="outline-primary">All clients</Button>
                                    </div>
                                    </Row>
                                    <Row className="mt-1">
                                        <span className="text-capitalize"><b style={{ color: 'gray'}}>{userPackage[programIndex].client}</b></span>
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
                                                    <span className="p-1 ml-2 scheduler-badge">{userPackage[programIndex].effectiveDate}</span>
                                                </Col>
                                                    to
                                                <Col lg={5} className="text-center">
                                                    <span className="p-1 scheduler-badge">{userPackage[programIndex].packageRenewal}</span>
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
                                <span><b style={{ color: 'gray'}}>Left to assign:</b> 3/{data[0].duration}</span>
                           </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col lg={11} className="pl-0 pr-0">
                    <div className="mt-5">
                        <SchedulerPage type="date" days={data[0].duration} restDays={data[0].restDays} programId={last[0]} startDate={userPackage[programIndex].effectiveDate}/>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default Scheduler;;