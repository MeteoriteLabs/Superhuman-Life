import React, {useState} from 'react';
import {Row, Col, Form, Table, FormControl, InputGroup} from 'react-bootstrap';

const PricingTable = (props) => {

    console.log(props);
    const [show, setShow] = useState(props.value === 'free' ? true : false);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? JSON.parse(props.value) : [ null, null, null, null, null]);


    function handlePricingUpdate(value: any, id: any){
        let newPricing = [...pricing];
        newPricing[id] = value;
        setPricing(newPricing);
    }

    if(show){
        props.onChange('free');
    }

    if(pricing[0] !== null && pricing[1] !== null && pricing[2] !== null && pricing[3] !== null && pricing[4] !== null){
        props.onChange(JSON.stringify(pricing));    
    }


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
                                    defaultChecked={show}
                                    onClick={() => setShow(!show)}
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
            {!show && <div>
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
                        <option value={0}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option value={0}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option value={0}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option value={0}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
                    </Form.Control>
                    </td>
                    <td>
                    <Form.Control as="select">
                        <option value={0}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
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
                        className={`${pricing[0] < 2500 && pricing[0] !== null ? "is-invalid" : pricing[0] >= 2500 ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[0]}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 0)}}
                        />
                        {pricing[0] < 2500 && pricing[0] !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹2500</span>}    
                    </InputGroup>
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        className={`${pricing[1] < 2500 && pricing[1] !== null ? "is-invalid" : pricing[1] >= 2500 ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[1]}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 1)}}
                        />
                        {pricing[1] < 2500 && pricing[1] !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹2500</span>}   
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        className={`${pricing[2] < 2500 && pricing[2] !== null ? "is-invalid" : pricing[2] >= 2500 ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[2]}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 2)}}
                        />
                        {pricing[2] < 2500 && pricing[2] !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹2500</span>}   
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        className={`${pricing[3] < 2500 && pricing[3] !== null ? "is-invalid" : pricing[3] >= 2500 ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[3]}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 3)}}
                        />
                        {pricing[3] < 2500 && pricing[3] !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹2500</span>}   
                    </InputGroup>    
                    </td>
                    <td>
                    <InputGroup className="mb-3">
                        <FormControl
                        className={`${pricing[4] < 2500 && pricing[4] !== null ? "is-invalid" : pricing[4] >= 2500 ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[4]}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 4)}}
                        />
                        {pricing[4] < 2500 && pricing[4] !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹2500</span>}   
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