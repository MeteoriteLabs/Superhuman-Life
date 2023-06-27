import { Card, Row, Col } from 'react-bootstrap';

const HealthScreen = () => {
    const HealthCard = (props: any) => {
        return (
            <Col lg={4}>
                <Card bg={'light'} key={'light'} className="mb-2">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title>{props.title}</Card.Title>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Row className="text-center">
                            <Col>
                                <span style={{ color: 'gray' }}>Updated on: 15/06/2021</span>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <span style={{ color: 'gray', fontSize: '14px' }}>
                                            Updated By:{' '}
                                        </span>
                                        <span
                                            style={{
                                                color: 'gray',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Updated By:{' '}
                                        </span>
                                    </Col>
                                    <Col>
                                        <img
                                            src="https://picsum.photos/200/100"
                                            alt="profile-pic"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </Col>
        );
    };

    return (
        <div>
            <Row>
                <HealthCard title={'Vitals'} />
                <HealthCard title={'Molecular Biomarkers'} />
                <HealthCard title={'Image Biomarkers'} />
                <HealthCard title={'Health Conditions & Symptoms'} />
            </Row>
        </div>
    );
};

export default HealthScreen;
