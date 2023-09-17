import { Card, Tab, Tabs } from 'react-bootstrap';
import ExercisesTab from '../exercises';
import WorkoutTab from '../workout';
import ProgramTab from '../program';

export default function FitnessTab(industry): JSX.Element {
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
                        <ExercisesTab industry={industry}/>
                    </Tab>
                    <Tab eventKey="workout" title="Workout">
                        <WorkoutTab industry={industry}/>
                    </Tab>
                    <Tab eventKey="program" title="Program Template">
                        <ProgramTab industry={industry}/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}
