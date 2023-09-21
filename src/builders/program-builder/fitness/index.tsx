import { Card, Tab, Tabs } from 'react-bootstrap';
import ExercisesTab from '../exercises';
import WorkoutTab from '../workout';
import ProgramTab from '../program';
import SessionTab from '../Session';

export default function FitnessTab(industry): JSX.Element {
    console.log(industry);
    return (
        <Card className="shadow-sm mt-3" border="light">
            <Card.Body>
                <Tabs
                    style={{ borderBottom: '1px solid black' }}
                    className="pb-3 cards"
                    variant="pills"
                    transition={false}
                    defaultActiveKey={
                        industry.selectedIndustry === 'Fitness & Sports' ? 'exercises' : 'Session'
                    }
                    onSelect={(key) => console.log(key)}
                >
                    {industry.selectedIndustry === 'Fitness & Sports' ? (
                        <Tab eventKey="exercises" title="Exercises">
                            <ExercisesTab industry={industry} />
                        </Tab>
                    ) : null}

                    {industry.selectedIndustry === 'Fitness & Sports' ? (
                        <Tab eventKey="workout" title="Workout">
                            <WorkoutTab industry={industry} />
                        </Tab>
                    ) : (
                        <Tab eventKey="Session" title="Session">
                            <SessionTab industry={industry} />
                        </Tab>
                    )}

                    <Tab eventKey="program" title="Program Template">
                        <ProgramTab industry={industry} />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
}
