import {Card} from 'react-bootstrap';

function TaskCard() {
  return (
    <Card>
      <Card.Header as="h5" className="bg-dark text-light">
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
