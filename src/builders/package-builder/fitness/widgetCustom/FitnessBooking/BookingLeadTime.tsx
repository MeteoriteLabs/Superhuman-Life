import React, { Fragment, useState } from 'react';
import TimeField from 'react-simple-timefield';
import './bookingleadtime.css';

const BookingLeadTime: React.FC<{ widgetProps: any; actionType: any; userData: any }> = (props) => {
    const [time] = useState();

    const handleChange = (e, widgetProps) => {
        widgetProps.onChange(e.target.value);
    };

    return (
        <Fragment>
            {props.userData.mode === 'Online Workout' ||
            props.userData.mode === 'Offline Workout' ? (
                <Fragment>
                    <h2>For Workout</h2>
                    <p>Consumer can choose start time, Before</p>
                    <TimeField
                        value={
                            props.userData.bookingleadtime ? props.userData.bookingleadtime : time
                        }
                        onChange={(e) => handleChange(e, props.widgetProps)}
                        input={
                            <input
                                type="text"
                                disabled={props.actionType === 'view' ? true : false}
                                className="timeInput"
                            />
                        }
                        colon=":"
                        showSeconds={false}
                    />
                    <div>
                        <p>You can change this from the schdeule later - Avaliability settings</p>
                    </div>
                </Fragment>
            ) : (
                ''
            )}
        </Fragment>
    );
};

export default BookingLeadTime;
