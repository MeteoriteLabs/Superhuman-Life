import React from 'react'
import _ from 'lodash'

export default function MRP(props) {
    const {actionType, status, formData,setFormData, childFitnesspackagepricing,setChildFitnesspackagepricing, setStatus,fitnesspackagepricing,setFitnesspackagepricing } = props

    // console.log('MRP: ', fitnesspackagepricing)

    return <>
   { [...Array(4)].map((item, index) => {
        return <td key={index}>
            <input
                key={index}
                disabled={actionType === "view" ? true : false}
                value={fitnesspackagepricing[index].mrp}
                className='w-75'
                min="0"
                max="6000"
                type="number"
                placeholder='Enter MRP'
                onChange={(e) => {
                    e.preventDefault();
                    setStatus(false)
                    const updateMRP = _.cloneDeep(fitnesspackagepricing)
                    updateMRP[index].mrp = e.target.value;
                    setFitnesspackagepricing(updateMRP);
             
            
                }} />
        </td>
    })}
    </>
}
