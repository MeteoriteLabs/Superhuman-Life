import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import MonthlySalesGraph from './MonthlySalesGraph';
import WeeklySalesGraph from './WeeklySalesGraph';
import '../Styles/navTabStyles.css';

const SalesGraph: React.FC = () => {
    return (
        <div>
            <Tabs defaultActiveKey="monthly">
                <Tab eventKey="monthly" title="Monthly">
                    <MonthlySalesGraph />
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                    <WeeklySalesGraph />
                </Tab>
            </Tabs>
        </div>
    );
};

export default SalesGraph;
