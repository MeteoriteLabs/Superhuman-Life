import React, {useState, useContext} from 'react';
import * as _ from 'lodash'
import { Form } from 'react-bootstrap'

import {gql, useLazyQuery} from '@apollo/client';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';
import moment from 'moment';



export default function Voucher({ actionType, setFitnesspackagepricing, fitnesspackagepricing, type, mode,minPrice  ,setMinPrice, arrSapientPrice,setIndex }) {

    const auth = useContext(AuthContext);
    const [vouchers, setVouchers] = useState<any>([]);
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


  
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4


    const handleOnChange = (e, index: number) => {
        let updateVoucher: any = ''
        updateVoucher = _.cloneDeep(fitnesspackagepricing)
        updateVoucher[index].voucher = e.target.value;

      
        let updateValue = [...minPrice]
        if (e.target.value === "0%") {
            updateValue[index] = Number(arrSapientPrice[index])
      

        } else  {
            updateValue[index] = Number(((arrSapientPrice[index] * 100) / (100 - e.target.value)).toFixed(2))
        } 
        
        setIndex(index)
        setMinPrice(updateValue)
        setFitnesspackagepricing(updateVoucher);
    }

    return <>
        {[...Array(numEle)].map((item: any, index: number) => {
            return <td key={index}>
                <Form.Group>
                    <Form.Control
                        as="select"
                        required
                        disabled={actionType === "view" ? true : false}
                        value={fitnesspackagepricing[index]?.voucher}
                        className='text-center w-75 mx-auto'
                        onChange={(e) => handleOnChange(e, index)} >
                        <option value={0}>Choose voucher</option>
                        {vouchers.map((voucher, index) => {
                            return (
                                <option value={voucher.discount_percentage}>{voucher.voucher_name}</option>
                            )
                        })}
                    </Form.Control>
                </Form.Group>
            </td>
        })}
    </>
}
