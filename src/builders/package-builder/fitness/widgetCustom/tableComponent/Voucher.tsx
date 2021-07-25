import React from 'react'
import * as _ from 'lodash'

export default function Voucher(props) {
    const {actionType, setStatus,setFitnesspackagepricing, fitnesspackagepricing, type } = props
    let numEle = type === "Classic Class" ? 1 : 4
    return <>
    
    {[...Array(numEle)].map((item: any, index: number) => {
            return <td key={index}>
            <select
                disabled={actionType === "view" ? true : false}
                value={fitnesspackagepricing[index].voucher}
                onChange={(e) => {
                    setStatus(false)
                    const updateVoucher = _.cloneDeep(fitnesspackagepricing)
                    updateVoucher[index].voucher = e.target.value;
                    setFitnesspackagepricing(updateVoucher);

                }}
            >
                <option value='0'>Choose voucher</option>
                <option value='10%'>Getfit - 10%</option>
                <option value='20%'>Getfit - 20%</option>
            </select></td>
        })
     }
    </>
}
