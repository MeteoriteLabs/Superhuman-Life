import { Card } from "react-bootstrap";
import "./GoalCard.css";

function GoalCard(props: any) {
     return (
          <Card border="secondary" className="goalCard">
               <Card.Header>
                    <div className="d-flex">
                         <div className="flex-fill p-2">
                              <img src="/assets/avatar-1.jpg" height="50" className="rounded-circle p-1" alt="avatar" />
                              <p className="font-weight-bold p-1">Arjun Nair{props.updatedBy}</p>
                         </div>
                         <div className="flex-fill p-1">
                              <p className="font-weight-bold">
                                   Updated On: <p>12.09.2021{props.updatedOn}</p>
                              </p>
                         </div>
                    </div>
               </Card.Header>
               <Card.Body>
                    <Card.Title>Build Muscle</Card.Title>
                    <Card.Text>
                         <div className="d-flex">
                              <div className="flex-fill">
                                   <p className="font-weight-bold p-1">Start Date: 12.10.2021{props.startDate}</p>
                              </div>
                              <div className="flex-fill">
                                   <p className="font-weight-bold p-1">End Date: 12.11.2021{props.endDate}</p>
                              </div>
                         </div>
                    </Card.Text>
               </Card.Body>
          </Card>
     );
}

export default GoalCard;
