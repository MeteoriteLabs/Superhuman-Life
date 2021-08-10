import React, { useState } from 'react'
import * as _ from 'lodash'
import { Form } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { GET_SAPIENT_PRICES } from '../../graphQL/queries'




export default function Voucher({ actionType, setFitnesspackagepricing, fitnesspackagepricing, type, mode,minPrice  ,setMinPrice, userData, arrSapientPrice }) {
console.log("🚀 ~ file: Voucher.tsx ~ line 11 ~ Voucher ~ arrSapientPrice", arrSapientPrice)

  
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4


    const handleOnChange = (e, index: number) => {
        let updateVoucher: any = ''
        updateVoucher = _.cloneDeep(fitnesspackagepricing)
        updateVoucher[index].voucher = e.target.value;

        // min. Set MRP = (Sapien MRP x 100) / (100 - Discount%)

        let updateValue = [...minPrice]
        if (e.target.value === "0%") {
            updateValue[index] = Number(arrSapientPrice[index])
            console.log('0%', updateValue)

        } else if (e.target.value === "10%") {
            updateValue[index] = Number(((arrSapientPrice[index] * 100) / (100 - 10)).toFixed(2))
            console.log('10%', updateValue)

        } else if (e.target.value === "20%") {
            updateValue[index] = Number(((arrSapientPrice[index] * 100) / (100 - 20)).toFixed(2))
            console.log('20%', updateValue)
        }
        
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
                        value={fitnesspackagepricing[index].voucher}
                        className='text-center w-75 mx-auto'
                        onChange={(e) => handleOnChange(e, index)} >
                        <option value="0%">Choose voucher</option>
                        <option value='10%'>Getfit - 10%</option>
                        <option value='20%'>Getfit - 20%</option>
                    </Form.Control>
                </Form.Group>
            </td>
        })}
    </>
}
