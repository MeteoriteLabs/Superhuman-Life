import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState('00:00');

    function handleStartTimeInput(val: any) {
        setStartTime((val.$H < 10 ? `0${val.$H}` : val.$H) + ':' + (val.$m === 0 ? '00' : val.$m));
    }


    props.onChange(JSON.stringify(startTime));

    return (
        <>
            <Row>
                <Col lg={4}>
                    <TimePickers
                        label=""
                        disabled={props.disabled ? props.disabled : false}
                        onChange={handleStartTimeInput}
                    />
                </Col>
            </Row>
        </>
    );
};

export default TimeFieldInput;
