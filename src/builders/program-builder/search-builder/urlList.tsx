import React, {useState} from 'react';
import {InputGroup, FormControl } from 'react-bootstrap';

const UrlList = (props: any) => {

     const [value, setValue] = useState("");
     var urlField: any = {"type": "url"}
     urlField.value = value;
     props.onChange(urlField);
     console.log(value);

     return (
          <div>
               hello
          </div>
     );
};

export default UrlList;