//this availability check is for modal actions
import moment from 'moment'
import { flattenObj } from '../../../../components/utils/responseFlatten'

export const AvailabilityCheck = (props: any) => {
    const sessions = flattenObj({ ...props.sessions })
    const newTime = JSON.parse(props.event.time)

    function convertToMomnet(time: string) {
        const timeSplit = time.split(':').map(Number)
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] })
    }
    const newTimeStart = convertToMomnet(newTime.startTime)
    const newTimeEnd = convertToMomnet(newTime.endTime)

    for (let j = 0; j < sessions.length; j++) {
        if (
            convertToMomnet(sessions[j]?.start_time).isSameOrAfter(newTimeStart) &&
            convertToMomnet(sessions[j]?.start_time).isSameOrBefore(newTimeEnd)
        ) {
            return true
        }
    }
    return false
}
