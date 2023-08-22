import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import TimePickers from 'components/ClockTimePicker';

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.startTime : ''
    );
    const [endTime, setEndTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.endTime : ''
    );

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

    const startTimeSplit = startTime?.split(':').map(Number);
    const endTimeSplit = endTime?.split(':').map(Number);
    const startTimeValue = moment().set({
        hour: startTimeSplit[0],
        minute: startTimeSplit[1]
    });
    const endTimeValue = moment().set({
        hour: endTimeSplit[0],
        minute: endTimeSplit[1]
    });

    function handleObjectFormat({ startTime, endTime }) {
        if (props.startTime === startTime && props.endTime === endTime) {
            return { startTime: startTime, endTime: endTime };
        } else if (props.startTime === startTime && props.endTime !== endTime) {
            return { startTime: startTime, endTime: endTime };
        } else if (props.startTime !== startTime && props.endTime === endTime) {
            return { startTime: startTime, endTime: endTime };
        } else {
            return {
                startTime: startTime,
                endTime: endTime
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
                <Col lg={5}>
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
                <Col lg={5}>
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
