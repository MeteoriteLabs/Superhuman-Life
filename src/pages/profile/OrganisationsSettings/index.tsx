import React, { useContext, useState } from 'react';
import { Row, Button, Container, Card, Dropdown, Col } from 'react-bootstrap';
import AuthContext from '../../../context/auth-context';
import { GET_USER_ORGANIZATIONS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { useQuery } from '@apollo/client';
import './organisation.css';

function OrganisationsSettings() {
    const auth = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);

    useQuery(GET_USER_ORGANIZATIONS, {
        variables: { id: auth.userid },
        onCompleted: (data: any) => {
            const flattendData = flattenObj({ ...data });
            setOrganizations(flattendData.usersPermissionsUsers[0].organizations);
        }
    });

    return (
        <Container>
            {/* heading and create new organisation button */}
            <Row className="justify-content-between">
                <h3 className="float-left">Organisations</h3>
                <Button variant="outline-dark" className="float-right">
                    New Organisation
                </Button>
            </Row>

            {organizations.length &&
                organizations.map((data: any, index: number) => (
                    <Row className="mt-4" key={index}>
                        <Col lg={12}>
                            <Card>
                                <Card.Body>
                                    {/* edit button */}
                                    <Row className="justify-content-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                                                <img
                                                    src="/assets/kebabcase.svg"
                                                    alt="edit"
                                                    className="img-responsive "
                                                    style={{ height: '20px', width: '20px' }}
                                                />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item key={1}>Delete</Dropdown.Item>
                                                <Dropdown.Item key={2}>Edit</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Row>

                                    {/* organisation details */}
                                    <Row className="p-2">
                                        <Col lg={6} xs={12}>
                                            <Row>
                                                <b>
                                                    {data.Organization_Name
                                                        ? data.Organization_Name
                                                        : null}
                                                </b>
                                            </Row>
                                            <Row>Ring Road near Palasia, Indore (M.P.)</Row>
                                        </Col>
                                        <Col lg={6} xs={12}>
                                            <Row>
                                                <b>Admin Name:</b> @michael @vikas
                                            </Row>
                                            <Row>
                                                <b>Team :</b> @michael @vikas{' '}
                                            </Row>
                                            <Row>
                                                <b>Categories:</b> Fitness, Nutrition, Mental Health
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ))}
        </Container>
    );
}

export default OrganisationsSettings;
