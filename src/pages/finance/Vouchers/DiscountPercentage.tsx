import React, { ChangeEvent, useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

const DiscountPercentage: React.FC<{
    value: number;
    onChange: (args: string | null) => void;
    // eslint-disable-next-line
    uiSchema: any;
    readonly: boolean;
}> = ({ value, onChange, readonly }) => {
    const [input, setInput] = useState<number>(value ? JSON.parse(`${value}`).input : 0);

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e)}
                disabled={readonly ? readonly : false}
            />
            <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    );
};

export default DiscountPercentage;
