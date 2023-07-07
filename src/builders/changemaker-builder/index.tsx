import { Card, Tab, Tabs, Button } from 'react-bootstrap';
import DayView from './dayView';
import WeekView from './weekView';

export default function ProgramPage() {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Schedule</h2>
                <div className="px-5">
                    <Button
                        onClick={() => (window.location.href = '/availability')}
                        variant="dark"
                    >
                        Availability
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs defaultActiveKey="day" variant="pills" className="pb-3 cards">
                        <Tab eventKey="day" title="Day">
                            <DayView />
                        </Tab>
                        <Tab eventKey="week" title="Week">
                            <WeekView />
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </div>
    );
}
