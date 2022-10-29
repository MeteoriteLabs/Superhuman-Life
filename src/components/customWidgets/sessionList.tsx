/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useContext, useEffect } from 'react';
import { FormControl, Row, Button } from 'react-bootstrap';
import { GET_PROGRAMLIST, GET_FITNESSPACKAGE_DETAILS, GET_TAGS_BY_TYPE, GET_SESSIONS_BY_TAG } from './queries';
import { useQuery } from "@apollo/client";
import AuthContext from '../../context/auth-context';
import '../../builders/program-builder/program-template/styles.css';
import SchedulerEvent from '../../builders/program-builder/program-template/scheduler-event';
import {flattenObj} from '../utils/responseFlatten';
import moment from 'moment';

const ProgramList = (props: any) => {

    const auth = useContext(AuthContext);
    const [programList, setProgramList] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(null);
    const [selected, setSelected] = useState<any>({});
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [selectedFitnessPackage, setSelectedFitnessPackage] = useState("");
    const [tagsList, setTagList] = useState<any>([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [packageDuration, setPackageDuration] = useState<any>();
    const [displayDates, setDisplayDate] = useState<any>([]);
    const [startDate, setStartDate] = useState<any>();
    let skipval: Boolean = true;

    useQuery(GET_FITNESSPACKAGE_DETAILS, {onCompleted: (data) => {
        const flattenData = flattenObj({...data});
        setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    }});

    useQuery(GET_TAGS_BY_TYPE, { variables: { id: auth.userid, type: selectedFitnessPackage} ,skip: ( selectedFitnessPackage === "") ,onCompleted: (data) => {
        const flattenData = flattenObj({...data});
        setTagList(flattenData.tags);
    }});

    function handleDatesRender(date: any, duration: any){
        const dates: any = [];
        for(let i=0; i<=duration; i++){
            dates.push(moment(date).add(i, 'days').format('DD MMM YY'));
        }
        setDisplayDate(dates);
    }

    useQuery(GET_SESSIONS_BY_TAG, { variables: {id: selectedTag}, skip: (selectedTag === ""), onCompleted: (data) => {
        const flattenData = flattenObj({...data});
        console.log(flattenData);
        debugger;
        setStartDate(flattenData.tags[0]?.client_packages[0]?.effective_date);
        handleDatesRender(flattenData.tags[0]?.client_packages[0]?.effective_date, flattenData.tags[0]?.fitnesspackage?.duration);
        setPackageDuration(flattenData.tags[0]?.fitnesspackage?.duration);
        setProgramList(flattenData.tags[0].sessions);
    }})

    function FetchEquipmentList(_variable: {} = { id: auth.userid, filter: " " }) {
        useQuery(GET_PROGRAMLIST, { variables: _variable, onCompleted: loadProgramList, skip: !searchInput });
    }

    function loadProgramList(data: any) {
        const flattenedData = flattenObj({ ...data });
        setProgramList(
            [...flattenedData.fitnessprograms].map((program) => {
                return {
                        id: program.id,
                        name: program.title,
                        duration: program.duration_days,
                        level: program.level,
                        description: program.description,
                        discpline: program.fitnessdisciplines,
                        events: program.events
                }
            })
        );
    }

    var days: any = [];

    for (var i = 1; i <= packageDuration; i++) {
        days.push(i);
    }

    function renderEventsTable() {
        if(programList.length > 0){
            return (
                <SchedulerEvent programDays={days} days={displayDates} startDate={startDate} programEvents={programList} type={'sessions'}/>
            )   
        }
    };

    FetchEquipmentList({ filter: searchInput, skip: skipval, id: auth.userid });

    useEffect(() => {
        // if(urlList[3] === 'pt'){
        //     setSelectedFitnessPackage("One-On-One");
        // }else if(urlList[3] === 'group'){
        //     setSelectedFitnessPackage('Group Class');
        // }else if(urlList[3] === 'classic'){
        //     setSelectedFitnessPackage('Classic Class');
        // }
    }, []);

    return (
        <>
            <label style={{ fontSize: 17 }}>Import from existing session</label>
            <Button variant="outline-danger" className="float-right mb-3" onClick={() => { props.callback2('none'); setSelected({}) }}>close</Button>
            <Row className='mb-3'>
                <div className="mr-5">
                    <span><b>Select Fitness Package type</b></span>
                    <FormControl value={selectedFitnessPackage} 
                    // disabled={urlList[3] === 'pt' || urlList[3] === 'group' || urlList[3] === 'classic'}  
                    as="select" onChange={(e) => setSelectedFitnessPackage(e.target.value)}>
                        <option>Choose Type</option>
                        {fitnessPackageTypes.slice(0,7).map((item) => {
                            return <option value={item.type}>{item.type}</option>
                        })}
                    </FormControl>
                </div>
                <div>
                    {tagsList.length !== 0 && <>
                    <span><b>Select Class</b></span>
                    <FormControl as="select" onChange={(e) => setSelectedTag(e.target.value)}>
                        <option>Choose Class</option>
                        {tagsList.map((item) => {
                            return <option value={item.id}>{item.tag_name}</option>
                        })}
                    </FormControl></>}
                </div>
            </Row>
            {/* {programList?.length !== 0 && <InputGroup>
                <FormControl aria-describedby="basic-addon1" placeholder="Search for session" id="searchInput" ref={inputField}
                    onChange={(e) => {
                        setSelected({});
                        e.preventDefault();
                        EquipmentSearch(e.target.value);
                    }} autoComplete="off"
                />
            </InputGroup>} */}
            {/* <>
                {programList.slice(0, 5).map((program) => {
                        return (
                            <Container className="pl-0">
                                <div
                                    style={{ cursor: 'pointer', maxWidth: '60%' }}
                                    className="m-2 ml-5 p-2 shadow-sm rounded bg-white "
                                    id={program.id}
                                    onClick={(e) => {
                                            e.preventDefault();
                                            handleSelectedEquipmentAdd(program.name, program.id, program.duration, program.level, program.description, program.discpline, program.events);
                                    }}>
                                    <div>
                                            <Row>
                                                <Col style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                                    {program.tag}
                                                </Col>
                                                <Col style={{ textAlign: 'center' }}>
                                                    {program.description}
                                                </Col>
                                                <Col style={{ textAlign: 'end' }}>
                                                    {program.level}
                                                </Col>
                                            </Row>
                                    </div>
                                </div>
                            </Container>
                        );
                })}
            </> */}
            <>
                <div className="mt-5">
                    {renderEventsTable()}
                </div>
            </>
        </>
    )
}

export default ProgramList;
