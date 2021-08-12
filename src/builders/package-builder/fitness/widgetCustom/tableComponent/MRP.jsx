import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { Form } from 'react-bootstrap'
import './MRP.css'





export default function MRP(props) {
    const { actionType, fitnesspackagepricing, setFitnesspackagepricing, type, mode, widgetProps, minPrice, setMinPrice, index, userData } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4

  



    const inputRef = useRef([])
    const spanRef = useRef([])


    useEffect(() => {
        inputRef.current = inputRef.current.splice(0, fitnesspackagepricing.length);
        spanRef.current = spanRef.current.splice(0, fitnesspackagepricing.length);
        
        if (actionType === "edit" || userData.fitnesspackagepricing) {
            let valid = null;
            const updateMRP = _.cloneDeep(fitnesspackagepricing);
            let updateIndex = index;



           
            for (let i = 0; i < updateMRP.length; i++) {
                if (updateMRP[i].mrp !== "") {
                    let mrp = Number(updateMRP[i].mrp);


                    if (mrp > 0 && mrp >= minPrice[i]) {
                        valid = true;
                        inputRef.current[i].className = "input"
                        spanRef.current[i].className = "d-none"
                    } else {

                        updateIndex = i
                        inputRef.current[i].className = "inputError"
                        spanRef.current[i].className = "d-block text-danger"
                        valid = false;
                        break;
                    }
                } else {
                    valid = false;
                    break;
                }
            }


           
            if (valid) {
                if (widgetProps.rawErrors) {
                    widgetProps.rawErrors[0] = ""
                }
                widgetProps.onChange(123)
                inputRef.current[updateIndex].className = "input"
                spanRef.current[updateIndex].className = "d-none"


            } else {
                if (widgetProps.rawErrors) {
                    widgetProps.rawErrors[0] = `MRP can't be empty or less than &#8377; ${minPrice[index]}`
                }
                inputRef.current[updateIndex].className = "inputError"
                spanRef.current[updateIndex].className = "d-block text-danger"

                widgetProps.onChange(null)
            }

        }

    }, [minPrice, fitnesspackagepricing])








    const handleValidationError = (e, index) => {
        let valid = false;
        const updateMRP = _.cloneDeep(fitnesspackagepricing)

        updateMRP[index].mrp = Number(e.target.value);
        setFitnesspackagepricing(updateMRP);


        for (let i = 0; i < updateMRP.length; i++) {
            
            if (updateMRP[i].mrp !== "") {
                let mrp = Number(updateMRP[i].mrp);
                if ((mrp > 0 && Number(updateMRP[i].mrp) >= minPrice[i]) ||  Number(e.target.value) >= minPrice[i]) {
                    // inputRef.current[i].className = "input"
                    // spanRef.current[i].className = "d-none"
                    valid = true;
                } else {
                    // inputRef.current[i].className = "inputError"
                    // spanRef.current[i].className = "d-block text-danger"
                    valid = false;
                    break;
                }
            } else {
                valid = false;
                break;
            }
        }
     
        return valid
    }


    const handleChange = (e, index) => {
        e.preventDefault();

        const valid = handleValidationError(e, index)

        if (valid) {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = ""
            }
            widgetProps.onChange(Number(e.target.value))
            inputRef.current[index].className = "input"
            spanRef.current[index].className = "d-none"

        } else {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = `MRP can't be empty or less than &#8377; ${minPrice[index]}`
            }
            inputRef.current[index].className = "inputError"
            spanRef.current[index].className = "d-block text-danger"
            widgetProps.onChange(null)
        }



    }

    return <>
        {[...Array(numEle)].map((item, index) => {
            return <td key={index}>
                <Form>
                    <Form.Control
                        id={index + 1}
                        style={{ margin: '0 auto', width: '75%', textAlign: 'center' }}
                        ref={el => inputRef.current[index] = el}
                        required
                        disabled={actionType === "view" ? true : false}
                        value={fitnesspackagepricing[index].mrp}
                        min="0"
                        type="number"
                        placeholder='Enter MRP'
                        onChange={(e) => handleChange(e, index)}
                    />
                </Form>
                <span
                    ref={el => spanRef.current[index] = el}
                    className='d-none'
                    style={{ fontSize: "0.9rem" }}>
                    Can't be empty or less than &#8377; {minPrice[index]}
                </span>
            </td>
        })}

    </>
}
