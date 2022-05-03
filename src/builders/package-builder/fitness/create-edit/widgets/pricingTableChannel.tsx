import React, {useState, useContext} from 'react';
import {Row, Col, Form, Table, FormControl, InputGroup} from 'react-bootstrap';
import {gql, useQuery} from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';

const PricingTable = (props) => {

    const auth = useContext(AuthContext);
    const [show, setShow] = useState(props.value === 'free' ? true : false);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? JSON.parse(props.value) : [ {mrp: null, suggestedPrice: null, voucher: 1, duration: 1, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 30, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 90, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 180, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 360, sapienPricing: null}]);

    const SAPIEN_PRICING = gql`
        query fetchSapienPricing($id: ID!) {
            suggestedPricings(filters: {
                fitness_package_type: {
                  type: {
                    eq: "Live Stream Channel"
                  }
                },
                users_permissions_users:{
                  id: {
                    eq: $id
                  }
                }
              }){
                data{
                  id
                  attributes{
                    mrp
                  }
                }
              }
        }
    `;

    function FetchData(){
        useQuery(SAPIEN_PRICING, {variables: { id: auth.userid },onCompleted: (data) => {loadData(data)}})
    }

    function loadData(data){
        const flattenData = flattenObj({...data});
        const newValue = [...pricing];
        newValue.forEach((item, index) => {
            if(item.voucher !== 1 && item.price !== null){
                item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration - (flattenData.suggestedPricings[0]?.mrp * item.duration * item.voucher/100);
            }else {
                item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration;
            }
            item.sapienPricing = flattenData.suggestedPricings[0]?.mrp * item.duration;
        });
        setPricing(newValue);
    }

    function handlePricingUpdate(value: any, id: any){
        let newPricing = [...pricing];
        newPricing[id].mrp = value;
        setPricing(newPricing);
    }

    if(show){
        props.onChange('free');
    }else if(pricing[0].mrp !== null && pricing[1].mrp !== null && pricing[2].mrp !== null && pricing[3].mrp !== null && pricing[4].mrp !== null){
        props.onChange(JSON.stringify(pricing));    
    }

    function handleUpdatePricing(id: any, value: any){
        if(parseInt(value) !== 1){
            let newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            newValue[id].suggestedPrice = newValue[id].sapienPricing - (newValue[id].sapienPricing * value/100);
            setPricing(newValue);
        }else {
            let newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            newValue[id].suggestedPrice = newValue[id].sapienPricing;
            setPricing(newValue);
        }
    }

    FetchData();

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
                    {pricing.map((item, index) => {
                        return (
                            <td>
                                <Form.Control as="select" defaultValue={item.voucher} onChange={(e) => handleUpdatePricing(index, e.target.value)}>
                                    <option value={1}>Choose voucher</option>
                                    <option value={10}>Get Fit - 10%</option>
                                    <option value={20}>Get Fit - 20%</option>
                                </Form.Control>
                            </td>
                        )
                    })}
                    </tr>
                    <tr className='text-center'>
                    <td><b>Total days</b></td>
                    {pricing.map((item, index) => {
                        return (
                            <td>{item.duration} days</td>
                        )
                    })}
                    </tr>
                    <tr className='text-center'>
                    <td><b>Suggested</b></td>
                    {pricing.map((item, index) => {
                        return (
                            <td>₹ {item.suggestedPrice}</td>
                        )
                    })}
                    </tr>
                    <tr>
                    <td className='text-center'><b>Set MRP</b></td>
                    {pricing.map((item, index) => {
                        return (
                            <td>
                                <InputGroup className="mb-3">
                                    <FormControl
                                    className={`${pricing[index]?.mrp < pricing[index]?.suggestedPrice && pricing[index]?.mrp !== null ? "is-invalid" : pricing[index]?.mrp >= pricing[index]?.suggestedPrice ? "is-valid" : ""}`}
                                    aria-label="Default"
                                    type='number'
                                    aria-describedby="inputGroup-sizing-default"
                                    value={pricing[index]?.mrp}
                                    onChange={(e) => {handlePricingUpdate(e.target.value, index)}}
                                    />
                                    {pricing[index]?.mrp < pricing[index]?.suggestedPrice && pricing[index]?.mrp !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹ {pricing[index]?.suggestedPrice}</span>}    
                                </InputGroup>
                            </td>
                        )
                    })}
                    </tr>
                </tbody>
                </Table>
            </div>}
        </>
    )
};

export default PricingTable;