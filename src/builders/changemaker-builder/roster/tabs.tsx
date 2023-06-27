import { Tabs, Tab } from 'react-bootstrap';
import RosterGeneral from './general';
import RosterAgenda from './agenda';
import RosterAttendees from './attendees';
import RosterSettings from './settings';

const RosterTab = (props: any) => {
    return (
        <>
            <Tabs
                defaultActiveKey="general"
                transition={false}
                id="noanim-tab-example"
                className="mb-3"
                variant="pills"
            >
                <Tab eventKey="general" title="General">
                    <RosterGeneral data={props.data} />
                </Tab>
                <Tab eventKey="agenda" title="Agenda">
                    <RosterAgenda data={props.data} />
                </Tab>
                <Tab eventKey="attendees" title="Attendees">
                    <RosterAttendees />
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <RosterSettings data={props.data} />
                </Tab>
            </Tabs>
        </>
    );
};

export default RosterTab;
