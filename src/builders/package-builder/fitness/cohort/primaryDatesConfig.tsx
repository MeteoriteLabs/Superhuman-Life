import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Form } from 'react-bootstrap';
import moment from 'moment';

const PackageDateConfig = (props: any) => {

     const inputDisabled = props.readonly;
     const [startDate, setStartDate] = useState(props.value === undefined ? moment().add(1, 'days').format("YYYY-MM-DD") : moment(JSON.parse(props.value).startDate).format("YYYY-MM-DD"));
     const [endDate, setEndDate] = useState(props.value === undefined ? moment(startDate).format("YYYY-MM-DD") : moment(JSON.parse(props.value).endDate).format("YYYY-MM-DD"));
     const [oneDay, setOneDay] = useState(props.value === undefined ? false : JSON.parse(props.value).oneDay);

     // if(oneDay === true){
     //      setEndDate(startDate);
     // }

     // useEffect(() => {
     //      if(moment(endDate).isBefore(startDate)){
     //           setEndDate(startDate);
     //      }
     // }, [startDate]);

     useEffect(() => {
          if(moment(startDate).isAfter(endDate)){
               setEndDate(startDate);
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [startDate]);

     useEffect(() => {
          if(oneDay === true){
               setEndDate(moment(startDate).format("YYYY-MM-DD"));
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [oneDay]);

     // useEffect(() => {
     //      setEndDate(moment(startDate).add(1, props?.title2 ? 'month' : 'year').format("YYYY-MM-DD"));
     // }, [startDate, props.title2]);

     // useEffect(() => {
     //      if(oneDay){
     //           setEndDate(moment(startDate).format("YYYY-MM-DD"));
     //      }else {
     //           props.value === undefined ? setEndDate(moment(startDate).add(1, 'year').format("YYYY-MM-DD")) : setEndDate(moment(JSON.parse(props.value).endDate).format("YYYY-MM-DD"))
     //      }
     // }, [oneDay])

     // if()
     props.onChange(JSON.stringify({startDate, endDate, oneDay}));

     return (
          <div>
               <label>{props?.title1 ? props.title1 : "Publishing Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="date"
                         min={startDate}
                         value={startDate}
                         onChange={(e) => { setStartDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
               {props?.title1 && <span className='small text-muted'>Set the date for this offering to be available for everyone</span>}
               <br />
               <Form.Check 
                    custom
                    inline
                    type='checkbox'
                    id={`custom-checkbox`}
                    label="One Day"
                    checked={oneDay}
                    disabled={inputDisabled}
                    onChange={() =>  {
                         setOneDay(!oneDay);
                    }}
               />
               <br />
               <label>{props?.title2 ? props.title2 : "Expiry Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="date"
                         min={moment(startDate).format("YYYY-MM-DD")}
                         value={endDate}
                         onChange={(e) => { setEndDate(e.target.value) }}
                         disabled={inputDisabled || oneDay}
                    />
               </InputGroup>
               {props?.title2 && <span className='small text-muted'>On the selected date this offering will be shifted to drafts</span>}
          </div>
     );
};

export default PackageDateConfig;