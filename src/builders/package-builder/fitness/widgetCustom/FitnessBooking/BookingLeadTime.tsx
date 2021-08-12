
import React, { Fragment, useState } from 'react'
import { Form } from 'react-bootstrap';
import TimeField from 'react-simple-timefield';
import './bookingleadtime.css'


export default function BookingLeadTime({ widgetProps, actionType, userData }) {
    // const arrTime = [30, 60, 90, 180]



    const [time, setTime] = useState()


    const handleChange = (e, widgetProps,) => {
      
        widgetProps.onChange(e.target.value);

    }

    return <Fragment>
        {userData.mode === "Online Workout" || userData.mode === "Offline Workout" ?
            <Fragment>
                <h2>For Workout</h2>
                <p>Consumer can choose start time, Before</p>
                <TimeField
                    value={userData.bookingleadtime ? userData.bookingleadtime : time}// {String}   required, format '00:00' or '00:00:00'
                    onChange={e => handleChange(e, widgetProps)}      // {Function} required
                    input={
                        <input type="text"
                            disabled={(actionType === "view") ? true : false}
                            className="timeInput"
                        />
                    } // {Element}  default: <input type="text" />
                    colon=":"                        // {String}   default: ":"
                    showSeconds={false}                               // {Boolean}  default: false

                />

                <div>
                    <p>You can change this from the schdeule later - Avaliability settings</p>
                </div>
            </Fragment> : ""
        }
    </Fragment>
}

