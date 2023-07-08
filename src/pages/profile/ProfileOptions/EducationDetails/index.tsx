import React, { useState, useContext, useRef } from 'react';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { EDUCATIONAL_DETAILS } from '../../queries/queries';
import { useQuery } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import CreateEducation from './CreateEducation';
import NoDataFound from '../../../../components/NoDataFound';
import './education.css';
import Loader from '../../../../components/Loader/Loader';

const EducationDetails: React.FC = () => {
    // eslint-disable-next-line
    const CreateEducationComponent = useRef<any>(null);
    const auth = useContext(AuthContext);
    // eslint-disable-next-line
    const [educationData, setEducationData] = useState<any>([]);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const {
        // eslint-disable-next-line
        data: get_educational_details,
        // eslint-disable-next-line
        loading: loading_educational_details,
        refetch: refetch_educational_details
    } = useQuery(EDUCATIONAL_DETAILS, {
        variables: { id: auth.userid, start: page * 10 - 10, limit: 10 },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response.educationalDetails });
            setEducationData(flattenData);
            setTotalRecords(response.educationalDetails.meta.pagination.total);
        }
    });

    //Delete User's Education Data function
    const deleteHandler = (data) => {
        CreateEducationComponent.current.TriggerForm({ id: data.id, type: 'delete' });
    };

    // calling modal for update option
    function updateEducation(data) {
        CreateEducationComponent.current.TriggerForm({
            id: data.id,
            type: 'edit',
            modal_status: true
        });
    }

    function refetchQueryCallback() {
        refetch_educational_details();
    }

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };

    if (loading_educational_details) {
        return <Loader msg={'Loading educational details ...'} />;
    }

    return (
        <Col md={{ span: 8, offset: 2 }}>
            <Col md={{ offset: 9, span: 3 }}>
                <Card.Title className="text-center">
                    <Button
                        variant="dark"
                        size="sm"
                        onClick={() => {
                            CreateEducationComponent.current.TriggerForm({
                                id: null,
                                type: 'create',
                                modal_status: true
                            });
                        }}
                    >
                        <i className="fas fa-plus-circle"></i> Add Education
                    </Button>
                    <CreateEducation
                        ref={CreateEducationComponent}
                        callback={refetchQueryCallback}
                    ></CreateEducation>
                </Card.Title>
            </Col>

            <Row className="mt-4 pb-3">
                {educationData && educationData.length ? (
                    educationData.map((currValue) => (
                        <Col lg={12} key={currValue.id}>
                            <Card className="m-2" key={currValue.id}>
                                <Card.Body key={currValue.id}>
                                    <Row className="justify-content-end" key={currValue.id}>
                                        <Dropdown key={currValue.id}>
                                            <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                                                <img
                                                    src="/assets/kebabcase.svg"
                                                    alt="notification"
                                                    className="img-responsive "
                                                    style={{ height: '20px', width: '20px' }}
                                                />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu key={currValue.id}>
                                                <Dropdown.Item
                                                    key={1}
                                                    onClick={() => deleteHandler(currValue)}
                                                >
                                                    Delete
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    key={2}
                                                    onClick={() => updateEducation(currValue)}
                                                >
                                                    Edit
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Row>
                                    <Card.Title>
                                        {currValue.Institute_Name ? currValue.Institute_Name : null}
                                    </Card.Title>

                                    <Row>
                                        <Col sm={12} lg={4}>
                                            <b>Type of Degree : </b>
                                            {currValue.Type_of_degree && currValue.Type_of_degree}
                                        </Col>
                                        <Col sm={12} lg={4}>
                                            <b>Specialization : </b>
                                            {currValue.Specialization && currValue.Specialization}
                                        </Col>
                                        <Col sm={12} lg={4}>
                                            <b>Passing year : </b>
                                            {currValue.Year && currValue.Year}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <NoDataFound msg={'Oops! No educational details found'} />
                )}
            </Row>

            {/* Pagination */}
            {educationData && educationData.length ? (
                <Row className="justify-content-center">
                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page - 1)}
                        disabled={page === 1 ? true : false}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page + 1)}
                        disabled={
                            totalRecords > page * 10 - 10 + educationData.length ? false : true
                        }
                    >
                        Next
                    </Button>
                    <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                        page * 10 - 10 + educationData.length
                    }`}</span>
                </Row>
            ) : null}
        </Col>
    );
};

export default EducationDetails;
