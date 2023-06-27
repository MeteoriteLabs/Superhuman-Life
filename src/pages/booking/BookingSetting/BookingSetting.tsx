import { Card, Tab, Tabs } from 'react-bootstrap'
import * as Icon from 'react-bootstrap-icons'
import { NavLink } from 'react-router-dom'
import BookingFitness from './BookingFitness/BookingFitness'

export default function BookingSetting(props) {
    return (
        <div>
            <div className="d-flex justify-content-start align-items-center">
                <NavLink to="bookings">
                    <Icon.ArrowLeftCircle
                        className="mr-3"
                        style={{ fontSize: '2rem', cursor: 'pointer', color: 'black' }}
                    />
                </NavLink>
                <h1>Booking settings</h1>
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs
                        style={{ borderBottom: '1px solid black' }}
                        className="pb-3"
                        transition={false}
                        defaultActiveKey="bookingFitness"
                    >
                        <Tab eventKey="bookingFitness" title="Fitness">
                            <BookingFitness />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
