import React from 'react'
import { Card, Row, Col, ProgressBar } from 'react-bootstrap'

const PillarCard = (props: any) => {
    return (
        <Card className="goalCard m-2" style={{ borderRadius: '15px' }}>
            <div style={{ justifyContent: 'end', display: 'flex' }}>
                <div
                    className="p-1 pr-4 pl-4"
                    style={{
                        backgroundColor: '#FBF67F',
                        maxWidth: '100px',
                        borderTopRightRadius: '15px',
                        borderBottomLeftRadius: '15px'
                    }}
                >
                    <span style={{ color: '#606060', fontWeight: 'bold' }}>Habit</span>
                </div>
            </div>
            <div className="text-center mt-4 mb-4" style={{}}>
                <Row>
                    <Col style={{ justifyContent: 'end' }}>
                        <img src={props.imgProp} alt="shoe-img" height={70} width={70} />
                    </Col>
                    <Col>
                        <h4>{props.title}</h4>
                    </Col>
                </Row>
            </div>
            <div className="m-2">
                <ProgressBar now={60} />
            </div>
        </Card>
    )
}

export default PillarCard
