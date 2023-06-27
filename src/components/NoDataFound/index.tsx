import React from 'react';
import { Row, Col } from 'react-bootstrap';

const NoDataFound: React.FC<{ msg: string }> = (props) => {
    return (
        <Row className="row">
            <Col lg={12}>
                <img
                    loading="lazy"
                    src="assets/empty_data.svg"
                    alt="no data"
                    width="90%"
                    height="70%"
                    className="ml-4"
                />
                <h4 className="text-center pt-3">{props.msg}</h4>
            </Col>
        </Row>
    );
};

export default NoDataFound;
