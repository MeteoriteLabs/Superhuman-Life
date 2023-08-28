import { useState } from 'react';
import Form from '@rjsf/bootstrap-4';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { schema } from './extendProgramSchema';
import { UPDATE_PACKAGE } from './graphQL/queries';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster/index';
import { GET_TAG } from '../graphQL/queries';
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

    useQuery(GET_TAG, {
        variables: { id: props.id },
        skip: !props.id,
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response.tag });
            setStartDate(moment(flattenData.fitnesspackage.Start_date).add(1,"year").format())
            setEndDate(moment(flattenData.fitnesspackage.End_date).add(1,"year").format())
            setFitnessPackageId(flattenData.fitnesspackage.id);
        }
    });

    const extendSchema: Record<string, unknown> = require('./extendProgram.json');

    const [updatePackage] = useMutation(UPDATE_PACKAGE, {
        onCompleted: () => {
            setIsProgramUpdated((prevStatus) => !prevStatus);
            props.onHide();
        },
        refetchQueries: [GET_TAG]
    });

    function onSubmit() {
        updatePackage({ variables: { id: fitnessPackageId, data: {Start_date: startDate, End_date: endDate }} });
    }

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Extend Program Duration</Modal.Header>
                <Modal.Body>
                    <>
                        <div>
                            <Form
                                uiSchema={schema}
                                schema={extendSchema}
                                showErrorList={false}
                                onSubmit={() => onSubmit()}
                                
                            >
                                <Row>
                                    <Col><p>Start Date: {startDate ? moment(startDate).format("DD-MM-YY") : null}</p></Col>
                                    <Col><p>End Date: {endDate ? moment(endDate).format("DD-MM-YY") : null}</p></Col>
                                </Row>
                                <Row className="mb-2" style={{ justifyContent: 'center' }}>
                                    <Button type="submit" size="sm" variant="success">
                                        Extend Program
                                    </Button>
                                </Row>
                            </Form>
                        </div>
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
