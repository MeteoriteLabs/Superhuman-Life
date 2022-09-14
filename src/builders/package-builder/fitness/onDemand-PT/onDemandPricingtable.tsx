import React, {useState, useContext, useEffect} from 'react';
import { Form, Table, FormControl, InputGroup, Button} from 'react-bootstrap';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

const PricingTable = (props) => {

    const inputDisabled = props.readonly;

    function handleReturnType(val: any) {
        if (typeof(val) === 'string') {
            return JSON.parse(val);
        } else {
            return val;
        }
    }

    console.log(props.formContext.programDetails);
    const classDetails = JSON.parse(props.formContext.programDetails);

     const classMode = classDetails.mode === "0" ? "Online" : classDetails.mode === "1" ? "Offline" : "Hybrid";

    const auth = useContext(AuthContext);
    const [vouchers, setVouchers] = useState<any>([]);
    const [pricing, setPricing] = useState<any>(props.value !== undefined && props.value !== 'free' ? handleReturnType(props.value) : [{mrp: null, suggestedPrice: null, voucher: 0, duration: 1, sapienPricing: null}]);

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

      useEffect(() => {
        // eslint-disable-next-line
        pricing.map((item, index) => {
            if(item.mrp === 0 || item.mrp === ""){
              const values = [...pricing];
              values[index].mrp = null;
              setPricing(values);
            }
        });
      },[pricing]);

      console.log(pricing);


    const SUGGESTED_PRICING = gql`
        query fetchSapienPricing($id: ID!) {
            suggestedPricings(filters: {
                fitness_package_type: {
                  type: {
                    eq: "One-On-One"
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
                    Mode
                    fitness_package_type{
                         data{
                         id
                           attributes{
                             type
                           }
                         }
                       }
                  }
                }
              }
            sapienPricings(
            filters:{
                fitness_package_type:{
                type: {
                    eq: "One-On-One"
                }
                }
            }
            ){
                data{
                    id
                    attributes{
                    mrp
                    mode
                    fitness_package_type{
                         data{
                         id
                           attributes{
                             type
                           }
                         }
                       }
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
        if(classMode === "Online"){
          flattenData.suggestedPricings = flattenData.suggestedPricings.filter((item) => item.Mode === classMode);
          flattenData.sapienPricings = flattenData.sapienPricings.filter((item) => item.mode === classMode)
          newValue.forEach((item, index) => {
               if(item.voucher !== 0 && item.price !== null){
                   item.suggestedPrice = parseInt(((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2))
               }else {
                   item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * 1 * item.duration;
               }
               item.sapienPricing = flattenData.sapienPricings[0]?.mrp * 1 * item.duration;
          });
        }else if(classMode === "Offline"){
          flattenData.suggestedPricings = flattenData.suggestedPricings.filter((item) => item.Mode === classMode);
          flattenData.sapienPricings = flattenData.sapienPricings.filter((item) => item.mode === classMode)
          newValue.forEach((item, index) => {
               if(item.voucher !== 0 && item.price !== null){
                   item.suggestedPrice = parseInt(((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2))
               }else {
                   item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * 1 * item.duration;
               }
               item.sapienPricing = flattenData.sapienPricings[0]?.mrp * 1 * item.duration;
          });
        }else if(classMode === "Hybrid"){
          newValue.forEach((item, index) => {
               if(item.voucher !== 0 && item.price !== null){
                   item.suggestedPrice = parseInt(((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2))
               }else {
                    const onlinePrice = flattenData.suggestedPricings[0]?.mrp * 1 * item.duration;
                    const offlinePrice = flattenData.suggestedPricings[1]?.mrp * 1 * item.duration;
                    item.suggestedPrice = onlinePrice + offlinePrice;
               }
               const onlinePrice = flattenData.sapienPricings[0]?.mrp * 1 * item.duration ;
               const offlinePrice = flattenData.sapienPricings[1]?.mrp * 1 * item.duration ;
               item.sapienPricing = onlinePrice + offlinePrice;
          });
        }
        
        setPricing(newValue);
    }

    function handlePricingUpdate(value: any, id: any){
        let newPricing = [...pricing];
        newPricing[id].mrp = value;
        setPricing(newPricing);
    }

    if((pricing[0].mrp !== null && pricing[0].mrp >= parseInt(pricing[0].sapienPricing))){
      props.onChange(JSON.stringify(pricing));    
    }else {
      props.onChange(undefined)
    }

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
            {<div>
                <div className="d-flex justify-content-end p-2">
                        
                    <Button variant='outline-info' onClick={() => {window.location.href = '/finance'}}>Add suggest pricing</Button>
                </div>
                <Table style={{ tableLayout: 'fixed'}}>
                <thead>
                    <tr className='text-center'>
                    <th></th>
                    <th>Monthly</th>
                    </tr>
                </thead>
                <tbody>
                    {(classMode === "Online" || classMode === "Hybrid") &&<tr className='text-center'>
                         <td><img src="/assets/personal-training-online.svg" alt="personal-training-online"/></td>
                         {pricing.map((item, index) => {
                              return (
                                   <td>{1 * item.duration} Classes</td>
                              )
                         })}
                    </tr>}
                    {(classMode === "Offline" || classMode === "Hybrid") &&<tr className='text-center'>
                         <td> <img src="/assets/personal-training-offline.svg" alt="personal-training-offline"/></td>
                         {pricing.map((item, index) => {
                              return (
                                   <td>{1 * item.duration} Classes</td>
                              )
                         })}
                    </tr>}
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
                            <td>{isNaN(item.suggestedPrice)  ? 'Base Price Not Set' : `₹ ${item.suggestedPrice}`}</td>
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
                                    min={0}
                                    aria-describedby="inputGroup-sizing-default"
                                    value={pricing[index]?.mrp}
                                    onChange={(e) => {handlePricingUpdate(e.target.value, index)}}
                                    disabled={inputDisabled}
                                    />
                                </InputGroup>
                                {pricing[index]?.mrp < pricing[index]?.sapienPricing && pricing[index]?.mrp !== null && <span style={{ fontSize: '12px', color: 'red'}}>cannot be less than ₹ {pricing[index]?.sapienPricing}</span>}    
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