import React, {useState} from 'react';
import {InputGroup, FormControl } from 'react-bootstrap';

const UrlList = (props: any) => {

     const [value, setValue] = useState("");
     props.onChange(value);

     return (
          <InputGroup className="mb-3">
               <FormControl
                    type="text"
                    placeholder="Add URL"
                    onChange={e => {
                         setValue(e.target.value)}}
               />
          </InputGroup>
     );
};

export default UrlList;