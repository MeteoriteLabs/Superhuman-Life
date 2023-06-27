import { Tab, Tabs } from 'react-bootstrap';
import MonthlyOfferingBookingGraph from './MonthlyOfferingBookingGraph';
import WeeklyOfferingBookingGraph from './WeeklyOfferingBookingGraph';
import '../Styles/navTabStyles.css';

function OfferingBookingGraph(): JSX.Element {
    return (
        <div>
            <Tabs defaultActiveKey="monthly">
                <Tab eventKey="monthly" title="Monthly">
                    <MonthlyOfferingBookingGraph />
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                    <WeeklyOfferingBookingGraph />
                </Tab>
            </Tabs>
        </div>
    );
}

export default OfferingBookingGraph;
