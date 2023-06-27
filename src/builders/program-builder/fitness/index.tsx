import { Card, Tab, Tabs } from 'react-bootstrap';
import ExercisesTab from '../exercises';
import WorkoutTab from '../workout';
import ProgramTab from '../program';

export default function FitnessTab(): JSX.Element {
    return (
        <Card className="shadow-sm mt-3" border="light">
            <Card.Body>
                <Tabs
                    style={{ borderBottom: '1px solid black' }}
                    className="pb-3 cards"
                    variant="pills"
                    transition={false}
                    defaultActiveKey="exercises"
                >
                    <Tab eventKey="exercises" title="Exercises">
                        <ExercisesTab />
                    </Tab>
                    <Tab eventKey="workout" title="Workout">
                        <WorkoutTab />
                    </Tab>
                    <Tab eventKey="program" title="Program Template">
                        <ProgramTab />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}
