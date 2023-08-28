//this availability check is for modal actions
import moment from 'moment';
import { flattenObj } from 'components/utils/responseFlatten';

export const AvailabilityCheck = (props: any) => {
    
    const sessions = flattenObj({ ...props.sessions });
    const newTime = props.event && props.event.time ? JSON.parse(props.event.time) : null;

    function convertToMoment(time: string) {
        const timeSplit = time.split(':').map(Number);
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
    }
    const newTimeStart = newTime && newTime.startTime ? convertToMoment(newTime.startTime) : null;
    const newTimeEnd = newTime && newTime.endTime ? convertToMoment(newTime.endTime) : null;

    for (let j = 0; j < sessions.length; j++) {
        if (
            convertToMoment(sessions[j]?.start_time).isSameOrAfter(newTimeStart) &&
            convertToMoment(sessions[j]?.start_time).isSameOrBefore(newTimeEnd)
        ) {
            return true;
        }
    }
    return false;
};
