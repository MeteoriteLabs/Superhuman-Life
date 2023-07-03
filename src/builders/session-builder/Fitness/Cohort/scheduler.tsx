import { useState, useEffect, useRef } from 'react';
import { GET_TAG_BY_ID } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import { Row, Col, Dropdown } from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import { Link } from 'react-router-dom';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import '../Group/actionButton.css';
import Loader from '../../../../components/Loader/Loader';

const Scheduler: React.FC = () => {
    const last = window.location.pathname.split('/').reverse();
    const tagId = window.location.pathname.split('/').pop();
    const [show, setShow] = useState<boolean>(false);
    const [sessionIds, setSessionIds] = useState<any>([]);
    const [clientIds, setClientIds] = useState<any>([]);
    // these are the sessions that will passed onto the scheduler
    const [schedulerSessions, setSchedulerSessions] = useState<any>([]);
    const [tag, setTag] = useState<any>();

    const fitnessActionRef = useRef<any>(null);

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500);
    }, [show]);

    const mainQuery = useQuery(GET_TAG_BY_ID, {
        variables: { id: tagId },
        onCompleted: (data) => loadTagData(data)
    });

    function loadTagData(data: any) {
        setSchedulerSessions(data);
        const flattenData = flattenObj({ ...data });
        const total = [0];
        const clientValues = [...clientIds];
        const values = [...flattenData.tags[0].sessions];
        const ids = sessionIds ? [...sessionIds] : [];
        for (let i = 0; i < values.length; i++) {
            ids.push(values[i].id);
            if (values[i].tag === 'Classic') {
                total[0] += 1;
            }
        }
        setClientIds(clientValues);
        setSessionIds(ids);
        setTag(flattenData.tags[0]);
    }

    function calculateLastSession(sessions) {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((d) => moment(d.session_date)),
            maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    }

    function calculateDuration(sd: any, ed: any) {
        const start = moment(sd);
        const end = moment(ed);
        return end.diff(start, 'days') + 1;
    }

    function calculateDailySessions(sessions) {
        const dailySessions = sessions.filter(
            (ses: any) => ses.session_date === moment().format('YYYY-MM-DD')
        );
        return dailySessions.length ? dailySessions.length : 'N/A';
    }

    function handleCallback() {
        mainQuery.refetch();
    }

    if (!show) return <Loader />;
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
                            <Col style={{ borderRight: '2px dotted grey ' }}>
                                <Row>
                                    <div
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            position: 'absolute',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <h3 className="text-center">
                                            {tag.fitnesspackage.packagename}
                                        </h3>
                                        <span>
                                            {moment(tag.fitnesspackage.Start_date).format(
                                                'DD MMMM, YYYY'
                                            )}
                                        </span>
                                        &nbsp;to&nbsp;
                                        <span>
                                            {moment(tag.fitnesspackage.End_date).format(
                                                'DD MMMM, YYYY'
                                            )}
                                        </span>
                                    </div>
                                </Row>
                            </Col>
                            <Col style={{ borderRight: '2px dotted grey ' }}>
                                <Row>
                                    <Col>
                                        <span>
                                            <b>Active Subscribers: </b>
                                        </span>
                                    </Col>
                                    <Col lg={7}>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <div className="position-relative">
                                                {tag.client_packages.length ? (
                                                    tag.client_packages
                                                        .slice(0, 4)
                                                        .map((item, index: number) => {
                                                            const postionLeft = 8;
                                                            return (
                                                                <img
                                                                    key={index}
                                                                    src="assets/image_placeholder.svg"
                                                                    alt="profile-pic"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        borderRadius: '50%',
                                                                        left: `${
                                                                            postionLeft * index
                                                                        }%`
                                                                    }}
                                                                />
                                                            );
                                                        })
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </div>
                                        </Row>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <span>{tag.client_packages.length} people</span>
                                        </Row>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <button
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'white',
                                                    color: '#006E99',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    fitnessActionRef.current.TriggerForm({
                                                        id: last[0],
                                                        actionType: 'allClients',
                                                        type: 'Cohort'
                                                    });
                                                }}
                                            >
                                                View all
                                            </button>
                                        </Row>
                                    </Col>
                                </Row>
                                <div>
                                    <b>Status:</b>{' '}
                                    {tag.fitnesspackage.Status ? (
                                        <span className="text-success">Active</span>
                                    ) : (
                                        <span className="text-danger">Inactive</span>
                                    )}
                                </div>
                                <br />
                                <div>
                                    <b>Level:</b> {tag.fitnesspackage.level}
                                </div>
                                <br />
                                <div>
                                    <b>Type:</b> {tag.fitnesspackage.residential_type}
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col lg={8}>
                                        <div>
                                            <b>Last scheduled session:</b>{' '}
                                            {calculateLastSession(tag.sessions)}
                                        </div>
                                        <br />
                                        <div>
                                            <b>No of session daily:</b>{' '}
                                            {calculateDailySessions(tag.sessions)}
                                        </div>
                                        <br />
                                        <div>
                                            <b>Program Status:</b> {tag.fitnesspackage.level}
                                        </div>
                                    </Col>
                                    <Col className="text-right">
                                        <Dropdown className="ml-5">
                                            <Dropdown.Toggle
                                                id="dropdown-basic"
                                                as="button"
                                                className="actionButtonDropDown"
                                            >
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
                {/* Scheduler */}
                <Row>
                    <Col lg={11} className="pl-0 pr-0">
                        <div className="mt-5">
                            <SchedulerPage
                                type="date"
                                callback={handleCallback}
                                sessionIds={sessionIds}
                                days={calculateDuration(
                                    tag?.fitnesspackage?.Start_date,
                                    tag?.fitnesspackage?.End_date
                                )}
                                restDays={tag?.sessions.filter((ses) => ses.type === 'restday')}
                                schedulerSessions={schedulerSessions}
                                clientIds={clientIds}
                                classType={'Cohort'}
                                programId={tagId}
                                startDate={tag?.fitnesspackage?.Start_date}
                            />
                        </div>
                    </Col>
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Row>
            </div>
        );
};

export default Scheduler;
