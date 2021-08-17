import React from 'react'
import { Card, Tab, Tabs } from "react-bootstrap";
import Program from '../Program/Program'
import Workout from '../Workout/Workout';
import './fitness.css'

export default function Fitness() {
    return (
        <div>
             <Card className="shadow-sm mt-2" border="light">
                <Card.Body>
                    <Tabs  variant="pills" transition={false} defaultActiveKey="program">
                        <Tab eventKey="workout" title="Workout">
                            <Workout/>
                        </Tab>
                        <Tab eventKey="program" title="Program">
                            <Program/>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
