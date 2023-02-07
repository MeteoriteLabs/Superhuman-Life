// eslint-disable-next-line no-use-before-define
import React, { Card, Tab, Tabs } from 'react-bootstrap';
import Group from './Group/Group';
import PT from './PT/PT';
import Classic from './Classic/Classic';
import Custom from './Custom/Custom';
import Channel from './Channel/channel';
import Cohort from './Cohort/cohort';
import './fitness.css';

export default function Fitness() {
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
            <Tab eventKey="pt" title="One-On-One" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
              <PT />
            </Tab>
            <Tab eventKey="group" title="Group" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
              <Group />
            </Tab>
            <Tab eventKey="classic" title="Recorded" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
              <Classic />
            </Tab>
            <Tab eventKey="custom" title="Custom">
              <Custom />
            </Tab>
            <Tab eventKey="liveStream" title="Live Stream" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
              <Channel />
            </Tab>
            <Tab eventKey="cohort" title="Cohort">
              <Cohort />
            </Tab>
          </Tabs>

        </Card.Body>
      </Card>
    </div>
  );
}
