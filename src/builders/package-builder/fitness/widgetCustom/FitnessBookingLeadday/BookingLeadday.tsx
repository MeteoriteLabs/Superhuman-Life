import React from 'react'
import Form from 'react-bootstrap/Form'


export default function BookingLeadday({widgetProps, actionType}) {

    
    return <div>
    <h2>For Programs</h2>
    <p>Consumer can choose start date, after</p>
    <Form.Group>
        <Form.Control 
            value={widgetProps.value}
           disabled={(actionType === "view") ? true : false}
         onChange={(e) => widgetProps.onChange(e.target.value)}>
          
        </Form.Control>
    </Form.Group>
    <p>The lead time will allow you to discuss, understand, request data and then build a custom program </p>
</div>
}
