import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import moment from 'moment';

const PackageDateConfig = (props: any) => {

     const inputDisabled = props.readonly;

     const [publishingDate, setPublishingDate] = useState(props.value === undefined ? moment().add(props.title1 && 1, 'month').format("YYYY-MM-DDTHH:mm") : moment(JSON.parse(props.value).publishingDate).format("YYYY-MM-DDTHH:mm"));
     const [expiryDate, setExpiryDate] = useState(props.value === undefined ? moment(publishingDate).add(1, 'year').format("YYYY-MM-DDTHH:mm") : moment(JSON.parse(props.value).expiryDate).format("YYYY-MM-DDTHH:mm"));

     useEffect(() => {
          setExpiryDate(moment(publishingDate).add(1, props?.title2 ? 'month' : 'year').format("YYYY-MM-DDTHH:mm"));
     }, [publishingDate, props.title2]);

     props.onChange(JSON.stringify({publishingDate, expiryDate}));

     return (
          <div>
               <label>{props?.title1 ? props.title1 : "Publishing Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="datetime-local"
                         min={props.type === 'Cohort' ? moment().add(1, 'month').format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm")}
                         value={publishingDate}
                         onChange={(e) => { setPublishingDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
               {props?.title1 && <span className='small text-muted'>Set the date for this offering to be available for everyone</span>}
               <br />
               <label>{props?.title2 ? props.title2 : "Expiry Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="datetime-local"
                         min={moment(publishingDate).add(1, props?.title2 ? 'month' : 'year').format("YYYY-MM-DDTHH:mm")}
                         value={expiryDate}
                         onChange={(e) => { setExpiryDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
               {props?.title2 && <span className='small text-muted'>On the selected date this offering will be shifted to drafts</span>}
          </div>
     );
};

export default PackageDateConfig;