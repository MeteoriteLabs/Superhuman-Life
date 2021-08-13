import React from 'react'
import Form from 'react-bootstrap/Form'


export default function BookingLeadday({ widgetProps, actionType, userData }) {



    return <>
        {(userData.mode === "Online" || userData.mode === "Offline" || userData.mode === "Hybrid") ?
            <>
                <h2>For Programs</h2>
                <p>Consumer can choose start date, after</p>
                <Form>
                    <Form.Group>
                        <Form.Control
                            disabled={actionType === "view" ? true : false}
                            as="select"
                            aria-label="Default select example"
                            value={widgetProps.value && widgetProps.value}
                            onChange={e => widgetProps.onChange(e.target.value)}
                        
                        >
                            <option>Select the lead day</option>
                            <option value="1">1 day</option>
                            <option value="2">2 days</option>
                            <option value="3">3 days</option>
                            <option value="4">4 days</option>
                            <option value="5">5 days</option>
                            <option value="6">6 days</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
                <p>The lead time will allow you to discuss, understand, request data and then build a custom program </p>
            </>
            : ""
        }

        
    </>
}
