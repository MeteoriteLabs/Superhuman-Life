import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import moment from 'moment';

const PackageDateConfig = (props: any) => {

     const inputDisabled = props.readonly;

     const [publishingDate, setPublishingDate] = useState(props.value === undefined ? moment().add(props.title2 && 1, 'month').format("YYYY-MM-DD") : moment(props.value.publishingDate).format("YYYY-MM-DD"));
     const [expiryDate, setExpiryDate] = useState(props.value === undefined ? moment(publishingDate).add(1, 'year').format("YYYY-MM-DD") : moment(props.value.expiryDate).format("YYYY-MM-DD"));

     useEffect(() => {
          setExpiryDate(moment(publishingDate).add(1, props?.title2 ? 'month' : 'year').format("YYYY-MM-DD"));
     }, [publishingDate, props.title2]);

     props.onChange(JSON.stringify({publishingDate, expiryDate}));

     return (
          <div>
               <label>{props?.title1 ? props.title1 : "Publishing Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="date"
                         min={moment().format("YYYY-MM-DD")}
                         value={publishingDate}
                         onChange={(e) => { setPublishingDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
               <label>{props?.title2 ? props.title2 : "Expiry Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="date"
                         min={moment(publishingDate).add(1, props?.title2 ? 'month' : 'year').format("YYYY-MM-DD")}
                         value={expiryDate}
                         onChange={(e) => { setExpiryDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
          </div>
     );
};

export default PackageDateConfig;