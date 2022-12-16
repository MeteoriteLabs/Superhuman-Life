import {Card} from 'react-bootstrap';

function TaskCard() {
  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light" style={{cursor: "pointer"}}>
        Task
      </Card.Header>
      <div className="scrollBar">
        <Card.Body>
          
        </Card.Body>
      </div>
    </Card>
  )
}

export default TaskCard;
