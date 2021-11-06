import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

import 'rc-time-picker/assets/index.css';


const TimeFieldInput = (props: any) => {

     const [startTime, setStartTime] = useState(''); 
     const [endTime, setEndTime] = useState('');

     function handleTimeFormat(time: string) {
          let timeArray = time.split(':');
          let hours = timeArray[0];
          let minutes = timeArray[1];
          let timeString = (parseInt(hours) < 10 && parseInt(hours) !== 0 ? "0" + hours : hours) + ':' + (parseInt(minutes) === 0 ? "0" + minutes : minutes);
          return timeString.toString();
     }

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
                    return <span style={{color: 'green'}}>Valid Time</span>
               }
          }
     }

     const startTimeSplit = startTime.split(":").map(Number);
     const endTimeSplit = endTime.split(":").map(Number);
     var startTimeValue = moment().set({"hour": startTimeSplit[0], "minute": startTimeSplit[1]});
     var endTimeValue = moment().set({"hour": endTimeSplit[0], "minute": endTimeSplit[1]});

     function convertToMomnet(time: string) {
          var timeSplit = time.split(":").map(Number);
          return moment().set({"hour": timeSplit[0], "minute": timeSplit[1]});
     }

     const object = {"startTime": startTime, "endTime": endTime};
     props.onChange(JSON.stringify(object));
     
     return (
          <>
               <label>Start Time: </label>
               <Row>
                    <Col lg={4}>
                         <TimePicker value={props.startTime && startTime === '' ? convertToMomnet(handleTimeFormat(props.startTime)) : startTimeValue} disabled={props.disabled ? props.disabled : false} showSecond={false} minuteStep={15} onChange={(e) => {handleStartTimeInput(moment(e).format("HH:mm"))}}/>
                    </Col>
               </Row>
               <label>End Time: </label>
               <Row>
                    <Col lg={4}>
                         <TimePicker value={props.endTime && endTime === '' ? convertToMomnet(handleTimeFormat(props.endTime)) : endTimeValue} disabled={props.disabled ? props.disabled : false} showSecond={false} minuteStep={15} onChange={(e) => {handleEndTimeInput(moment(e).format("HH:mm"))}}/>
                    </Col>
               </Row>
               {handleTimeValidation()}
          </>
     )
}

export default TimeFieldInput;