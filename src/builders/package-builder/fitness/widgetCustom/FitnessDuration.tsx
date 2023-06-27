import React from 'react'
import { Form } from 'react-bootstrap'

const FitnessDuration: React.FC<{ widgetProps: any; type: any; actionType: any; userData: any }> = (
    props
) => {
    return (
        <>
            {props.type === 'Classic Class' && (
                <div>
                    <Form.Group>
                        <Form.Label>Duration:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter number of days ..."
                            value={props.widgetProps.value ? props.widgetProps.value : 30}
                            disabled={props.actionType === 'view' ? true : false}
                            onChange={(e) => {
                                props.widgetProps.schema.value = e.target.value
                                props.widgetProps.onChange(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <div
                        className="text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5"
                        style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}
                    >
                        <p className="m-0">
                            Set for {props.widgetProps.value ? props.widgetProps.value : 30} days
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default FitnessDuration
