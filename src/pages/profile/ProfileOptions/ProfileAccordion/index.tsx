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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Basic Profile</b></Col>   
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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Education</b></Col>   
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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Addresses</b></Col>   
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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Timings</b></Col>   
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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Social Account</b></Col>   
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
                        <Row lg={12}>
                            <Col lg={1}><img src="assets/chevron.svg" alt="downarrow"/></Col>
                            <Col lg={2}><b className='text-dark'>Verification</b></Col>   
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
