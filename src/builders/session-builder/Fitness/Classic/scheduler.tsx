import React, {useState, useEffect, useRef, useContext} from 'react';
import { GET_TABLEDATA, GET_ALL_FITNESS_PACKAGE_BY_TYPE, GET_ALL_PROGRAM_BY_TYPE, GET_ALL_CLIENT_PACKAGE } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import {Row, Col, Button} from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import AuthContext from '../../../../context/auth-context';

const Scheduler = () => {

    const auth = useContext(AuthContext);
    const last = window.location.pathname.split('/').reverse();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [userPackage, setUserPackage] = useState<any>([]);
    let programIndex;

    const fitnessActionRef = useRef<any>(null);
    
    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show]);

    const { data: data4 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        },
    });

    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Classic Class'
        },

    });

    const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Classic Class'
        },

    });

    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Classic Class'
        },
        onCompleted: (data) => loadData()
    })
        
    function loadData() {
        setData(
            [...data4.fitnessprograms].map((detail) => {
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

        const arrayData: any[] = []

        let fitnessProgramItem: any = {};
        for (let i = 0; i < data1?.fitnesspackages.length; i++) {
            for (let j = 0; j < data2?.programManagers.length; j++) {
            
                if (data1.fitnesspackages[i].id === data2.programManagers[j].fitnesspackages[0].id) {
                    fitnessProgramItem.proManagerFitnessId = data2.programManagers[j].fitnessprograms[0].id;
                    fitnessProgramItem.title = data2.programManagers[j].fitnessprograms[0].title;
                    fitnessProgramItem.published_at = data2.programManagers[j].fitnessprograms[0].published_at;
                    fitnessProgramItem.proManagerId = data2.programManagers[j].id;

                    arrayData.push({ ...data1.fitnesspackages[i], ...fitnessProgramItem });
                }
             
            }
        }

        const arrayA = arrayData.map(item => item.id);

        const filterPackage = data1?.fitnesspackages.filter((item: { id: string; }) => !arrayA.includes(item.id));
        filterPackage.forEach(item => {
            arrayData.push(item)
        })     

        const arrayFitnessPackage = arrayData.map(fitnessPackage => {
            let client: string[] = [];

            data3.userPackages.forEach((userPackage: { fitnesspackages: { id: string; }; users_permissions_user: { username: string; }; }) => {
                if (fitnessPackage.id === userPackage.fitnesspackages[0].id) {
                    client.push(userPackage.users_permissions_user.username)
                }
                fitnessPackage = { ...fitnessPackage, client }
            })

            return fitnessPackage
        })

        for (let i = 0; i < arrayFitnessPackage.length - 1; i++) {
            if (arrayFitnessPackage[i].id === arrayFitnessPackage[i + 1].id) {
                arrayFitnessPackage.splice(arrayFitnessPackage[i], 1)
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
                    client: packageItem.client ? packageItem.client : "N/A",
                    time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
                    programName: packageItem.title ? packageItem.title : "N/A",
                    programStatus: packageItem.client.length > 0 ? "Assigned" : "N/A",
                    renewal: packageItem.title ? "25/08/2021" : "N/A",
                }
            })]
        )
    }

    if(userPackage.length > 0){
        programIndex = userPackage.findIndex(item => item.id === last[1] && item.proManagerFitnessId === last[0])
    }

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <>
            <Row>
                <Col lg={11} className="p-4 shadow-lg bg-white" style={{ borderRadius: '10px'}}>
                    <Row>
                        <Col xs={11} lg={6} className="pl-4" style={{paddingRight: '20%' }}>
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
                            <Row className="p-1 mt-2" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                <Col lg={12} className="pl-0 pr-0">
                                <Col>
                                    <Row>
                                        <h5><b>Clients</b></h5>
                                    </Row>
                                <Col lg={{ offset: 4}}>
                                    <Row>
                                    <div className='position-relative'>
                                        {userPackage[programIndex].client.slice(0,4).map((item, index) => {
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
                                            fitnessActionRef.current.TriggerForm({ id: last[1], actionType: 'allClients', type: "Classic Class" })
                                        }} style={{ marginLeft: '150px'}} variant="outline-primary">All clients</Button>
                                        </div>
                                    </Row>
                                    <Row className="mt-1">
                                        <span>{userPackage[programIndex].client.length} people</span>
                                    </Row>
                                </Col>
                                </Col>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={5} xs={11}  className="ml-5" style={{ borderLeft: '2px dashed gray'}}>
                           <div className="m-2 ml-5 text-center p-2" style={{ border: '2px solid gray', borderRadius: '10px'}}>
                                <h4><b>Movement</b></h4>
                                <img
                                    src="https://picsum.photos/200/100" alt='profile-pic'
                                    style={{ width: '40px', height: '40px', borderRadius: '50%'}}
                                /><br/>
                                <span>20 Recorded</span><br/>
                                <span><b>05</b></span><br/>
                                <span><b style={{ color: 'gray'}}>Left to assign:</b> 7/{data[0].duration}</span>
                           </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col lg={11} className="pl-0 pr-0">
                    <div className="mt-5">
                        <SchedulerPage type="day" days={data[0].duration} restDays={data[0].restDays} programId={last[0]} />
                    </div>
                </Col>
                <FitnessAction ref={fitnessActionRef} />
            </Row>
        </>
    );
};

export default Scheduler;;