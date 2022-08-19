import React, {useState} from 'react';
import {InputGroup, FormControl } from 'react-bootstrap';

const UrlList = (props: any) => {     
     const [selected, setSelected] = useState<any[]>(props?.field[0]?.type === "url" ? props?.field : []);
     function handleUrlChange(i, e, field){
          const values = [...field];
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
                         value={selected[props.id]?.value}
                         onChange={e => {
                              handleUrlChange(props.id , e.target.value, props.field);
                         }}
                    />
               </InputGroup>
          </div>
     );
};

export default UrlList;