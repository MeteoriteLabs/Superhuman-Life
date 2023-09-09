import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import Group from './Group/Group';
import PT from './PT/PT';
import Classic from './Classic/Classic';
import Custom from './Custom/Custom';
import Channel from './Channel/channel';
import Cohort from './Cohort/cohort';
import Event from './Event/event';
import './fitness.css';

const Fitness: React.FC<{industry: any;}> = (industry) => {
    return (
        <div>
            <Card className="shadow-sm mt-2" border="light">
                <Card.Body>
                    <Tabs
                        variant="pills"
                        transition={false}
                        defaultActiveKey="pt"
                        className="cards"
                    >
                        <Tab
                            eventKey="pt"
                            title="One-On-One"
                            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                        >
                            <PT industry={industry}/>
                        </Tab>
                        <Tab
                            eventKey="group"
                            title="Group"
                            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                        >
                            <Group industry={industry}/>
                        </Tab>
                        <Tab
                            eventKey="classic"
                            title="Recorded"
                            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                        >
                            <Classic industry={industry}/>
                        </Tab>
                        <Tab eventKey="custom" title="Custom">
                            <Custom industry={industry}/>
                        </Tab>
                        <Tab
                            eventKey="liveStream"
                            title="Live Stream"
                            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                        >
                            <Channel industry={industry}/>
                        </Tab>
                        <Tab eventKey="cohort" title="Cohort">
                            <Cohort industry={industry}/>
                        </Tab>
                        <Tab eventKey="event" title="Event">
                            <Event industry={industry}/>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Fitness;
