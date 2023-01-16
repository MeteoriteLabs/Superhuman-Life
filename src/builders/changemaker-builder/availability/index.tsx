import React from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import WorkHours from './workHours/workHours';

const Availability = () => {
    return (
        <>
            <div className="mb-3">
                <span style={{ fontSize: '30px'}}>
                    <Link to="/schedule"><i className="fa fa-arrow-circle-left" style={{ color: 'black'}}></i></Link>
                    <b> Availability</b>
                </span>
            </div>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <WorkHours />
                </Card.Body>
            </Card>
        </>
    );
};

export default Availability;