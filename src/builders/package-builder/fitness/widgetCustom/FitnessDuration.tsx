
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';

export default function FitnessDuration(props) {
    console.log('duration props', props)
    const { widgetProps, type, actionType, userData } = props;
    console.log('widgetProps.duration value', widgetProps.value);
    console.log(userData)

    const [value, setValue] = useState(30);

    useEffect(() => {
        if(userData.duration){
            setValue(userData.duration)
        }
    }, [userData])

    return <>
        {(type === "Classic Class") &&
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Duration:</Form.Label>
                        <Form.Control type="email" placeholder="Enter number of days ..."
                            // value={widgetProps.value === "" ? 30 : widgetProps.value}
                            value={value}

                            disabled={(actionType === "view") ? true : false}
                            onChange={(e) => {
                                widgetProps.schema.value = e.target.value
                                widgetProps.onChange(e.target.value)
                            }} />
                    </Form.Group>
                </Form>


                <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
                    <p className='m-0'>Set for {widgetProps.schema.value === "" ? 30 : widgetProps.value} days</p>
                </div>
            </div>
        }
    </>
}

