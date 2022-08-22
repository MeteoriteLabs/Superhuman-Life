import React from 'react';
import { Accordion, Card, Button, Row, Col } from "react-bootstrap";
import AddressDetails from '../AddressDetails';
import BasicProfile from '../BasicProfileForm/index';
import EducationDetails from '../EducationDetails';
import SocialAccount from '../SocialAccount';
import Timings from '../Timings';
import AccountVerification from '../AccountVerification';

export default function ProfileAccordion() {
    return (
        <Accordion className="my-5 ">

            {/* Basic profile */}
            <Card className="m-3">
                <Card.Header  >
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" className="col-lg-12">
                        <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Basic Profile</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row> 
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <BasicProfile />
                </Accordion.Collapse>
            </Card>

            {/* Education */}
            <Card className="m-3">
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" className="col-lg-12">
                        <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Education</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row>   
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <EducationDetails/>
                </Accordion.Collapse>
            </Card>

            {/* Addresses */}
            <Card className="m-3">
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2" className="col-lg-12">
                        <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Addresses</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row>   
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                    <AddressDetails/>
                </Accordion.Collapse>
            </Card>

            {/* Timings */}
            <Card className="m-3">
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="3" className="col-lg-12">
                        <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Timings</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row>  
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                    <Timings/>
                </Accordion.Collapse>
            </Card>

            {/* Social Account */}
            <Card className="m-3">
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="4" className="col-lg-12">
                    <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Social Account</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row> 
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="4">
                    <SocialAccount/>
                </Accordion.Collapse>
            </Card>

            {/* Verification */}
            <Card className="m-3">
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="5" className="col-lg-12">
                        <Row className="justify-content-between">
                            <div className='float-left'><b className='text-dark'><h4>Verification</h4></b></div>
                            <div className='float-right'><img src="assets/chevron.svg" alt="downarrow" height="25"/></div>   
                        </Row>  
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="5">
                    <AccountVerification/>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}
