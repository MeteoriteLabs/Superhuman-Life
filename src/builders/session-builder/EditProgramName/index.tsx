import { useState } from 'react';
import Form from '@rjsf/bootstrap-4';
import { Button, Modal, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { schema } from './tagSchema';
import { UPDATE_TAG } from 'pages/Summary/queries';
import { flattenObj } from 'components/utils/responseFlatten';
import Toaster from 'components/Toaster/index';
import { GET_TAG } from '../graphQL/queries';

interface Props {
    show: boolean;
    onHide: () => void;
    id?: string;
}

interface Tag {
    tag_name: string;
}

export default function EditProgramName(props: Props): JSX.Element {
    const [tagDetails, setTagDetails] = useState({} as Tag);
    const [isProgramUpdated, setIsProgramUpdated] = useState(false);

    useQuery(GET_TAG, {
        variables: { id: props.id },
        skip: !props.id,
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response.tag });
            console.log(flattenData);
            setTagDetails({ tag_name: flattenData.tag_name });
        }
    });

    const tagSchema: Record<string, unknown> = require('./tag.json');

    const [updateTag] = useMutation(UPDATE_TAG, {
        onCompleted: () => {
            setIsProgramUpdated((prevStatus) => !prevStatus);
            props.onHide();
        },
        refetchQueries: [GET_TAG]
    });

    function onSubmit(formData: Tag) {
        updateTag({ variables: { id: props.id, data: {tag_name: formData.tag_name }} });
    }

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Change Program Name</Modal.Header>
                <Modal.Body>
                    <>
                        <div>
                            <Form
                                uiSchema={schema}
                                schema={tagSchema}
                                showErrorList={false}
                                onSubmit={({ formData }) => onSubmit(formData)}
                                formData={tagDetails}
                            >
                                <Row className="mb-2" style={{ justifyContent: 'center' }}>
                                    <Button type="submit" size="sm" variant="success">
                                        Change Program name
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
                    msg="Program name has been updated successfully"
                />
            ) : null}
        </>
    );
}
