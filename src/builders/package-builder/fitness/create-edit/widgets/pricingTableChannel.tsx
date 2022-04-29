import React, {useState} from 'react';
import {Row, Col, Form, Table, FormControl, InputGroup} from 'react-bootstrap';

const PricingTable = (props) => {

    const [pricing, setPricing] = useState(false);

    props.onChange("");

    return(
        <>
            <div>
                <Row>
                    <Col>
                        <h5>Type of payment</h5>
                    </Col>  
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col lg={2}><b>Setup Pricing</b></Col>
                            <Col lg={1}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    defaultChecked={pricing}
                                    onClick={() => setPricing(!pricing)}
                                />
                            </Form>
                            </Col>
                            <Col lg={3}><b>Free (support Me Button)</b></Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <br />
            <br />
            {!pricing && <div>
                <h4>Subscription Plan</h4>
                <Table style={{ tableLayout: 'fixed'}}>
                <thead>
                    <tr className='text-center'>
                    <th></th>
                    <th>One day</th>
                    <th>Monthly</th>
                    <th>Quaterly</th>
                    <th>Half Yearly</th>
                    <th>Yearly</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='text-center'>
                    <td><b>Vouchers</b></td>
                    <td>
                    <Form.Control as="select">
                        <option>Default select</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option>Default select</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option>Default select</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option>Default select</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option>Default select</option>
                    </Form.Control>
                    </td>
                    </tr>
                    <tr className='text-center'>
                    <td><b>Total days</b></td>
                    <td>01 Days</td>
                    <td>30 Days</td>
                    <td>90 Days</td>
                    <td>180 Days</td>
                    <td>360 Days</td>
                    </tr>
                    <tr className='text-center'>
                    <td><b>Suggested</b></td>
                    <td>Rs 2500</td>
                    <td>Rs 2500</td>
                    <td>Rs 2500</td>
                    <td>Rs 2500</td>
                    <td>Rs 2500</td>
                    </tr>
                    <tr>
                    <td className='text-center'><b>Set MRP</b></td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>    
                    </td>
                    </tr>
                </tbody>
                </Table>
            </div>}
        </>
    )
};

export default PricingTable;