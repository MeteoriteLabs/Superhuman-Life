import React, {useState} from 'react';
import {InputGroup, FormControl } from 'react-bootstrap';

const UrlList = (props: any) => {     
     const [selected, setSelected] = useState<any[]>([]);
     function handleUrlChange(i, e, field){
          const values = field;
          values[i].type = "url";
          values[i].value = e;
          setSelected(values);
     }
     props.onChange(selected);

     return (
          <div>
               <InputGroup className="mb-3">
                    <FormControl
                         type="text"
                         placeholder="Add URL"
                         onChange={e => {
                              handleUrlChange(props.id , e.target.value, props.field);
                         }}
                    />
               </InputGroup>
          </div>
     );
};

export default UrlList;