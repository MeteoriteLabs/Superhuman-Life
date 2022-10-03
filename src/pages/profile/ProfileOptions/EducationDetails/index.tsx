import { useState, useContext, useRef } from 'react';
import { Card, Row, Col, Button, Dropdown } from "react-bootstrap";
import { FETCH_USERS_PROFILE_DATA } from "../../queries/queries";
import { useQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import CreateEducation from './CreateEducation';
import './education.css';

export default function EducationDetails() {
    const CreateEducationComponent = useRef<any>(null);
    const auth = useContext(AuthContext);
    const [educationData, setEducationData] = useState<any>([]);

    const fetch = useQuery(FETCH_USERS_PROFILE_DATA, {
        
        onCompleted: (r: any) => {
            const flattenData = flattenObj({ ...r });
            let usersData = flattenData.usersPermissionsUsers.filter((currValue: any) => currValue.id === auth.userid);
            setEducationData(usersData[0].educational_details);
        },
    });

    //Delete User's Education Data function
    const deleteHandler = (data: any) => {
        CreateEducationComponent.current.TriggerForm({ id: data.id, type: 'delete' })
    };

    // calling modal for update option
    function updateEducation(data: any) {
        CreateEducationComponent.current.TriggerForm({
            id: data.id,
            type: "edit",
            modal_status: true,
        });
    }

    function refetchQueryCallback() {
        fetch.refetch();
    }

    return (

        <Col md={{ span: 8, offset: 2 }}>
            <Col md={{ offset: 9, span: 3 }}>
                <Card.Title className="text-center">
                <Button
                    variant={true ? "outline-secondary" : "light"}
                    size="sm"
                    onClick={() => {
                        CreateEducationComponent.current.TriggerForm({
                            id: null,
                            type: "create",
                            modal_status: true,
                        });
                    }}
                >
                    <i className="fas fa-plus-circle"></i> Add Education
                </Button>
                <CreateEducation ref={CreateEducationComponent} callback={refetchQueryCallback}></CreateEducation>
                </Card.Title>
            </Col>

            <Row className="mt-4 pb-3">
                {
                    (educationData && educationData?.length) ? educationData.map((currValue: any) =>
                        <Col lg={12} key={currValue.id}>
                            <Card className="m-2" key={currValue.id}>
                                <Card.Body key={currValue.id}>
                                    <Row className='justify-content-end' key={currValue.id}>

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
                                                <Dropdown.Item key={1} onClick={() => deleteHandler(currValue)}>Delete</Dropdown.Item>
                                                <Dropdown.Item key={2} onClick={() => updateEducation(currValue)}>Edit</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </Row>
                                    <Card.Title>{currValue.Institute_Name ? currValue.Institute_Name : null}</Card.Title>

                                    <Row>
                                        <Col sm={12} lg={4}><b>Type of Degree : </b>{currValue.Type_of_degree && currValue.Type_of_degree}</Col>
                                        <Col sm={12} lg={4}><b>Specialization : </b>{currValue.Specialization && currValue.Specialization}</Col>
                                        <Col sm={12} lg={4}><b>Passing year : </b>{currValue.Year && currValue.Year}</Col>
                                    </Row>

                                </Card.Body>
                            </Card>
                        </Col>
                    ) : null
                }

            </Row>
        </Col>

    )
}
