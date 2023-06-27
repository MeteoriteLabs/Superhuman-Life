/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useContext } from 'react'
import {
    GET_TABLEDATA,
    GET_ALL_FITNESS_PACKAGE_BY_TYPE,
    GET_ALL_CLIENT_PACKAGE,
    GET_TAG_BY_ID
} from '../../graphQL/queries'
import { useQuery } from '@apollo/client'
import { Row, Col, Button } from 'react-bootstrap'
import SchedulerPage from '../../../program-builder/program-template/scheduler'
import moment from 'moment'
import FitnessAction from '../FitnessAction'
import AuthContext from '../../../../context/auth-context'
import { Link } from 'react-router-dom'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import Loader from '../../../../components/Loader/Loader'

const Scheduler: React.FC = () => {
    const auth = useContext(AuthContext)
    const last = window.location.pathname.split('/').reverse()
    const tagId = window.location.pathname.split('/').pop()
    const [data, setData] = useState<any[]>([])
    const [show, setShow] = useState(false)
    const [userPackage, setUserPackage] = useState<any>([])
    const [tagSeperation, setTagSeperation] = useState<any>([])
    const [statusDays, setStatusDays] = useState()
    const [clientIds, setClientIds] = useState<any>([])
    const [totalClasses, setTotalClasses] = useState<any>([])
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([])
    //im using this session ids from parent only in case of day wise session
    const [sessionIds, setSessionIds] = useState<any>([])
    const [tag, setTag] = useState<any>()
    let programIndex

    const fitnessActionRef = useRef<any>(null)

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 1500)
    }, [show])

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    })

    function loadTagData(data: any) {
        setSchedulerSessions(data)
        const flattenData = flattenObj({ ...data })
        const total = [0]
        const clientValues = [...clientIds]
        const values = [...flattenData.tags[0].sessions]
        const ids = [...sessionIds]
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id)
            if (values[i].tag === 'Classic') {
                total[0] += 1
            }
        }
        setClientIds(clientValues)
        setSessionIds(ids)
        setTotalClasses(total)
        setTag(flattenData.tags[0])
    }

    const { data: data4 } = useQuery(GET_TABLEDATA, {
        variables: {
            id: last[0]
        }
    })

    const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
        variables: {
            id: auth.userid,
            type: 'Classic'
        }
    })

    // const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic'
    //     },

    // });

    const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
        variables: {
            id: auth.userid,
            type: 'Classic'
        },
        onCompleted: (data) => console.log()
    })

    function handleEventsSeperation(data: any, rest_days: any) {
        let classic = 0
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].tag === 'Classic') {
                    classic++
                }
            }
            setTagSeperation([classic])
            const arr: any = []
            for (let j = 0; j < data.length; j++) {
                if (arr.includes(parseInt(data[j].day)) === false) arr.push(parseInt(data[j].day))
            }
            const restDays = rest_days === null ? 0 : rest_days.length
            setStatusDays(arr.length + restDays)
        }
    }

    function loadData() {
        const flattenData1 = flattenObj({ ...data1 })
        // const flattenData2 = flattenObj({ ...data2 });
        const flattenData3 = flattenObj({ ...data3 })
        const flattenData4 = flattenObj({ ...data4 })

        setData(
            [...flattenData4.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.disciplinename
                        })
                        .join(', '),
                    level: detail.level,
                    events: handleEventsSeperation(detail.events, detail.rest_days),
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: detail.rest_days
                }
            })
        )

        const arrayData: any[] = []

        // let fitnessProgramItem: any = {};
        // for (let i = 0; i < flattenData1?.fitnesspackages.length; i++) {
        //     for (let j = 0; j < flattenData2?.programManagers.length; j++) {

        //         if (flattenData1.fitnesspackages[i].id === flattenData2.programManagers[j].fitnesspackages[0].id) {
        //             fitnessProgramItem.proManagerFitnessId = flattenData2.programManagers[j].fitnessprograms[0].id;
        //             fitnessProgramItem.title = flattenData2.programManagers[j].fitnessprograms[0].title;
        //             fitnessProgramItem.published_at = flattenData2.programManagers[j].fitnessprograms[0].published_at;
        //             fitnessProgramItem.proManagerId = flattenData2.programManagers[j].id;

        //             arrayData.push({ ...flattenData1.fitnesspackages[i], ...fitnessProgramItem });
        //         }

        //     }
        // }

        const arrayA = arrayData.map((item) => item.id)

        const filterPackage = flattenData1?.fitnesspackages.filter(
            (item: { id: string }) => !arrayA.includes(item.id)
        )
        filterPackage.forEach((item) => {
            arrayData.push(item)
        })

        const arrayFitnessPackage = arrayData.map((fitnessPackage) => {
            const client: string[] = []

            flattenData3.clientPackages.forEach(
                (userPackage: {
                    fitnesspackages: { id: string }
                    users_permissions_user: { username: string }
                }) => {
                    if (fitnessPackage.id === userPackage.fitnesspackages[0].id) {
                        client.push(userPackage.users_permissions_user.username)
                    }
                    fitnessPackage = { ...fitnessPackage, client }
                }
            )

            return fitnessPackage
        })

        for (let i = 0; i < arrayFitnessPackage.length - 1; i++) {
            if (arrayFitnessPackage[i].id === arrayFitnessPackage[i + 1].id) {
                arrayFitnessPackage.splice(arrayFitnessPackage[i], 1)
            }
        }

        setUserPackage([
            ...arrayFitnessPackage.map((packageItem) => {
                return {
                    id: packageItem.id,
                    packageName: packageItem.packagename,
                    duration: packageItem.duration,
                    details: [
                        packageItem.ptonline,
                        packageItem.ptoffline,
                        packageItem.grouponline,
                        packageItem.groupoffline,
                        packageItem.recordedclasses,
                        packageItem.restdays
                    ],
                    groupStart: packageItem.groupstarttime,
                    groupEnd: packageItem.groupendtime,
                    expiry: moment(packageItem.expiry_date).format('MMMM DD,YYYY'),
                    packageStatus: packageItem.Status ? 'Active' : 'Inactive',

                    proManagerId: packageItem.proManagerId,
                    proManagerFitnessId: packageItem.proManagerFitnessId,
                    client: packageItem.client ? packageItem.client : 'N/A',
                    time: packageItem.published_at
                        ? moment(packageItem.published_at).format('h:mm:ss a')
                        : 'N/A',
                    programName: packageItem.title ? packageItem.title : 'N/A',
                    programStatus: packageItem.client.length > 0 ? 'Assigned' : 'N/A',
                    renewal: packageItem.title ? '25/08/2021' : 'N/A'
                }
            })
        ])
    }

    // if(userPackage.length > 0){
    //     programIndex = userPackage.findIndex(item => item.id === last[1] && item.proManagerFitnessId === last[0])
    // }

    function handleTimeFormatting(data: any, duration: number) {
        const digits = duration <= 30 ? 2 : 3
        return data.toLocaleString('en-US', {
            minimumIntegerDigits: digits.toString(),
            useGrouping: false
        })
    }

    function handleCallback() {
        mainQuery.refetch()
        // setSessionIds([]);
    }

    if (!show) return <Loader />
    else
        return (
            <div className="col-lg-12">
                <div className="mb-3">
                    <span style={{ fontSize: '30px' }}>
                        <Link to="/session">
                            <i className="fa fa-arrow-circle-left" style={{ color: 'black' }}></i>
                        </Link>
                        <b> back</b>
                    </span>
                </div>
                <Row>
                    <Col
                        lg={11}
                        className="p-4 shadow-lg bg-white"
                        style={{ borderRadius: '10px' }}
                    >
                        <Row>
                            <Col xs={11} lg={6} className="pl-4" style={{ paddingRight: '20%' }}>
                                <Row>
                                    <h3 className="text-capitalize">{tag?.tag_name}</h3>
                                </Row>
                                <Row>
                                    <span>{tag.fitnesspackage.packagename}</span>
                                    <div
                                        className="ml-3 mt-1"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {tag.fitnesspackage.duration + ' days'}
                                    </span>
                                    <div
                                        className="ml-3"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">
                                        {'Level: ' + tag.fitnesspackage.level}
                                    </span>
                                </Row>
                                <Row
                                    className="p-1 mt-2"
                                    style={{ border: '2px solid gray', borderRadius: '10px' }}
                                >
                                    <Col lg={12} className="pl-0 pr-0">
                                        <Col>
                                            <Row>
                                                <h5>
                                                    <b>Clients</b>
                                                </h5>
                                            </Row>
                                            <Col lg={{ offset: 4 }}>
                                                <Row>
                                                    <div className="position-relative">
                                                        {tag.client_packages
                                                            .slice(0, 4)
                                                            .map((item, index) => {
                                                                const postionLeft = 8
                                                                return (
                                                                    <img
                                                                        key={index}
                                                                        src="https://picsum.photos/200/100"
                                                                        alt="profile-pic"
                                                                        style={{
                                                                            width: '40px',
                                                                            height: '40px',
                                                                            borderRadius: '50%',
                                                                            left: `${
                                                                                postionLeft * index
                                                                            }%`
                                                                        }}
                                                                        className="position-absolute"
                                                                    />
                                                                )
                                                            })}
                                                        <Button
                                                            onClick={() => {
                                                                fitnessActionRef.current.TriggerForm(
                                                                    {
                                                                        id: last[1],
                                                                        actionType: 'allClients',
                                                                        type: 'Classic'
                                                                    }
                                                                )
                                                            }}
                                                            style={{ marginLeft: '150px' }}
                                                            variant="outline-primary"
                                                        >
                                                            All clients
                                                        </Button>
                                                    </div>
                                                </Row>
                                                <Row className="mt-1">
                                                    <span>{tag.client_packages.length} people</span>
                                                </Row>
                                            </Col>
                                        </Col>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                lg={5}
                                xs={11}
                                className="ml-5"
                                style={{ borderLeft: '2px dashed gray' }}
                            >
                                <div
                                    className="m-2 ml-5 text-center p-2"
                                    style={{ border: '2px solid gray', borderRadius: '10px' }}
                                >
                                    <h4>
                                        <b>Movement</b>
                                    </h4>
                                    <Row>
                                        <Col>
                                            <Row style={{ justifyContent: 'space-around' }}>
                                                <div>
                                                    <img
                                                        src="/assets/customclassic.svg"
                                                        alt="Classic"
                                                    />
                                                    <br />
                                                    <span>
                                                        {tag.fitnesspackage.recordedclasses}{' '}
                                                        Recorded
                                                    </span>
                                                    <br />
                                                    <span>
                                                        <b>
                                                            {handleTimeFormatting(
                                                                totalClasses[0],
                                                                tag.fitnesspackage.duration
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            </Row>
                                            <Row></Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Status: </b>{' '}
                                                {handleTimeFormatting(
                                                    totalClasses[0],
                                                    tag.fitnesspackage.duration
                                                )}
                                                /{tag.fitnesspackage.duration}
                                            </span>
                                        </Col>
                                        <Col>
                                            <span>
                                                <b style={{ color: 'gray' }}>Rest-Days: </b>{' '}
                                                {tag.fitnesspackage.restdays} days
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {/* Scheduler */}
                <Row>
                    <Col lg={11} className="pl-0 pr-0">
                        <div className="mt-5">
                            <SchedulerPage
                                callback={handleCallback}
                                type="day"
                                sessionIds={sessionIds}
                                schedulerSessions={schedulerSessions}
                                clientIds={clientIds}
                                days={tag.fitnesspackage.duration}
                                restDays={tag?.sessions.filter((ses) => ses.type === 'restday')}
                                classType={'Classic Class'}
                                startDate={'2021-05-01'}
                                programId={tagId}
                            />
                        </div>
                    </Col>
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Row>
            </div>
        )
}

export default Scheduler
