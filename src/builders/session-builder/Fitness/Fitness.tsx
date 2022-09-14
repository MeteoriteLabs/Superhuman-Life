import React from 'react'
import { Card, Tab, Tabs } from "react-bootstrap";
import Group from './Group/Group'
import PT from './PT/PT';
import Classic from './Classic/Classic';
import Custom from './Custom/Custom';
import Channel from './Channel/channel';
import Cohort from './Cohort/cohort';
import './fitness.css'

export default function Fitness() {
    return (
        <div>
             <Card className="shadow-sm mt-2" border="light">
                <Card.Body>
                    <Tabs  variant="pills" transition={false} defaultActiveKey="pt">
                        <Tab eventKey="pt" title="One-On-One">
                            <PT/>
                        </Tab>
                        <Tab eventKey="group" title="Group">
                            <Group/>
                        </Tab>
                        <Tab eventKey="classic" title="Classic">
                            <Classic/>
                        </Tab>
                        <Tab eventKey="custom" title="Custom">
                            <Custom/>
                        </Tab>
                        <Tab eventKey="channel" title="Channel">
                            <Channel />
                        </Tab>
                        <Tab eventKey="cohort" title="Cohort">
                            <Cohort />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    )
}
