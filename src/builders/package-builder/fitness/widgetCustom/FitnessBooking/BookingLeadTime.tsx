
import  { Fragment, useState } from 'react'
import TimeField from 'react-simple-timefield';
import './bookingleadtime.css'


export default function BookingLeadTime({ widgetProps, actionType, userData }) {




    const [time] = useState()


    const handleChange = (e, widgetProps,) => {

        widgetProps.onChange(e.target.value);

    }

    return <Fragment>
        {userData.mode === "Online Workout" || userData.mode === "Offline Workout" ?
            <Fragment>
                <h2>For Workout</h2>
                <p>Consumer can choose start time, Before</p>
                <TimeField
                    value={userData.bookingleadtime ? userData.bookingleadtime : time}
                    onChange={e => handleChange(e, widgetProps)}
                    input={
                        <input type="text"
                            disabled={(actionType === "view") ? true : false}
                            className="timeInput"
                        />
                    }
                    colon=":"
                    showSeconds={false}

                />

                <div>
                    <p>You can change this from the schdeule later - Avaliability settings</p>
                </div>
            </Fragment> : ""
        }
    </Fragment>
}

