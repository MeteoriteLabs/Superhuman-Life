import { Modal } from 'react-bootstrap';

interface Props{
  show: boolean;
  onHide: () => void;
}

export default function WarningModal(props: Props): JSX.Element {
    
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className='text-warning'> Warning</Modal.Header>
            <Modal.Body className='text-warning'>
               You have services for this industry. Delete all the services to unselect it.
            </Modal.Body>
        </Modal>
    );
}
