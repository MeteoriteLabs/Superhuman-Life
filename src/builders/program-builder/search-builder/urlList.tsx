import React, { useState } from 'react';
import { InputGroup, FormControl, Form } from 'react-bootstrap';

// eslint-disable-next-line
const regularExpForUrl =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const UrlList = (props: any) => {
    const [selected, setSelected] = useState<any[]>(
        props?.field[0]?.type === 'url' ? props?.field : []
    );
    const [isUrlValid, setIsUrlValid] = useState<boolean>(false);

    function handleUrlChange(i, e, field) {
        const values = [...field];
        values[i].type = 'url';
        if (regularExpForUrl.test(e)) {
            values[i].value = e;
            setIsUrlValid(false);
        } else {
            setIsUrlValid(true);
        }
        setSelected(values);
    }
    props.onChange(selected);

    return (
        <div>
            <InputGroup className="mb-3" hasValidation>
                <FormControl
                    type="url"
                    placeholder="Add URL"
                    value={selected[props.id]?.value}
                    onChange={(e) => {
                        handleUrlChange(props.id, e.target.value, props.field);
                    }}
                    isInvalid={isUrlValid}
                />
                <Form.Control.Feedback type="invalid">
                    Please enter correct URL.
                </Form.Control.Feedback>
            </InputGroup>
        </div>
    );
};

export default UrlList;
