import { Card, Tab, Tabs } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Movement from "./Movement/Movement"
import Nutrition from "./Nutrition/Nutrition"
import Journey from "./Journey/Journey"
import Events from "./Events/Events"
import React from "react";
import * as Icon from 'react-bootstrap-icons';

export default function BookingPage() {

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h1><span style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>All Boo</span>kings</h1>
                <div className='px-5'>
                    <NavLink to='/bookingSettings'><Icon.Gear style={{ fontSize: '2rem' }} /></NavLink>
                </div>
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs style={{ borderBottom: "1px solid black" }} className="pb-3" variant="pills" transition={false} defaultActiveKey="movement">
                        <Tab eventKey="movement" title="Movement">
                            <Movement />
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
