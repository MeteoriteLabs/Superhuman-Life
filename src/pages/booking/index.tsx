import { Card, Tab, Tabs } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import Fitness from "./Fitness/Fitness"
import Nutrition from "./Nutrition/Nutrition"
import Journey from "./Journey/Journey"
import Events from "./Events/Events"
import React from "react";

export default function BookingPage() {
    const location = useLocation();

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h1><span style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>All Boo</span>kings</h1>
                <div className='px-5'>
                    <NavLink to='/bookingSettings' style={{ padding: '0.5rem 6rem', borderRadius: "20px", fontWeight: 'bold', border:'1px solid black', color:'black' }}>Setting</NavLink>
                </div>
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs style={{ borderBottom: "1px solid black" }} className="pb-3" variant="pills" transition={false} defaultActiveKey="fiteness">
                        <Tab eventKey="fiteness" title="Fiteness">
                            <Fitness />
                        </Tab>
                        <Tab eventKey="nutrition" title="Nutrition">
                            <Nutrition />
                        </Tab>
                        <Tab eventKey="journey" title="Journey">
                            <Journey />
                        </Tab>
                        <Tab eventKey="events" title="Events">
                            <Events />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

        </div>
    );
}
