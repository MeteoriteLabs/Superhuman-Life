import React, { useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import moment from 'moment';

const PackageDateConfig = (props: any) => {

     const inputDisabled = props.readonly;

     const cohortStartDate = JSON.parse(props.formContext.dates).startDate;

     const [publishingDate, setPublishingDate] = useState(props.value === undefined ? moment().format("YYYY-MM-DDTHH:mm") : moment(JSON.parse(props.value).publishingDate).format("YYYY-MM-DDTHH:mm"));
     const [expiryDate, setExpiryDate] = useState(moment(cohortStartDate).format("YYYY-MM-DDTHH:mm"));

     console.log(expiryDate);

     props.onChange(JSON.stringify({publishingDate, expiryDate}));

     return (
          <div>
               <label>{props?.title1 ? props.title1 : "Publishing Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="datetime-local"
                         min={moment().format("YYYY-MM-DDTHH:mm")}
                         max={moment(cohortStartDate).format("YYYY-MM-DDTHH:mm")}
                         value={publishingDate}
                         onChange={(e) => { setPublishingDate(e.target.value) }}
                         disabled={inputDisabled}
                    />
               </InputGroup>
               {props?.title1 && <span className='small'>Set the date for this offering to be available for everyone</span>}
               <label>{props?.title2 ? props.title2 : "Expiry Date"}</label>
               <InputGroup className="mb-3">
                    <FormControl
                         aria-label="Default"
                         aria-describedby="inputGroup-sizing-default"
                         type="datetime-local"
                         value={expiryDate}
                         onChange={(e) => { setExpiryDate(e.target.value) }}
                         disabled={true}
                    />
               </InputGroup>
               {props?.title2 && <span className='small'>On the selected date this offering will be shifted to drafts</span>}
          </div>
     );
};

export default PackageDateConfig;