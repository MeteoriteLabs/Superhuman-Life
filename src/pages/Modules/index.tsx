import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Modules: React.FC<{ show: boolean; onHide: () => void }> = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you{`&apos;`}re reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary">Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Modules;
