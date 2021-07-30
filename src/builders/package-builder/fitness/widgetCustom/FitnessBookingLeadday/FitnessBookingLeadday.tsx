
import React from 'react'

import BookingLeadTime from './BookingLeadTime';
import BookingLeadday from './BookingLeadday';

export default function FitnessBookingLeadday(props) {
    const { userData, widgetProps, actionType } = props;

    return (
        <div>
            {userData.mode !== "Workout" ?
                <BookingLeadday widgetProps={widgetProps} actionType={actionType} /> : <BookingLeadTime widgetProps={widgetProps} actionType={actionType}/>
            }
        </div>
    )
}
