
import React from 'react'
import {Form } from 'react-bootstrap';

export default function FitnessDuration(props) {
    console.log(props)
    const { widgetProps, type, actionType } = props;
    console.log('widgetProps.value', widgetProps.value)

    return <>
        {type === "Classic Class" && actionType !== "view" &&
            <Form>
                <Form.Group>
                    <Form.Label>Duration:</Form.Label>
                    <Form.Control type="email" placeholder="Enter number of days ..."
                        onChange={(e) => {
                            widgetProps.schema.value = e.target.value
                            widgetProps.onChange(e.target.value)

                        }} />
                </Form.Group>

            </Form>

        }
        <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for {widgetProps.schema.value === "" ? 30 : widgetProps.schema.value} days</p>
        </div>

    </>
}


// "properties": {
//     "duration": {
//         "type": "number",
//         "title": "Duration"
//     }
// },
// "dependencies": {
//     "duration": {
//         "properties": {
//             "days": {
//                 "title": "A null field",
//                 "type": "number",
//                 "value": ""
//             },
//             "recordedclasses": {
//                 "title": "Recorded",
//                 "type": "number",
//                 "minimum": 0,
//                 "maximum": 30,
//                 "default": "0",
//                 "value": 0
//             },
//             "restdays": {
//                 "title": "Rest Days",
//                 "type": "number",
//                 "minimum": 0,
//                 "maximum": 30,
//                 "default": 0,
//                 "value": ""
//             }
//         }
//     }
// }



// "duration": {
//     "type": "number",
//     "title": "Duration",
//     "default":30
// },
// "days": {
//     "title": "A null field",
//     "type": "number",
//     "value": ""
// },
// "recordedclasses": {
//     "title": "Recorded",
//     "type": "number",
//     "minimum": 0,
//     "maximum": 30,
//     "default": "0",
//     "value": 0
// },
// "restdays": {
//     "title": "Rest Days",
//     "type": "number",
//     "minimum": 0,
//     "maximum": 30,
//     "default": 0,
//     "value": ""
// }