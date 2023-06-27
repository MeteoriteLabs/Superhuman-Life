import React, { useState, useEffect } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Loader from '../../components/Loader/Loader'

const StatusModal: React.FC<{
    buttonRight: string
    buttonLeft: string
    modalTitle: string
    show: boolean
    modalBody: string
    onClick: () => void
    onHide: () => void
    EventConnectedDetails: any[]
    ExistingEventId: string
}> = (props) => {
    const [eventConnections, setEventConnections] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    function handleClick() {
        props.onClick()
        props.onHide()
    }

    useEffect(() => {
        if (props.EventConnectedDetails.length !== 0) {
            const values = [...eventConnections]
            for (let i = 0; i <= props.EventConnectedDetails.length - 1; i++) {
                if (
                    props.EventConnectedDetails[i].warmup ||
                    props.EventConnectedDetails[i].mainmovement ||
                    props.EventConnectedDetails[i].cooldown !== null
                ) {
                    values.push(props.EventConnectedDetails[i])
                }
            }
            setEventConnections(values)
        }
        setTimeout(() => {
            setLoading(true)
        }, 500)
    }, [props.EventConnectedDetails])

    const linkedWorkouts: any[] = []

    if (eventConnections.length !== 0) {
        const values = [...eventConnections]
        for (let j = 0; j <= values.length - 1; j++) {
            if (values[j].warmup !== null && values[j].warmup[0]?.type === 'exercise') {
                for (let k = 0; k <= values[j].warmup.length - 1; k++) {
                    if (values[j].warmup[k].id === props.ExistingEventId) {
                        linkedWorkouts.push(values[j])
                        break
                    }
                }
            }
            if (values[j].mainmovement !== null && values[j].mainmovement[0]?.type === 'exercise') {
                for (let x = 0; x <= values[j].mainmovement.length - 1; x++) {
                    if (values[j].mainmovement[x].id === props.ExistingEventId) {
                        linkedWorkouts.push(values[j])
                        break
                    }
                }
            }
            if (values[j].cooldown !== null && values[j].cooldown[0]?.type === 'exercise') {
                for (let y = 0; y <= values[j].cooldown.length - 1; y++) {
                    if (values[j].cooldown[y].id === props.ExistingEventId) {
                        linkedWorkouts.push(values[j])
                        break
                    }
                }
            }
        }
    }

    function handleBodyRender() {
        if (!loading) return <Loader />
        else
            return (
                <>
                    <div style={{ display: `${linkedWorkouts.length ? 'none' : 'block'}` }}>
                        <h5>{props.modalBody}</h5>
                    </div>
                    <div style={{ display: `${linkedWorkouts.length ? 'block' : 'none'}` }}>
                        <p>
                            The Exercise you are trying to delete is being used in the following
                            workouts:{' '}
                        </p>
                        {linkedWorkouts.length &&
                            linkedWorkouts.map((val, index) => {
                                return (
                                    <h5 key={val.id}>
                                        {`${index + 1})`}
                                        {` ${val.workouttitle}`}
                                    </h5>
                                )
                            })}
                        <span>
                            <i className="fas fa-info-circle"></i> Please Make sure you edit the
                            workout, and then try deleting.
                        </span>
                    </div>
                </>
            )
    }

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{props.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">{handleBodyRender()}</Modal.Body>
                <Modal.Footer>
                    <div>
                        <Row>
                            <Col xs={4} md={4} className="ml-4">
                                <Button variant="danger" onClick={props.onHide}>
                                    {props.buttonLeft}
                                </Button>
                            </Col>
                            <Col xs={4} md={5} className="ml-4">
                                <Button
                                    variant="success"
                                    onClick={handleClick}
                                    disabled={linkedWorkouts.length !== 0 ? true : false}
                                >
                                    {props.buttonRight}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StatusModal
