import React, { useState } from 'react'
import Schedular from '../../../../../builders/program-builder/program-template/scheduler'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { GET_CLIENT_SESSIONS } from './queries'
import { flattenObj } from '../../../../../components/utils/responseFlatten'

const SchedulerScreen = (props: any) => {
    const clientsSessions = window.location.href.split('/').pop()
    const [scheduleDate, setScheduleDate] = useState(moment().format('YYYY-MM-DD'))
    const [restDays, setRestDays] = useState<any>([])

    function handleDatePicked(date: any) {
        setScheduleDate(date)
    }

    function handleSubChangeDay(scheduleDate: any) {
        setScheduleDate(moment(scheduleDate).subtract(1, 'months').format('YYYY-MM-DD'))
    }

    function handleAddChangeDay(date: any) {
        setScheduleDate(moment(scheduleDate).add(1, 'months').format('YYYY-MM-DD'))
    }

    useQuery(GET_CLIENT_SESSIONS, {
        variables: {
            id: clientsSessions,
            startDate: moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD')).format(
                'YYYY-MM-DD'
            ),
            endDate: moment(moment(scheduleDate).startOf('month').format('YYYY-MM-DD'))
                .add(moment(scheduleDate).daysInMonth() - 1, 'days')
                .format('YYYY-MM-DD')
        },
        onCompleted: (data: any) => {
            const flattenData = flattenObj({ ...data })
            setRestDays(flattenData)
        }
    })

    return (
        <div>
            <div className="text-center mb-4">
                <input
                    min={moment().subtract(3, 'months').format('YYYY-MM-DD')}
                    max={moment().add(3, 'months').format('YYYY-MM-DD')}
                    className="p-1 rounded shadow-sm mb-3"
                    type="date"
                    style={{
                        border: 'none',
                        backgroundColor: 'rgba(211,211,211,0.8)'
                    }}
                    value={scheduleDate}
                    onChange={(e) => handleDatePicked(e.target.value)}
                />{' '}
                <br />
                <span
                    onClick={() => {
                        // handleTimeUpdate(scheduleDay - 1);
                        handleSubChangeDay(scheduleDate)
                    }}
                    className="rounded-circle"
                >
                    <i className="fa fa-chevron-left mr-5" style={{ cursor: 'pointer' }}></i>
                </span>
                <span>
                    <b>
                        {moment().format('YYYY-MM-DD') === scheduleDate
                            ? moment().format('MMMM')
                            : moment(scheduleDate).format('MMMM')}
                    </b>
                </span>
                <span
                    onClick={() => {
                        // handleTimeUpdate(scheduleDay + 1);
                        handleAddChangeDay(scheduleDate)
                    }}
                >
                    <i className="fa fa-chevron-right ml-5" style={{ cursor: 'pointer' }}></i>
                </span>
            </div>
            <Schedular
                type="date"
                days={moment(scheduleDate).daysInMonth()}
                classType={'One-On-One'}
                restDays={restDays.sessionsBookings}
                programId={clientsSessions}
                startDate={moment(scheduleDate).startOf('month').format('YYYY-MM-DD')}
                clientId={1}
                clientSessions={true}
            />
        </div>
    )
}

export default SchedulerScreen
