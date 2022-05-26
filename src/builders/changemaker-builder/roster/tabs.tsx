import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import RosterGeneral from './general';
import RosterAgenda from './agenda';
import RosterAttendees from './attendees';
import RosterSettings from './settings';

const RosterTab = () => {
    return (
        <>
            <Tabs
                defaultActiveKey="general"
                transition={false}
                id="noanim-tab-example"
                className="mb-3"
                variant='pills'
            >
                <Tab eventKey="general" title="General">
                    <RosterGeneral />
                </Tab>
                <Tab eventKey="agenda" title="Agenda">
                    <RosterAgenda />
                </Tab>
                <Tab eventKey="attendees" title="Attendees">
                    <RosterAttendees />
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <RosterSettings />
                </Tab>
            </Tabs>
        </>
    );
};

export default RosterTab;