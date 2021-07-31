
import React, { Fragment, useState } from 'react'
import { Form } from 'react-bootstrap';
import TimeField from 'react-simple-timefield';
import  './bookingleadtime.css'


export default function BookingLeadTime({ widgetProps, actionType, userData }) {
    // const arrTime = [30, 60, 90, 180]




    // const [value, setValue] = useState("0:00");

    // const onChange = (event) => {
    //     widgetProps.onChange(event.target.value)
    //     setValue(event.target.value);
    // };



    // const onBlur = (event) => {
    //     const value = event.target.value;
    //     const seconds = Math.max(0, getSecondsFromHHMMSS(value));

    //     const time = toHHMMSS(seconds);
    //     setValue(time);

    // }

    // const getSecondsFromHHMMSS = (value) => {
    //     const [str1, str2, str3] = value.split(":");

    //     const val1 = Number(str1);
    //     const val2 = Number(str2);
    //     const val3 = Number(str3);

    //     if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
    //         // seconds
    //         return val1;
    //     }

    //     if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
    //         // minutes * 60 + seconds
    //         return val1 * 60 + val2;
    //     }

    //     if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
    //         // hours * 60 * 60 + minutes * 60 + seconds
    //         return val1 * 60 * 60 + val2 * 60 + val3;
    //     }

    //     return 0;
    // };

    // const toHHMMSS = (secs) => {
    //     const secNum = parseInt(secs.toString(), 10);
    //     const hours = Math.floor(secNum / 3600);
    //     const minutes = Math.floor(secNum / 60) % 60;
    //     const seconds = secNum % 60;

    //     return [hours, minutes, seconds]
    //         .map((val) => (val < 10 ? `0${val}` : val))
    //         .filter((val, index) => val !== "00" || index > 0)
    //         .join(":")
    //         .replace(/^0/, "");

    // };


    const [time, setTime] = useState()


    const handleChange = (e, widgetProps,) => {
        widgetProps.onChange(e.target.value);

    }

    return <Fragment>
        {userData.mode === "Workout" ?
            <Fragment>
                <h2>For Workout</h2>
                <p>Consumer can choose start time, Before</p>


                <TimeField

                    value={time}// {String}   required, format '00:00' or '00:00:00'
                    onChange={e => handleChange(e, widgetProps)}      // {Function} required
                    input={

                        // <Form>
                        //     <Form.Group>

                        //         <Form.Control
                        //             type="text"


                        //             disabled={(actionType === "view") ? true : false}

                        //         />
                        //     </Form.Group>
                        // </Form>
                        <input type="text"
                            disabled=  {(actionType === "view") ? true : false}
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