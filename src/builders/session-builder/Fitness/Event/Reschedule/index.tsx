import { useState, ChangeEvent } from 'react';
import { Button, Modal, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PACKAGE } from '../../../ExtendProgram/graphQL/queries';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster/index';
import { GET_TAG, UPDATE_SESSION } from '../../../graphQL/queries';
import moment from 'moment';

interface Props {
    show: boolean;
    onHide: () => void;
    id?: string;
}

export default function ExtendProgram(props: Props): JSX.Element {
    const [startDate, setStartDate] = useState<string>();
    const [fitnessPackageId, setFitnessPackageId] = useState<string>();
    const [isProgramUpdated, setIsProgramUpdated] = useState(false);
    const [programStartDate, setProgramStartDate] = useState<string>(
        moment().add(1, 'days').format('YYYY-MM-DD')
    );
    const [sessions, setSessions] = useState<{ id: string; session_date: string }[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    let diff: any;

    useQuery(GET_TAG, {
        variables: { id: props.id },
        skip: !props.id,
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response.tag });
            setStartDate(flattenData.fitnesspackage.Start_date);
            setFitnessPackageId(flattenData.fitnesspackage.id);

            const sessionsArr: { id: string; session_date: string }[] = [];
            if (flattenData.sessions && flattenData.sessions.length) {
                for (let i = 0; i < flattenData.sessions.length; i++) {
                    sessionsArr.push({
                        id: flattenData.sessions[i].id,
                        session_date: flattenData.sessions[i].session_date
                    });
                }
            }
            setSessions(sessionsArr);
        }
    });

    const [updatePackage] = useMutation(UPDATE_PACKAGE);

    const [updateSession] = useMutation(UPDATE_SESSION);

    function onSubmit() {
        diff = moment(programStartDate).diff(moment(startDate), 'days');

        updatePackage({
            variables: {
                id: fitnessPackageId,
                data: {
                    Start_date: moment(programStartDate).format(),
                    End_date: moment(programStartDate).format()
                }
            },

            onCompleted: () => {
                if (sessions.length > 0) {
                    for (let i = 0; i < sessions.length; i++) {
                        updateSession({
                            variables: {
                                id: sessions[i].id,
                                data: {
                                    session_date: moment(sessions[i].session_date)
                                        .add(diff, 'days')
                                        .format('YYYY-MM-DD')
                                }
                            }
                        });
                    }
                }

                setIsProgramUpdated((prevStatus) => !prevStatus);
                props.onHide();
            },
            refetchQueries: [GET_TAG]
        });
    }

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Reschedule</Modal.Header>
                <Modal.Body>
                    <>
                        <label>Event Date</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                type="date"
                                min={programStartDate}
                                value={programStartDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setProgramStartDate(e.target.value);
                                }}
                            />
                        </InputGroup>

                        <Row>
                            <Col>
                                <p>
                                    Current Event Date:{' '}
                                    {startDate ? moment(startDate).format('DD-MM-YY') : null}
                                </p>
                            </Col>
                        </Row>
                        <Row className="mb-2" style={{ justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                size="sm"
                                variant="success"
                                onClick={() => setShowConfirmModal(true)}
                            >
                                Reschedule Program
                            </Button>
                        </Row>
                    </>
                </Modal.Body>
            </Modal>

            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Confirm</Modal.Header>
                <Modal.Body>
                    <Row>Are you sure you want to reschedule?</Row>
                <Row className="mb-2" style={{ justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                size="sm"
                                variant="success"
                                onClick={() => onSubmit()}
                            >
                                Yes
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                variant="danger"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                No
                            </Button>
                        </Row>
                    
                </Modal.Body>
            </Modal>

            {/* success toaster notification */}
            {isProgramUpdated ? (
                <Toaster
                    handleCallback={() => setIsProgramUpdated(!isProgramUpdated)}
                    type="success"
                    msg="Program duration has been extended successfully"
                />
            ) : null}
        </>
    );
}
