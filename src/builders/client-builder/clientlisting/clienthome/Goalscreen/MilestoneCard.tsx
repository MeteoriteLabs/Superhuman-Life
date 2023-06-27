import { Card } from 'react-bootstrap'
import './GoalCard.css'

function MilestoneCard(props: any) {
    return (
        <Card border="secondary" className="goalCard">
            <Card.Body>
                <Card.Title>
                    <div className="d-flex flex-column ">
                        <div className="p-2 bd-highlight">
                            <h4>Milestone</h4>
                        </div>
                        <div className="d-flex flex-wrap">
                            <p className="milestoneCard">Loose Weight</p>
                            <p className="milestoneCard">Muscle Gain</p>
                            <p className="milestoneCard">Stamina</p>
                        </div>
                    </div>
                </Card.Title>
                <Card.Text as="div">
                    <div className="d-flex">
                        <div className="flex-fill">
                            <p className="font-weight-bold p-1">
                                Start Date: 12.10.2021{props.startDate}
                            </p>
                        </div>
                        <div className="flex-fill">
                            <p className="font-weight-bold p-1">
                                End Date: 12.11.2021{props.endDate}
                            </p>
                        </div>
                    </div>
                </Card.Text>
            </Card.Body>
            <Card.Header>
                <div className="d-flex">
                    <div className="flex-fill">
                        <p className="font-weight-bold">Updated By:</p>
                        <div className="d-flex flex-row ">
                            <img
                                src="/assets/avatar-1.jpg"
                                height="50"
                                className="rounded-circle"
                                alt="avatar"
                            />
                            <p className="font-weight-bold p-2">Arjun Nair{props.updatedBy}</p>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <p className="font-weight-bold">Updated On:</p>
                        <p className="font-weight-bold">12.09.2021{props.updatedOn}</p>
                    </div>
                </div>
            </Card.Header>
        </Card>
    )
}

export default MilestoneCard
