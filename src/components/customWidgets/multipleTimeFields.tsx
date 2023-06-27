import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import TimePicker from 'rc-time-picker'

import 'rc-time-picker/assets/index.css'

const TimeFieldInput = (props: any) => {
    const [startTime, setStartTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.startTime : ''
    )
    const [endTime, setEndTime] = useState(
        props.eventType === 'duplicate' || props.eventType === 'edit' ? props.endTime : ''
    )

    function handleTimeFormat(time: string) {
        const timeArray = time.split(':')
        const hours = timeArray[0]
        const minutes = timeArray[1]
        const timeString =
            (parseInt(hours) < 10 && parseInt(hours) !== 0 ? '0' + hours : hours) +
            ':' +
            (parseInt(minutes) === 0 ? '0' + minutes : minutes)
        return timeString.toString()
    }

    function handleStartTimeInput(val: any) {
        const m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60
        setStartTime(val.slice(0, 2) + ':' + (m === 0 ? '00' : m))
    }

    function handleEndTimeInput(val: any) {
        const m = (Math.round(parseInt(val.slice(3, 5)) / 15) * 15) % 60
        setEndTime(val.slice(0, 2) + ':' + (m === 0 ? '00' : m))
    }

    function handleTimeValidation() {
        const sh = startTime.split(':')[0]
        const sm = startTime.split(':')[1]
        const eh = endTime.split(':')[0]
        const em = endTime.split(':')[1]

        if (!props.disabled) {
            if (parseInt(sh) > parseInt(eh)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time should be greater than Start Time
                    </span>
                )
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) === parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time and start Time cannot be the same
                    </span>
                )
            } else if (parseInt(sh) === parseInt(eh) && parseInt(sm) > parseInt(em)) {
                return (
                    <span id="timeErr" style={{ color: 'red' }}>
                        End Time Cannot be lesser than Start Time
                    </span>
                )
            }
        }
    }

    const startTimeSplit = startTime?.split(':').map(Number)
    const endTimeSplit = endTime?.split(':').map(Number)
    const startTimeValue = moment().set({
        hour: startTimeSplit[0],
        minute: startTimeSplit[1]
    })
    const endTimeValue = moment().set({
        hour: endTimeSplit[0],
        minute: endTimeSplit[1]
    })
    function convertToMomnet(time: string) {
        const timeSplit = time.split(':').map(Number)
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] })
    }

    function handleFormatting(time) {
        const inputTime: any = time.split(':')
        return `${parseInt(inputTime[0]) < 10 ? inputTime[0].charAt(1) : inputTime[0]}:${
            inputTime[1] === '00' ? '0' : inputTime[1]
        }`
    }

    function handleObjectFormat({ startTime, endTime }) {
        if (props.startTime === startTime && props.endTime === endTime) {
            return { startTime: startTime, endTime: endTime }
        } else if (props.startTime === startTime && props.endTime !== endTime) {
            return { startTime: startTime, endTime: handleFormatting(endTime) }
        } else if (props.startTime !== startTime && props.endTime === endTime) {
            return { startTime: handleFormatting(startTime), endTime: endTime }
        } else {
            return {
                startTime: handleFormatting(startTime),
                endTime: handleFormatting(endTime)
            }
        }
    }

    const object = handleObjectFormat({ startTime: startTime, endTime: endTime })
    props.onChange(JSON.stringify(object))

    useEffect(() => {
        setStartTime(props.startTime)
        setEndTime(props.endTime)
    }, [props.startTime, props.endTime])

    return (
        <>
            <Row>
                <Col lg={4}>
                    <label>
                        <b>Start Time: </b>
                    </label>
                </Col>
                <Col lg={4}>
                    <TimePicker
                        value={
                            props.startTime && startTime === ''
                                ? convertToMomnet(handleTimeFormat(props.startTime))
                                : startTimeValue
                        }
                        disabled={props.disabled ? props.disabled : false}
                        showSecond={false}
                        minuteStep={15}
                        onChange={(e) => {
                            if (!e) {
                                setStartTime('00:00')
                            } else {
                                handleStartTimeInput(moment(e).format('HH:mm'))
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col lg={4}>
                    <label>
                        <b>End Time: </b>
                    </label>
                </Col>
                <Col lg={4}>
                    <TimePicker
                        value={
                            props.endTime && endTime === ''
                                ? convertToMomnet(handleTimeFormat(props.endTime))
                                : endTimeValue
                        }
                        disabled={props.disabled ? props.disabled : false}
                        showSecond={false}
                        minuteStep={15}
                        onChange={(e) => {
                            if (!e) {
                                setEndTime('00:00')
                            } else {
                                handleEndTimeInput(moment(e).format('HH:mm'))
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={{ offset: 4 }}>{handleTimeValidation()}</Col>
            </Row>
        </>
    )
}

export default TimeFieldInput
