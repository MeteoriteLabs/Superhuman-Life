import { useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'

function StatusModal(props: any) {
    const [eventConnections] = useState<any>(props.EventConnectedDetails)

    function handleClick() {
        props.onClick()
        props.onHide()
    }

    function handleBodyRender() {
        return (
            <>
                <div
                    style={{
                        display: `${
                            eventConnections?.fitnessprograms?.length !== 0 ||
                            eventConnections?.tags?.length !== 0
                                ? 'none'
                                : 'block'
                        }`
                    }}
                >
                    <h5>{props.modalBody}</h5>
                </div>
                <div
                    style={{
                        display: `${
                            eventConnections?.fitnessprograms?.length !== 0 ||
                            eventConnections?.tags?.length !== 0
                                ? 'block'
                                : 'none'
                        }`
                    }}
                >
                    <p>
                        The workout you are trying to delete is being used in the following
                        programs:{' '}
                    </p>
                    {props.EventConnectedDetails?.fitnessprograms?.length > 0 && (
                        <div>
                            <span>
                                <b>Program Templates: </b>
                            </span>
                            {props.EventConnectedDetails?.fitnessprograms?.map(
                                (val: any, index: number) => {
                                    return (
                                        <h5 key={val.id}>
                                            {`${index + 1})`}
                                            {` ${val.title}`}
                                        </h5>
                                    )
                                }
                            )}
                        </div>
                    )}
                    {props.EventConnectedDetails?.tags?.length > 0 && (
                        <div>
                            <span>
                                <b>Program Manager: </b>
                            </span>
                            {props.EventConnectedDetails?.tags?.map((val: any, index: number) => {
                                return (
                                    <h5 key={val.id}>
                                        {`${index + 1})`}
                                        {` ${val.tag_name}`}
                                    </h5>
                                )
                            })}
                        </div>
                    )}
                    <span>
                        <i className="fas fa-info-circle"></i> Please Make sure you edit the
                        program, and then try deleting.
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
                                    disabled={
                                        eventConnections?.fitnessprograms?.length > 0 ||
                                        eventConnections?.tags?.length > 0
                                            ? true
                                            : false
                                    }
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
