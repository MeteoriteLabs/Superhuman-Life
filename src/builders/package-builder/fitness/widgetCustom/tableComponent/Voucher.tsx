import React from 'react'
import * as _ from 'lodash'




export default function Voucher(props) {
    const { actionType, setFitnesspackagepricing, fitnesspackagepricing, type, mode } = props
    console.log("🚀 ~ file: Voucher.tsx ~ line 9 ~ Voucher ~ fitnesspackagepricing", fitnesspackagepricing)
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4

 
    return <>
        {[...Array(numEle)].map((item: any, index: number) => {
            return <td key={index}>
                <select
                    required
                    disabled={actionType === "view" ? true : false}
                    value={fitnesspackagepricing[index].voucher}
                    className='text-center'
                    onChange={(e) => {
                        let updateVoucher: any = ''
                        updateVoucher = _.cloneDeep(fitnesspackagepricing)
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
