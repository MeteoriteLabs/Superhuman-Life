import { useState, ChangeEvent } from 'react';
import { Button, Modal, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PACKAGE } from '../../../ExtendProgram/graphQL/queries';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster/index';
import { GET_TAG } from '../../../graphQL/queries';
import moment from 'moment';

interface Props {
    show: boolean;
    onHide: () => void;
    id?: string;
}

export default function ExtendProgram(props: Props): JSX.Element {
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [fitnessPackageId, setFitnessPackageId] = useState<string>();
    const [isProgramUpdated, setIsProgramUpdated] = useState(false);
    const [programStartDate, setProgramStartDate] = useState<string>(
        moment().add(1, 'days').format('YYYY-MM-DD')
    );
    const [programEndDate, setProgramEndDate] = useState<string>(
        moment(startDate).add(1, 'days').format('YYYY-MM-DD')
    );

    useQuery(GET_TAG, {
        variables: { id: props.id },
        skip: !props.id,
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response.tag });
            setStartDate(flattenData.fitnesspackage.Start_date);
            setEndDate(flattenData.fitnesspackage.End_date);
            setFitnessPackageId(flattenData.fitnesspackage.id);
        }
    });

    const [updatePackage] = useMutation(UPDATE_PACKAGE, {
        onCompleted: () => {
            setIsProgramUpdated((prevStatus) => !prevStatus);
            props.onHide();
        },
        refetchQueries: [GET_TAG]
    });

    function onSubmit() {
        updatePackage({
            variables: {
                id: fitnessPackageId,
                data: {
                    Start_date: moment(programStartDate).format(),
                    End_date: moment(programEndDate).format()
                }
            }
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
                        <label>Start Date</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                type="date"
                                min={programStartDate}
                                value={programStartDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setProgramStartDate(e.target.value);
                                    setProgramEndDate(
                                        moment(e.target.value).add(1, 'days').format('YYYY-MM-DD')
                                    );
                                }}
                            />
                        </InputGroup>

                        <br />
                        <label>End Date</label>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                type="date"
                                min={moment(programStartDate).add(1, 'days').format('YYYY-MM-DD')}
                                value={programEndDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setProgramEndDate(e.target.value);
                                }}
                            />
                        </InputGroup>

                        <Row>
                            <Col>
                                <p>
                                    Current Start Date:{' '}
                                    {startDate ? moment(startDate).format('DD-MM-YY') : null}
                                </p>
                            </Col>
                            <Col>
                                <p>
                                    Current End Date:{' '}
                                    {endDate ? moment(endDate).format('DD-MM-YY') : null}
                                </p>
                            </Col>
                        </Row>
                        <Row className="mb-2" style={{ justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                size="sm"
                                variant="success"
                                onClick={() => onSubmit()}
                            >
                                Reschedule Program
                            </Button>
                        </Row>
                    </>
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
