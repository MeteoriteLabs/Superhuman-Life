import { Card } from "react-bootstrap";
import "./GoalCard.css";

function GoalCard(props: any) {
     return (
          <Card border="secondary" className="goalCard">
               <Card.Body>
                    <Card.Title>
                         <h4>{props.goalName}</h4>
                    </Card.Title>
                    <Card.Text as="div">
                         <div className="d-flex">
                              <div className="flex-fill">
                                   <p className="font-weight-bold p-1">Start Date:</p>
                                   <p className="p-1">{props.startDate}</p>
                              </div>
                              <div className="flex-fill">
                                   <p className="font-weight-bold p-1">End Date:</p>
                                   <p className="p-1">{props.endDate}</p>
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
                                   <p className="p-2">{props.updatedBy}</p>
                              </div>
                         </div>
                         <div className="flex-fill">
                              <p className="font-weight-bold">Updated On:</p>
                              <p className="p-1">{props.updatedOn}</p>
                         </div>
                    </div>
               </Card.Header>
          </Card>
     );
}

export default GoalCard;
