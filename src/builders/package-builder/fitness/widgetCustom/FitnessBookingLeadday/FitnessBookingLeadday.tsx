import Form from 'react-bootstrap/Form'
import React from 'react'
import './FitnessBookingLeadday.css'

export default function FitnessBookingLeadday(props) {
    const { userData, widgetProps } = props;
    console.log('widgetProps  ', widgetProps)



    const renderProgram = () => {
        return <div>
            <h2>For Programs</h2>
            <p>Consumer can choose start date, after</p>
            <Form.Group>
                <Form.Control as="select" onChange={(e) => widgetProps.onChange(e.target.value)}>
                    <option value="0"></option>
                    <option value="1">1 days</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="4">4 days</option>
                    <option value="5">5 days</option>
                    <option value="6">6 days</option>
                </Form.Control>
            </Form.Group>
            <p>The lead time will allow you to discuss, understand, request data and then build a custom program </p>
        </div>
    }



    const renderWorkout = () => {
        const arrTime = [30, 60, 90, 180]
        return <div>
            <h2>For Workout</h2>
            <p>Consumer can choose start time, Before</p>
            <div className="container d-flex mb-3">
                    {arrTime.map((item, index) => {
                        return <div key={index}>
                            <input className="hidden radio-label" 
                            value={item} 
                            id={`index-${index}`} 
                            type="radio"
                            name="accept-offers" 
                            onChange={e => widgetProps.onChange(Number(e.target.value))}/>
                            <label className="button-label" htmlFor={`index-${index}`}>
                                <h1>{item} mins</h1>
                            </label>
                        </div>
                    })}
            </div>
            <p>You can change this from the schdeule later - Avaliability settings</p>
        </div>
    }

    return (
        <div>
            {userData.mode !== "Workout" ? renderProgram() : renderWorkout()}
        </div>
    )
}
