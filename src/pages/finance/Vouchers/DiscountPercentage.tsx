import React, { useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

const DiscountPercentage: React.FC<{
  value: number;
  onChange: (args: string | null) => void;
  uiSchema: any;
  readonly: boolean;
}> = ({value, onChange, readonly}) => {
  const [input, setInput] = useState<number>(value ? JSON.parse(`${value}`).input : 0);

  const changeHandler = (e) => {
    setInput(+e.target.value);
  };

  onChange(JSON.stringify({ input }));

  return (
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter percentage discount"
          aria-label="Percentage discount"
          aria-describedby="basic-addon1"
          value={input}
          onChange={(e) => changeHandler(e)}
          disabled={readonly? readonly : false}
        />
        <InputGroup.Append>
          <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup> 
  );
};

export default DiscountPercentage;
