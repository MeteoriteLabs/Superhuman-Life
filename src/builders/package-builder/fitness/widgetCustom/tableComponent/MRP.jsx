import React from 'react'
import _ from 'lodash'

export default function MRP(props) {
    const { actionType, setStatus, fitnesspackagepricing, setFitnesspackagepricing, type, mode } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout"  ||  mode === "Offline Workout" ) ? 1 : 4
    // console.log('MRP: ', fitnesspackagepricing)

    return <>
        {[...Array(numEle)].map((item, index) => {
            return <td key={index}>
                <input
                    required
                    key={index}
                    disabled={actionType === "view" ? true : false}
                    value={fitnesspackagepricing[index].mrp}
                    className='w-50'
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
                    }}
                />
            </td>
        })}
    </>
}
