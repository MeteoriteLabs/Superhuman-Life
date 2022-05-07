import React, {useState, useContext} from 'react';
import {Row, Col, Form, Table, FormControl, InputGroup} from 'react-bootstrap';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';
import moment from 'moment';

const PricingTable = (props) => {

    const auth = useContext(AuthContext);
    const [show, setShow] = useState(props.value === 'free' ? true : false);
    const [vouchers, setVouchers] = useState<any>([]);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? JSON.parse(props.value) : [ {mrp: null, suggestedPrice: null, voucher: 1, duration: 1, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 30, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 90, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 180, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 1, duration: 360, sapienPricing: null}]);

    const GET_VOUCHERS = gql`
        query fetchVouchers($expiry: DateTime!, $id: ID!, $start: DateTime!, $status: String!) {
            vouchers(filters: {
                expiry_date: {
                  gte: $expiry
                },
                Start_date: {
                  lte: $start
                },
                Status: {
                  eq: $status
                },
                users_permissions_user:{
                  id: {
                    eq: $id
                  }
                }
              }){
                data{
                id
                  attributes{
                    voucher_name
                    discount_percentage
                    Status
                    Start_date
                    expiry_date
                  }
                }
              }
        }
    `;

    const [getVouchers] = useLazyQuery(GET_VOUCHERS, {onCompleted: (data) => {
        const flattenData = flattenObj({...data});
        setVouchers(flattenData.vouchers);
    }});
    React.useEffect(() => {
        getVouchers( {
            variables: {expiry: moment().toISOString(), id: auth.userid, start: moment().toISOString(), status: 'Active'},
        } );
      }, []);


    const SUGGESTED_PRICING = gql`
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
        useQuery(SUGGESTED_PRICING, {variables: { id: auth.userid },onCompleted: (data) => {loadData(data)}})
    }

    function loadData(data){
        const flattenData = flattenObj({...data});
        const newValue = [...pricing];
        newValue.forEach((item, index) => {
            if(item.voucher !== 1 && item.price !== null){
                item.suggestedPrice = ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
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

    console.log(vouchers);

    function handleUpdatePricing(id: any, value: any){
        if(parseInt(value) !== 1){
            let newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            // ((arraySapient[i] * 100) / (100 - 10)).toFixed(2)
            newValue[id].suggestedPrice = ((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(2);
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
                                <Form.Control as="select" value={item.voucher} onChange={(e) => handleUpdatePricing(index, e.target.value)}>
                                    <option value={1}>Choose voucher</option>
                                    {vouchers.map((voucher, index) => {
                                        return (
                                            <option value={voucher.discount_percentage}>{voucher.voucher_name}</option>
                                        )
                                    })}
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