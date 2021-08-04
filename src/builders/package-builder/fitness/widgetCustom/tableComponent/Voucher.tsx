import React from 'react'
import * as _ from 'lodash'
import { useEffect } from 'react'
import { useState } from 'react'



export default function Voucher(props) {
    const { actionType, setFitnesspackagepricing, fitnesspackagepricing, type, mode, formData } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4

    // }, [])
    console.log("🚀 ~ file: Voucher.tsx ~ line 10 ~ Voucher ~ formData", formData)
    console.log("🚀 ~ file: Voucher.tsx ~ line 8 ~ Voucher ~ fitnesspackagepricing", fitnesspackagepricing)

    return <>
        {[...Array(numEle)].map((item: any, index: number) => {
            return <td key={index}>
                <select
                    required
                    disabled={actionType === "view" ? true : false}
                    // value={fitnesspackagepricing[index].voucher}
                    // value ={value[index].voucher}
                    value ={formData ? formData[index].voucher : fitnesspackagepricing[index].voucher}
                    onChange={(e) => {

                        const updateVoucher = _.cloneDeep(fitnesspackagepricing)
                        updateVoucher[index].voucher = e.target.value;
                        setFitnesspackagepricing(updateVoucher);

                    }}
                >
                    <option >Choose voucher</option>
                    <option value='10%'>Getfit - 10%</option>
                    <option value='20%'>Getfit - 20%</option>
                </select></td>
        })}
    </>
}
