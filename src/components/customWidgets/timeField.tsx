import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState(
        props.value ? JSON.parse(props.value).startTime : '00:00'
    );
    const [endTime, setEndTime] = useState(props.value ? JSON.parse(props.value).endTime : '23:00');

    function handleStartTimeInput(val: any) {
        setStartTime(val.$H + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleEndTimeInput(val: any) {
        setEndTime(val.$H + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleTimeValidation() {
        const sh = startTime.split(':')[0];
        const sm = startTime.split(':')[1];
        const eh = endTime.split(':')[0];
        const em = endTime.split(':')[1];

        if (!props.disabled) {
            if (parseInt(sh) > parseInt(eh)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time should be greater than Start Time
                    </span>
                );
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time and start Time cannot be the same
                    </span>
                );
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time Cannot be lesser than Start Time
                    </span>
                );
            }
        }
    }

    function handleFormatting(time) {
        const inputTime: any = time.split(':');
        return `${parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]}:${
            inputTime[1] === '00' ? '0' : inputTime[1]
        }`;
    }

    function checkIfCorrectTime() {
        const ele: any = document.getElementById('timeErr');

        if (ele) {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        if (checkIfCorrectTime()) {
            const object = {
                startTime: handleFormatting(startTime),
                endTime: handleFormatting(endTime)
            };
            props.onChange(JSON.stringify(object));
        } else {
            props.onChange(undefined);
        }
        // eslint-disable-next-line
    }, [startTime, endTime]);

    return (
        <>
            <label>Start Time: </label>
            <Row>
                <Col lg={4}>
                    <TimePickers
                        label="Choose start time"
                        disabled={props.disabled}
                        onChange={handleStartTimeInput}
                    />
                </Col>
            </Row>
            <label style={{ marginTop: '10px' }}>End Time: </label>
            <Row>
                <Col lg={4}>
                    <TimePickers
                        label="Choose end time"
                        disabled={props.disabled}
                        onChange={handleEndTimeInput}
                    />
                </Col>
            </Row>
            {handleTimeValidation()}
        </>
    );
};

export default TimeFieldInput;
