import React, { useState, useContext, Fragment, useEffect } from 'react'
import { DropdownButton, Dropdown, Row, Button } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {
    FETCH_SESSIONS,
    FETCH_FITNESS_PACKAGE_GROUP_AND_LIVESTREAM_INSTANT_BOOKING,
    FETCH_FITNESS_PACKAGE_ON_DEMAND_PT,
    FETCH_FITNESS_PACKAGE_RECORDED_WITH_DURATION_ONE
} from './queries'
import { useQuery, useLazyQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'
import AuthContext from '../../context/auth-context'
import moment from 'moment'

const classBasedOffering: React.FC<{
    value: string
    onChange: (params: string | null) => void
}> = (props) => {
    const auth = useContext(AuthContext)

    const [groupAndliveStreamOffering, setGroupAndLivestreamOffering] = useState<any>([])
    const [morningSession, setMorningSessions] = useState<any>([])
    const [noonSessions, setNoonSessions] = useState<any>([])
    const [eveningSessions, setEveningSessions] = useState<any>([])
    const [Sessions, setSessions] = useState<any>([])
    const [onDemandOffering, setOnDemandOffering] = useState<any>([])

    function handleReturnType(value) {
        if (typeof value === 'string') {
            return JSON.parse(value)
        } else {
            return value
        }
    }

    const [offeringSelected, setOfferingSelected] = useState<string | null>(
        null
        // props.value ? handleReturnType(props.value) : null
    )
    const [offeringSelectedName, setOfferingSelectedName] = useState<string | null>(
        null
        // props.value ? handleReturnType(props.value) : null
    )
    const [offeringList, setOfferingList] = useState<any[]>([])
    const [selectedSessionDate, setSelectedSessionDate] = useState<any>()
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [selectedSessionStartTime, setSelectedSessionStartTime] = useState<string | null>(null)
    const [selectedSessionEndTime, setSelectedSessionEndTime] = useState<string | null>(null)

    // eslint-disable-next-line
    const { data: get_group_and_livestream, refetch: refetchGroupAndLivestream } = useQuery(
        FETCH_FITNESS_PACKAGE_GROUP_AND_LIVESTREAM_INSTANT_BOOKING,
        {
            variables: { id: auth.userid },
            onCompleted: (data) => {
                setGroupAndLivestreamOffering(data)
                getOnDemandFitness({ variables: { id: auth.userid } })
            }
        }
    )

    // eslint-disable-next-line
    const { data: get_sessions, refetch: refetchSessions } = useQuery(FETCH_SESSIONS, {
        variables: { id: offeringSelected },
        skip: offeringSelected === null || !offeringSelected,
        onCompleted: (data) => {
            const flattenedSessions = flattenObj({ ...data.tags })
            console.log(data)
            const currentTime = new Date(selectedSessionDate)

            const morningSlot = new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                0,
                0,
                0
            )

            const noonSlot = new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                12,
                0,
                0
            )

            const eveningSlot = new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                18,
                0,
                0
            )

            const selectedDatesSessions =
                flattenedSessions &&
                flattenedSessions.length &&
                flattenedSessions[0].sessions.filter((currentValue) => {
                    return currentValue.session_date === selectedSessionDate
                })

            const selectedDatesMorningSessions =
                selectedDatesSessions &&
                selectedDatesSessions.length &&
                selectedDatesSessions.filter((currentValue) => {
                    const [startHours, startMinutes] = currentValue.start_time.split(':')
                    const [endHours, endMinutes] = currentValue.end_time.split(':')

                    const startDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +startHours,
                        +startMinutes,
                        0
                    )

                    const endDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +endHours,
                        +endMinutes,
                        0
                    )

                    return startDate >= morningSlot && endDate <= noonSlot
                })

            const selectedDatesNoonSessions =
                selectedDatesSessions &&
                selectedDatesSessions.length &&
                selectedDatesSessions.filter((currentValue) => {
                    const [startHours, startMinutes] = currentValue.start_time.split(':')
                    const [endHours, endMinutes] = currentValue.end_time.split(':')

                    const startDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +startHours,
                        +startMinutes,
                        0
                    )

                    const endDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +endHours,
                        +endMinutes,
                        0
                    )

                    return startDate >= noonSlot && endDate <= eveningSlot
                })

            const selectedDatesEveningSessions =
                selectedDatesSessions &&
                selectedDatesSessions.length &&
                selectedDatesSessions.filter((currentValue) => {
                    const [startHours, startMinutes] = currentValue.start_time.split(':')
                    const [endHours, endMinutes] = currentValue.end_time.split(':')

                    const startDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +startHours,
                        +startMinutes,
                        0
                    )

                    const endDate = new Date(
                        currentTime.getFullYear(),
                        currentTime.getMonth(),
                        currentTime.getDate(),
                        +endHours,
                        +endMinutes,
                        0
                    )

                    return startDate >= eveningSlot && endDate <= morningSlot
                })

            setMorningSessions(selectedDatesMorningSessions)
            setEveningSessions(selectedDatesEveningSessions)
            setNoonSessions(selectedDatesNoonSessions)
            setSessions(selectedDatesSessions)
        }
    })

    // eslint-disable-next-line
    const [getOnDemandFitness, { data: get_on_demand, refetch: refetchOnDemand }] = useLazyQuery(
        FETCH_FITNESS_PACKAGE_ON_DEMAND_PT,
        {
            onCompleted: (data) => {
                setOnDemandOffering(data)
                getRecordedFitness({ variables: { id: auth.userid } })
            }
        }
    )

    // eslint-disable-next-line
    const [getRecordedFitness, { data: get_recorded, refetch: refetchRecorded }] = useLazyQuery(
        FETCH_FITNESS_PACKAGE_RECORDED_WITH_DURATION_ONE,
        {
            onCompleted: (data) => {
                loadData(data)
            }
        }
    )

    function loadData(data) {
        const flattenedRecordedOffering = flattenObj({ ...data })
        const flattenedLivestreamAndGroupOffering =
            groupAndliveStreamOffering && flattenObj({ ...groupAndliveStreamOffering })
        const flattenedOnDemandOffering = onDemandOffering && flattenObj({ ...onDemandOffering })

        setOfferingList(
            [
                ...flattenedRecordedOffering.fitnesspackages,
                ...flattenedLivestreamAndGroupOffering.fitnesspackages,
                ...flattenedOnDemandOffering.fitnesspackages
            ].map((currValue) => {
                return {
                    id: currValue.id && currValue.id,
                    name: currValue.packagename && currValue.packagename
                }
            })
        )
    }

    if (offeringSelected) {
        props.onChange(
            JSON.stringify({
                offeringSelected: offeringSelected,
                sessionId: selectedSessionId,
                sessionDate: selectedSessionDate,
                sessionStartTime: selectedSessionStartTime,
                sessionEndTime: selectedSessionEndTime
            })
        )
    } else {
        props.onChange(null)
    }

    function getTimeIn12HourFormat(startTime: string): string {
        const splitTime: string[] = startTime.split(':')
        const date: moment.Moment = moment().set({
            hour: Number(splitTime[0]),
            minute: Number(splitTime[1])
        })
        const time: string = moment(date).format('h:mm A')
        return time
    }

    useEffect(() => {
        refetchSessions()
    }, [selectedSessionDate, offeringSelected])

    return (
        <Fragment>
            {/* Session Date */}
            <label htmlFor="session">Session date:</label>
            <input
                type="date"
                id="sessionDate"
                name="session"
                onChange={(e) => setSelectedSessionDate(e.target.value)}
                min={moment().format('YYYY-MM-DD')}
            ></input>

            {/* Offering selector */}
            <DropdownButton
                variant="dark"
                title={offeringSelectedName ? offeringSelectedName : 'Select offering'}
            >
                {offeringList.map((currentOffering) => (
                    <Dropdown.Item
                        key={currentOffering.id}
                        onClick={() => {
                            setOfferingSelectedName(currentOffering.name)
                            setOfferingSelected(currentOffering.id)
                        }}
                    >
                        {currentOffering.name}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            {/* session slots based on session date */}
            <div className="ml-1 bg-white border rounded p-3 mt-3">
                {Sessions && Sessions.length ? (
                    <>
                        <h3>Select sessions from below</h3>
                        {/* Morning sessions */}
                        {offeringSelectedName ? <h5>Morning sessions</h5> : null}
                        <Row>
                            {morningSession && morningSession.length ? (
                                morningSession.map((currentValue) => (
                                    <Button
                                        variant="dark"
                                        key={currentValue.id}
                                        onClick={() => {
                                            setSelectedSessionId(currentValue.id)
                                            setSelectedSessionEndTime(currentValue.end_time)
                                            setSelectedSessionStartTime(currentValue.start_time)
                                        }}
                                        className="m-1"
                                    >{`${getTimeIn12HourFormat(
                                        currentValue.start_time
                                    )} - ${getTimeIn12HourFormat(currentValue.end_time)}`}</Button>
                                ))
                            ) : (
                                <p className="ml-3">No sessions available</p>
                            )}
                        </Row>

                        {/* Afternoon sessions */}
                        {offeringSelectedName ? <h5>Mid-day sessions</h5> : null}
                        <Row>
                            {noonSessions && noonSessions.length ? (
                                noonSessions.map((currentValue) => (
                                    <Button
                                        key={currentValue.id}
                                        onClick={() => {
                                            setSelectedSessionId(currentValue.id)
                                            setSelectedSessionEndTime(currentValue.end_time)
                                            setSelectedSessionStartTime(currentValue.start_time)
                                        }}
                                        className="m-1"
                                    >{`${getTimeIn12HourFormat(
                                        currentValue.start_time
                                    )} - ${getTimeIn12HourFormat(currentValue.end_time)}`}</Button>
                                ))
                            ) : (
                                <p className="ml-3">No sessions available</p>
                            )}
                        </Row>

                        {/* Evening sessions */}
                        {offeringSelectedName ? <h5>Evening sessions</h5> : null}
                        <Row>
                            {eveningSessions && eveningSessions.length ? (
                                eveningSessions.map((currentValue) => (
                                    <Button
                                        key={currentValue.id}
                                        onClick={() => {
                                            setSelectedSessionId(currentValue.id)
                                            setSelectedSessionEndTime(currentValue.end_time)
                                            setSelectedSessionStartTime(currentValue.start_time)
                                        }}
                                        className="m-1"
                                    >{`${getTimeIn12HourFormat(
                                        currentValue.start_time
                                    )} - ${getTimeIn12HourFormat(currentValue.end_time)}`}</Button>
                                ))
                            ) : (
                                <p className="ml-3">No sessions available</p>
                            )}
                        </Row>
                    </>
                ) : null}
            </div>
        </Fragment>
    )
}

export default classBasedOffering
