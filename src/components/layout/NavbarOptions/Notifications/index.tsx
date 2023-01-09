import {Row, Col, Button} from 'react-bootstrap';

function Notifications() {
  return (
    <div>
    <div className="d-flex justify-content-between align-items-center">
      <h2>Notifications</h2>
      <div className="px-5">
        <Button variant="outline-dark">
          Settings
        </Button>
      </div>
    </div>
    </div>
  )
}

export default Notifications
