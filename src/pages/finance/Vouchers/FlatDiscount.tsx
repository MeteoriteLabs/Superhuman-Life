import React, { useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

const FlatDiscount: React.FC<{
  value?: number;
  onChange: (args: string | null) => void;
  uiSchema?: any;
  readonly: boolean;
}> = ({ value, onChange, readonly }) => {

  const [input, setInput] = useState<number>(value ? JSON.parse(`${value}`).input : 0);

  const changeHandler = (e) => {
    setInput(+e.target.value);
  };

  onChange(JSON.stringify({ input }));

  return (
    <InputGroup className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text id="basic-addon1">INR</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        placeholder="Enter flat discount"
        aria-label="Flat discount"
        aria-describedby="basic-addon1"
        value={input}
        onChange={(e) => changeHandler(e)}
        disabled={readonly ? readonly : false}
      />
    </InputGroup>
  );
};

export default FlatDiscount;
