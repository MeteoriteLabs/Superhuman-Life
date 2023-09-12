import { Template } from '../@types/websiteTemplates';
import { CheckCircle } from 'react-bootstrap-icons';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';

import style from './info.module.css';
import { FETCH_TEMPLATE_BY_ID } from '../queries/templates';
import { useLazyQuery } from '@apollo/client';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { useContext, useState } from 'react';

function InfoModal({
    data,
    setInfoData
}: {
    data: Template;
    setInfoData: (data: Template | null) => void;
}): JSX.Element {
    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    const [selectedTemplateSections, setSelectedTemplateSections] = useState() as any;
    const handleClose = () => {
        setInfoData(null);
    };

    const [getUserSelectedTemplate] = useLazyQuery(FETCH_TEMPLATE_BY_ID);

    const setTemplateAsSelected = () => {
        getUserSelectedTemplate({
            variables: {
                Id: data.id
            },
            onCompleted: (data) => {
                setSelectedTemplateSections(data);
            }
        });

        // create a iterator that goes through each section and creates a new section using a mutation
        // selectedTemplateSections?.templateById?.sections?.map((section: any) => {

        // });

        // set the template as selected in changemakerWebsite table using a mutation and give it subdomain using user id
        setInfoData(null);
    };

    return (
        <Modal show={!!data} onHide={handleClose} className={style.modal}>
            <Modal.Body>
                <Modal.Header closeButton className="mb-4">
                    <h3 className={style.templateName}>{data.attributes.templateName}</h3>
                </Modal.Header>
                <div className="position-relative">
                    <div className={style.thumbnailCont}>
                        <img
                            src={data.attributes.thumbnail}
                            className={style.thumbnail}
                            width={1200}
                        />
                    </div>
                    <Row className="mt-3">
                        <Col className="mt-3">
                            <h3 className={style.subheadings}>Good For</h3>

                            <ListGroup className="mt-3">
                                {data.attributes.goodFor.length > 0
                                    ? data.attributes.goodFor.map((item, index) => (
                                          <ListGroup.Item key={index}>
                                              {' '}
                                              <CheckCircle className="text-success m-0 mr-2" />
                                              {item}
                                          </ListGroup.Item>
                                      ))
                                    : null}
                            </ListGroup>
                        </Col>
                        <Col className="mt-3">
                            <h3 className={style.subheadings}>Features</h3>

                            <ListGroup className="mt-3">
                                {data.attributes.features.length > 0
                                    ? data.attributes.features.map((item, index) => (
                                          <ListGroup.Item key={index}>
                                              {' '}
                                              <CheckCircle className="text-success m-0 mr-2" />
                                              {item}
                                          </ListGroup.Item>
                                      ))
                                    : null}
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
                <div className="d-flex justify-content-end mt-5">
                    <Button
                        variant="primary"
                        className="py-2 px-4 "
                        onClick={setTemplateAsSelected}
                    >
                        Select Template
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default InfoModal;
