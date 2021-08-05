import React from 'react'
import _ from 'lodash'
import { Form } from 'react-bootstrap'

export default function MRP(props) {
    const { actionType, fitnesspackagepricing, setFitnesspackagepricing, type, mode, formData } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4


    return <>
        {[...Array(numEle)].map((item, index) => {
            return <td key={index}>
                <Form>
                    <Form.Control
                        required
                        key={index}
                        disabled={actionType === "view" ? true : false}
                        value={fitnesspackagepricing[index].mrp}
                 
                        min="0"
                        max="6000"
                        type="number"
                        placeholder='Enter MRP'
                        onChange={(e) => {
                            e.preventDefault();
                            const updateMRP = _.cloneDeep(fitnesspackagepricing)
                            updateMRP[index].mrp = e.target.value;
                            setFitnesspackagepricing(updateMRP);
                        }}
                    />
                </Form>

            </td>
        })}
    </>
}
