import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const TimeFieldInput = (props: any) => {

    const [startTime, setStartTime] = useState(props.value !== undefined ? JSON.parse(props.value).startTime : "00:00"); 
    const [endTime, setEndTime] = useState(props.value !== undefined ? JSON.parse(props.value).endTime : "00:00");

    function handleStartTimeInput(val: any){
        var m = (Math.round(parseInt(val.slice(3,5))/15) * 15) % 60;
        setStartTime(val.slice(0,2) + ':' + (m === 0 ? '00' : m));
    }

    function handleEndTimeInput(val: any){
        var m = (Math.round(parseInt(val.slice(3,5))/15) * 15) % 60;
        setEndTime(val.slice(0,2) + ':' + (m === 0 ? '00' : m));
    }

    function handleTimeValidation() {
        var sh = startTime.split(":")[0];
        var sm = startTime.split(":")[1];
        var eh = endTime.split(":")[0];
        var em = endTime.split(":")[1];

        if(!props.disabled) {
            if(parseInt(sh) > parseInt(eh)) {
                return <span id="timeErr" style={{color: 'red'}}>End Time should be greater than Start Time</span>
            }else if(parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
                return <span id="timeErr" style={{color: 'red'}}>End Time and start Time cannot be the same</span>
            }else if(parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
                return <span id="timeErr" style={{color: 'red'}}>End Time Cannot be lesser than Start Time</span>
            }else {
                return <span id="validTime" style={{color: 'green'}}>Valid Time</span>
            }
        }
    }

    function convertToMoment(time: string) {
        var timeSplit = time.split(":").map(Number);
        return moment().set({"hour": timeSplit[0], "minute": timeSplit[1]});
    }

    function handleFormatting(time){
        var inputTime: any = time.split(':');
        return `${parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]}:${inputTime[1] === '00' ? '0' : inputTime[1]}`; 
    }

    function checkIfCorrectTime(){
        var ele: any = document.getElementById("timeErr");

        if(ele) {
            return false;
        }else {
            return true;
        }
    }

    useEffect(() => {
        if(checkIfCorrectTime()){
            const object = ({"startTime": handleFormatting(startTime), "endTime": handleFormatting(endTime)});
            props.onChange(JSON.stringify(object));
        }else {
            props.onChange(undefined);
        }
        // eslint-disable-next-line
    }, [startTime, endTime]);

    return (
        <>
            <label>Start Time: </label>
            <Row>
                <Col lg={4}>
                        <TimePicker value={convertToMoment(startTime)} disabled={props.disabled} showSecond={false} minuteStep={15} onChange={(e) => {
                            if(!e) {
                                setStartTime("00:00");
                            }else {
                                
                                handleStartTimeInput(moment(e).format("HH:mm"))
                            }
                        }} />
                </Col>
            </Row>
            <label>End Time: </label>
            <Row>
                <Col lg={4}>
                        <TimePicker value={convertToMoment(endTime)} disabled={props.disabled} showSecond={false} minuteStep={15} onChange={(e) => {
                            if(!e){
                                setEndTime("00:00");
                            }else {
                                handleEndTimeInput(moment(e).format("HH:mm"));
                            }
                        }}/>
                </Col>
            </Row>
            {handleTimeValidation()}
        </>
    )
}

export default TimeFieldInput;