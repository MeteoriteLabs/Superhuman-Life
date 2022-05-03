import React, {useState, useContext} from 'react';
import {Row, Col, Form, Table, FormControl, InputGroup} from 'react-bootstrap';
import {gql, useQuery} from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';

const PricingTable = (props) => {

    const auth = useContext(AuthContext);
    const [show, setShow] = useState(props.value === 'free' ? true : false);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? JSON.parse(props.value) : [ {mrp: null, suggestedPrice: null, voucher: 1, duration: 300, sapienPricing: null}]);

    const SAPIEN_PRICING = gql`
        query fetchSapienPricing($id: ID!) {
            suggestedPricings(filters: {
                fitness_package_type: {
                  type: {
                    eq: "Cohort"
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
            if(item.voucher !== 1 && item.mrp !== null){
                item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration - (flattenData.suggestedPricings[0]?.mrp * item.duration * item.voucher/100);
            }else {
                item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration;
            }
            item.sapienPricing = flattenData.suggestedPricings[0]?.mrp * item.duration;
        });
        setPricing(newValue);
    }

    console.log(pricing);

    if(show){
        props.onChange('free');
    }else if(pricing[0].mrp !== null){
        props.onChange(JSON.stringify(pricing));    
    }

    function handlePricingUpdate(value: any, id: any){
        let newPricing = [...pricing];
        newPricing[id].mrp = value;
        setPricing(newPricing);
    }

    function handleUpdatePricing(id: any, value: any){
        console.log(value);
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
                    <th>Details</th>
                    <th>One day</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='text-center'>
                    <td><b>Vouchers</b></td>
                    <td>
                    <Form.Control as="select" defaultValue={pricing[0].voucher} onChange={(e) => handleUpdatePricing(0, e.target.value)}>
                        <option value={1}>Choose voucher</option>
                        <option value={10}>Get Fit - 10%</option>
                        <option value={20}>Get Fit - 20%</option>
                    </Form.Control>
                    </td>
                    </tr>
                    <tr className='text-center'>
                    <td><b>Total days</b></td>
                    <td>{pricing[0].duration} days</td>
                    </tr>
                    <tr className='text-center'>
                    <td><b>Suggested</b></td>
                    <td>₹ {pricing[0].suggestedPrice}</td>
                    </tr>
                    <tr>
                    <td className='text-center'><b>Set MRP</b></td>
                    <td>
                    <InputGroup>
                        <FormControl
                        className={`${pricing[0]?.mrp < pricing[0]?.suggestedPrice && pricing[0]?.mrp !== null ? "is-invalid" : pricing[0]?.mrp >= pricing[0]?.suggestedPrice ? "is-valid" : ""}`}
                        aria-label="Default"
                        type='number'
                        aria-describedby="inputGroup-sizing-default"
                        value={pricing[0]?.mrp}
                        onChange={(e) => {handlePricingUpdate(e.target.value, 0)}}
                        />
                    </InputGroup>  
                    {pricing[0]?.mrp < pricing[0]?.suggestedPrice && pricing[0]?.mrp !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹ {pricing[0]?.suggestedPrice}</span>}    
                    </td>
                    </tr>
                </tbody>
                </Table>
            </div>}
        </>
    )
};

export default PricingTable;