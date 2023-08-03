import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState('00:00');

    function handleStartTimeInput(val: any) {
        setStartTime(val.$H + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleFormatting(time) {
        var inputTime: any = time.split(':');
        return `${parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]}:${
            inputTime[1] === '00' ? '0' : inputTime[1]
        }`;
    }

    props.onChange(JSON.stringify(handleFormatting(startTime)));

    return (
        <>
            <Row>
                <Col lg={4}>
                     <TimePickers
                        label="start time"
                        disabled={props.disabled ? props.disabled : false}
                        onChange={handleStartTimeInput}
                    />
                
                </Col>
            </Row>
        </>
    );
};

export default TimeFieldInput;
