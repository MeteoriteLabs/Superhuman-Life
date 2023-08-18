import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState(
        props.value ? JSON.parse(props.value).startTime : '00:00'
    );
    const [endTime, setEndTime] = useState(props.value ? JSON.parse(props.value).endTime : '23:00');

    function handleStartTimeInput(val: any) {
        setStartTime((val.$H < 10 ? `0${val.$H}` : val.$H) + ':' + (val.$m === 0 ? '00' : val.$m));
    }

    function handleEndTimeInput(val: any) {
        setEndTime((val.$H < 10 ? `0${val.$H}` : val.$H) + ':' + (val.$m === 0 ? '00' : val.$m));
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
                startTime: startTime,
                endTime: endTime
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
                        label=""
                        disabled={props.disabled}
                        onChange={handleStartTimeInput}
                    />
                </Col>
            </Row>
            <label style={{ marginTop: '10px' }}>End Time: </label>
            <Row>
                <Col lg={4}>
                    <TimePickers label="" disabled={props.disabled} onChange={handleEndTimeInput} />
                </Col>
            </Row>
            {handleTimeValidation()}
        </>
    );
};

export default TimeFieldInput;
