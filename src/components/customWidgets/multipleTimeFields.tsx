import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.startTime : ''
    );
    const [endTime, setEndTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.endTime : ''
    );

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

    function handleObjectFormat({ startTime, endTime }) {
        if (props.startTime === startTime && props.endTime === endTime) {
            return { startTime: startTime, endTime: endTime };
        } else if (props.startTime === startTime && props.endTime !== endTime) {
            return { startTime: startTime, endTime: handleFormatting(endTime) };
        } else if (props.startTime !== startTime && props.endTime === endTime) {
            return { startTime: handleFormatting(startTime), endTime: endTime };
        } else {
            return {
                startTime: handleFormatting(startTime),
                endTime: handleFormatting(endTime)
            };
        }
    }

    const object = handleObjectFormat({ startTime: startTime, endTime: endTime });
    props.onChange(JSON.stringify(object));

    useEffect(() => {
        setStartTime(props.startTime);
        setEndTime(props.endTime);
    }, [props.startTime, props.endTime]);

    return (
        <>
            <Row>
                <Col lg={4}>
                    <label>
                        <b>Start Time: </b>
                    </label>
                </Col>
                <Col lg={6}>
                    <TimePickers
                        label=""
                        disabled={props.disabled ? props.disabled : false}
                        onChange={handleStartTimeInput}
                    />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col lg={4}>
                    <label>
                        <b>End Time: </b>
                    </label>
                </Col>
                <Col lg={6}>
                    <TimePickers
                        label=""
                        disabled={props.disabled ? props.disabled : false}
                        onChange={handleEndTimeInput}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={{ offset: 4 }}>{handleTimeValidation()}</Col>
            </Row>
        </>
    );
};

export default TimeFieldInput;
