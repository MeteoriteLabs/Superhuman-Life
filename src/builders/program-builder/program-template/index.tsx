import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TABLEDATA } from './queries';
import { Row, Col } from 'react-bootstrap';
import Scheduler from './scheduler';
import SessionContext from 'context/session-context';
import { flattenObj } from 'components/utils/responseFlatten';
import Loader from 'components/Loader/Loader';
import SideNav from './SchedulerSideBar';
import { Link } from 'react-router-dom';

const ProgramManager = () => {
    const last = window.location.pathname.split('/').pop();
    const [data, setData] = useState<any[]>([]);
    const [show, setShow] = useState(false);
    const [sessionIds, setSessionIds] = useState<any[]>([]);
    const [collapse, setCollapse] = useState<boolean>(true);
    const [accordionExpanded, setAccordionExpanded] = useState(true);
    const [show24HourFormat, setShow24HourFormat] = useState(false);
    const ref = useRef<any>(null);

    const handleScrollScheduler = () => {
        ref.current?.scrollIntoView({ behaviour: 'smooth', inline: 'nearest' });
        window.scrollBy(0, -200);
    };

    const handleAccordionToggle = () => {
        setAccordionExpanded(!accordionExpanded);
    };

    const [program, setProgram] = useState('none');
    const [sessionFilter, setSessionFilter] = useState('none');
    const [showRestDay, setShowRestDay] = useState<boolean>(false);

    // function handleCallback() {
    //     mainQuery.refetch();
    // }

    function handleFloatingActionProgramCallback(event: any) {
        setProgram(`${event}`);
        handleScrollScheduler();
        handleCallback();
    }

    function handleFloatingActionProgramCallback2(event: any) {
        handleScrollScheduler();
        handleCallback();
        setSessionFilter(`${event}`);
    }

    function handleRefetch() {
        handleCallback();
    }

    function handleShowRestDay() {
        setShowRestDay(!showRestDay);
        handleScrollScheduler();
    }

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1500);
    }, [show]);

    const mainQuery = useQuery(GET_TABLEDATA, { variables: { id: last }, onCompleted: loadData });

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });
        const restDayData = flattenData.fitnessprograms[0].sessions.filter(
            (session: any) => session.Is_restday === true
        );
        const sessionData = flattenData.fitnessprograms[0].sessions.filter(
            (val: any) => !restDayData.includes(val)
        );
        const values = [...sessionIds];
        flattenData.fitnessprograms[0].sessions.forEach((program: any) => {
            values.push(program.id);
        });
        setData(
            [...flattenData.fitnessprograms].map((detail) => {
                return {
                    id: detail.id,
                    programName: detail.title,
                    discipline: detail.fitnessdisciplines
                        .map((val: any) => {
                            return val.disciplinename;
                        })
                        .join(', '),
                    level: detail.level,
                    duration: detail.duration_days,
                    details: detail.description,
                    restDays: restDayData,
                    sessions: sessionData
                };
            })
        );
        setSessionIds(values);
    }

    function handleCallback() {
        mainQuery.refetch();
        setSessionIds([]);
    }

    if (!show) return <Loader />;
    else
        return (
            <Row noGutters className="bg-light  py-4 mb-5  min-vh-100">
                <Col lg={collapse ? '11' : '10'} className="pr-2 pl-3 mb-5">
            <div className="col-lg-12">
            <div className="mb-3">
                            <span style={{ fontSize: '30px' }}>
                                <Link to="/resources">
                                    <i
                                        className="fa fa-arrow-circle-left"
                                        style={{ color: 'black' }}
                                    ></i>
                                </Link>
                                <b> back</b>
                            </span>
                        </div>
                <Row>
                    <Col lg={11}>
                        <div className="p-4 shadow-lg bg-white" style={{ borderRadius: '10px' }}>
                            <Col>
                                <Row>
                                    <h3 className="text-capitalize">{data && data.length ? data[0].programName : null}</h3>
                                </Row>
                                <Row className="mt-4">
                                    <span>
                                        <b>Discpline</b>
                                    </span>
                                    <span className="ml-4">{data && data.length ? data[0].discipline : null}</span>
                                    <div
                                        className="ml-3 mt-1"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">{data && data.length ? data[0].duration : null + ' days'}</span>
                                    <div
                                        className="ml-3"
                                        style={{ borderLeft: '1px solid black', height: '20px' }}
                                    ></div>
                                    <span className="ml-4">{'Level: ' + data && data.length ? data[0].level : null}</span>
                                </Row>
                            </Col>
                        </div>
                        <div className="mt-5">
                            <SessionContext.Provider value={{ sessions: data[0].sessions }}>
                                <Scheduler
                                    templateSessions={data[0].sessions}
                                    sessionIds={sessionIds}
                                    callback={handleCallback}
                                    days={data[0].duration}
                                    type={'day'}
                                    restDays={data[0].restDays}
                                    programId={last}


                                    ref={ref}
                                        
                                      
                                        
                                       
                                        
                                        // schedulerSessions={schedulerSessions}
                                        // clientIds={clientIds}
                                        // classType={'Live Stream Channel'}
                                        
                                        // startDate={prevDate}
                                        handleFloatingActionProgramCallback={
                                            handleFloatingActionProgramCallback
                                        }
                                        handleFloatingActionProgramCallback2={
                                            handleFloatingActionProgramCallback2
                                        }
                                        handleRefetch={handleRefetch}
                                        sessionFilter={sessionFilter}
                                        program={program}
                                        showRestDay={showRestDay}
                                        show24HourFormat={show24HourFormat}
                                />
                            </SessionContext.Provider>
                        </div>
                    </Col>
                </Row>
            </div>
            </Col>
            {/* Right sidebar */}
            <Col lg={collapse ? '1' : '2'} className="d-lg-block">
                    <SideNav
                        type="day"
                        handleScrollScheduler={handleScrollScheduler}
                        show24HourFormat={show24HourFormat}
                        setShow24HourFormat={setShow24HourFormat}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        accordionExpanded={accordionExpanded}
                        onAccordionToggle={handleAccordionToggle}
                        // clientIds={clientIds}
                        sessionIds={sessionIds}
                        // startDate={tag?.fitnesspackage?.Start_date}
                        duration={data[0].duration}
                        callback={handleFloatingActionProgramCallback}
                        callback2={handleFloatingActionProgramCallback2}
                        callback3={handleRefetch}
                        restDayCallback={handleShowRestDay}
                        showRestDayAction={showRestDay}
                    />
                </Col>
            </Row>
        );
};
export default ProgramManager;
