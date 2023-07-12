import moment from 'moment';
import { flattenObj } from 'components/utils/responseFlatten';

export const AvailabilityCheck = (props: any) => {
    if (props.event.tag === 'Group Class') {
        return false;
    }
    const sessions = flattenObj({ ...props.sessions });
    const event = props.event;
    const newTime = JSON.parse(props.time.startChange);

    function convertToMomnet(time: string) {
        const timeSplit = time.split(':').map(Number);
        return moment().set({ hour: timeSplit[0], minute: timeSplit[1] });
    }

    const newTimeStart = convertToMomnet(newTime.startTime);
    const newTimeEnd = convertToMomnet(newTime.endTime);
    const oldTimeStart = convertToMomnet(event.hour + ':' + event.min);
    const oldTimeEnd = convertToMomnet(event.endHour + ':' + event.endMin);
    if (newTime.startTime === '') {
        for (let i = 0; i < sessions.length; i++) {
            if (
                convertToMomnet(sessions[i].start_time).isSameOrAfter(oldTimeStart) &&
                convertToMomnet(sessions[i].start_time).isSameOrBefore(oldTimeEnd)
            ) {
                return true;
            }
        }
    } else {
        for (let j = 0; j < sessions.length; j++) {
            if (
                convertToMomnet(sessions[j].start_time).isSameOrAfter(newTimeStart) &&
                convertToMomnet(sessions[j].start_time).isSameOrBefore(newTimeEnd)
            ) {
                return true;
            }
        }
    }
    return false;
};
