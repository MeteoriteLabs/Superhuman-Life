import React, {useState, useContext, useEffect} from 'react';
import { Form, Table, FormControl, InputGroup, Button} from 'react-bootstrap';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

const PricingTable = (props) => {

    const inputDisabled = props.readonly;
    const bookingDetails = JSON.parse(props.formContext.channelinstantBooking);

    function handleReturnType(val: any) {
        if (typeof(val) === 'string') {
             if(bookingDetails.instantBooking && JSON.parse(val).length === 4){
                  return handleDefaultPricing();
             }else {
                  if(!bookingDetails.instantBooking && JSON.parse(val).length === 5){
                       return handleDefaultPricing()
                  }else{
                       return JSON.parse(val);
                  }
             }
        } else {
             if(bookingDetails.instantBooking && val.length === 4){
                  return handleDefaultPricing();
             }else{
                  if(!bookingDetails.instantBooking && val.length === 5){
                       return handleDefaultPricing();
                  }else {
                       return val;
                  }
             }
        }
    }

    function handleDefaultPricing(){
        if (bookingDetails.instantBooking) {
             return [ {mrp: null, suggestedPrice: null, voucher: 0, duration: 1, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 30, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 90, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 180, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 360, sapienPricing: null}]
        } else {
             return [{mrp: null, suggestedPrice: null, voucher: 0, duration: 30, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 90, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 180, sapienPricing: null}, {mrp: null, suggestedPrice: null, voucher: 0, duration: 360, sapienPricing: null}]
        }
   }

    const auth = useContext(AuthContext);
    const [vouchers, setVouchers] = useState<any>([]);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? handleReturnType(props.value) : handleDefaultPricing());

    useEffect(() => {
        if(bookingDetails.freeDemo){
             const values = [...pricing];
             values[0].mrp = 'free';
             setPricing(values);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingDetails.freeDemo]);   

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
            sapienPricings(
            filters:{
                fitness_package_type:{
                type: {
                    eq: "Live Stream Channel"
                }
                }
            }
            ){
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
            if(item.voucher !== 0 && item.price !== null){
                item.suggestedPrice = parseInt(((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2))
            }else {
                if(item.duration === 1){
                    if(bookingDetails.freeDemo){
                        item.suggestedPrice = 'free';
                    }else {
                        item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp;
                    }
                }else {
                    item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration;
                }
            }
            item.sapienPricing = flattenData.sapienPricings[0]?.mrp * item.duration;
        });
        setPricing(newValue);
    }

    function handlePricingUpdate(value: any, id: any){
        let newPricing = [...pricing];
        newPricing[id].mrp = value;
        setPricing(newPricing);
    }

    useEffect(() => {
        if((pricing[0].mrp !== null && pricing[0].mrp >= parseInt(pricing[0].sapienPricing)) || 
             (pricing[1].mrp !== null && pricing[1].mrp >= parseInt(pricing[1].sapienPricing)) || 
             (pricing[2].mrp !== null && pricing[2].mrp >= parseInt(pricing[2].sapienPricing)) || 
             (pricing[3].mrp !== null && pricing[3].mrp >= parseInt(pricing[3].sapienPricing))){
             props.onChange(JSON.stringify(pricing));    
        }else {
             props.onChange(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricing]);


    function handleUpdatePricing(id: any, value: any){
        if(parseInt(value) !== 0){
            let newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            // ((arraySapient[i] * 100) / (100 - 10)).toFixed(2)
            newValue[id].suggestedPrice = parseInt(((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(0));
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
                <div className="d-flex justify-content-between p-2">
                    <div>
                        <h4>Subscription Plan</h4>
                    </div>
                    <div>
                        
                    <Button variant='outline-info' onClick={() => {window.location.href = '/finance'}}>Add suggest pricing</Button>
                    </div>
                </div>
                <Table style={{ tableLayout: 'fixed'}}>
                <thead>
                    <tr className='text-center'>
                    <th></th>
                    {bookingDetails.instantBooking && <th>One Day</th>}
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
                                <Form.Control as="select" disabled={inputDisabled} value={item.voucher} onChange={(e) => handleUpdatePricing(index, e.target.value)}>
                                    <option value={0}>Choose voucher</option>
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
                                    className={`${pricing[index]?.mrp < pricing[index]?.sapienPricing && pricing[index]?.mrp !== null ? "is-invalid" : pricing[index]?.mrp >= pricing[index]?.sapienPricing ? "is-valid" : ""}`}
                                    aria-label="Default"
                                    type='number'
                                    disabled={(item.duration === 1 && bookingDetails.freeDemo) || inputDisabled ? true : false}
                                    min={0} 
                                    aria-describedby="inputGroup-sizing-default"
                                    value={pricing[index]?.mrp}
                                    onChange={(e) => {handlePricingUpdate(e.target.value, index)}}
                                    />
                                    {pricing[index]?.mrp < pricing[index]?.sapienPricing && pricing[index]?.mrp !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹ {pricing[index]?.sapienPricing}</span>}    
                                </InputGroup>
                            </td>
                        )
                    })}
                    </tr>
                </tbody>
                </Table>
            </div>
        </>
    )
};

export default PricingTable;