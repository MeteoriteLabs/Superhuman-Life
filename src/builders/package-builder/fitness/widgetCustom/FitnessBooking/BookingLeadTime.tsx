
import React, { Fragment, useState } from 'react'
import { Form } from 'react-bootstrap';
import TimeField from 'react-simple-timefield';
import './bookingleadtime.css'


export default function BookingLeadTime({ widgetProps, actionType, userData }) {
    // const arrTime = [30, 60, 90, 180]

    console.log("userData", userData)


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


// export const MyCustomInputElement = ({ time, actionType }) => {
//     return <Form>
// {/* <Form>
// <Form.Group>
//    <Form.Label>Duration:</Form.Label>
//    <Form.Control
//        type="text"
//        placeholder="Enter minutes ..."
//        value={value}
//        disabled={(actionType === "view") ? true : false}
//        onBlur={onBlur}
//        onChange={onChange}/>
// </Form.Group>
// </Form> */}

// {/* <div className="container d-flex mb-3">
// {arrTime.map((item, index) => {
//    return <div key={index}>
//    <input className="hidden radio-label"
//    value={item}
//    id={`index-${index}`}
//    type="radio"
//    name="accept-offers"
//    onChange={e => widgetProps.onChange(Number(e.target.value))} />
//    <label className="button-label" htmlFor={`index-${index}`}>
//    <h1>{item} mins</h1>
//    </label>
//    </div>
// })}
// </div> */}


//         <Form.Group>
//             {/* <Form.Label>Duration:</Form.Label> */}
//             <Form.Control
//                 type="text"
//                 // placeholder="Enter minutes ..."
//                 value={time}
//                 disabled={(actionType === "view") ? true : false}
//             // onBlur={onBlur}
//             // onChange={e => console.log(e.target.value)}
//             />
//         </Form.Group>
//     </Form>

// }