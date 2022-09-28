import { useState, useEffect } from 'react'
import { Button, Col, Modal, Row } from "react-bootstrap";


function StatusModal(props: any) {
    const [eventConnections, setEventConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    function handleClick() {
        props.onClick();
        props.onHide();
    }

    useEffect(() => {
        if(props.EventConnectedDetails.length !== 0){
            const values = [...eventConnections];
            for(var i=0; i<=props.EventConnectedDetails.length-1; i++){
                if(props.EventConnectedDetails[i].events !== null){
                    values.push(props.EventConnectedDetails[i]);
                }
            }
            setEventConnections(values);
        }
        setTimeout(() => {
            setLoading(true);
        }, 500)
    }, [props.EventConnectedDetails]);// eslint-disable-line react-hooks/exhaustive-deps

    const linkedPrograms: any[] = [];

    if(eventConnections.length !== 0){
        const values = [...eventConnections];
        for(var j=0; j<=values.length-1; j++){
            for(var k=0; k<=values[j].events.length-1; k++){
                if(values[j].events[k].id === props.ExistingEventId){
                    linkedPrograms.push(values[j]);
                    break;
                }
            }
        }
    }

    function handleBodyRender() {
        
        if (!loading) return <span style={{ color: 'red' }}>Loading...</span>;
        else return (
            <>
                <div style={{ display: `${linkedPrograms.length !== 0 ? 'none' : 'block'}`}}>
                    <h5>{props.modalBody}</h5>
                </div>
            <div style={{ display: `${linkedPrograms.length !== 0 ? 'block' : 'none'}`}}>
                <p>The workout you are trying to delete is being used in the following programs: </p>
                {linkedPrograms.length !== 0 && linkedPrograms.map((val, index) => {
                    return (
                        <h5 key={val.id}>{`${index+1})`}{` ${val.title}`}</h5>
                    )
                })}
                <span><i className="fas fa-info-circle"></i>{' '}Please Make sure you edit the program, and then try deleting.</span>
            </div>
            </>
        )
    }

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.modalTitle}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    {handleBodyRender()}
                </Modal.Body>
                <Modal.Footer>
                <div>
                    <Row>
                    <Col xs={4} md={4} className="ml-4">
                        <Button variant="danger" onClick={props.onHide}>{props.buttonLeft}</Button>
                    </Col>
                    <Col xs={4} md={5} className="ml-4">
                        <Button variant="success" onClick={handleClick} disabled={linkedPrograms.length !== 0 ? true : false}>{props.buttonRight}</Button>
                    </Col>
                    </Row>
                </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default StatusModal
