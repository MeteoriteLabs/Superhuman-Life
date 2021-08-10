import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { Form } from 'react-bootstrap'
import './MRP.css'





export default function MRP(props) {
    const { actionType, fitnesspackagepricing, setFitnesspackagepricing, type, mode, userData, widgetProps, minPrice, setMinPrice } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4

    const [currentMinPrice, setCurrentMinPrice] = useState([])

    console.log('minPrice', minPrice)
    console.log('currentMinPrice', currentMinPrice)
    // validation
    // min. Set MRP = (Sapien MRP x 100) / (100 - Discount%)

    // const [stateValid, setStateValid] = useState(null)


    const inputRef = useRef([])
    const spanRef = useRef([])

    
    useEffect(() => {
        inputRef.current = inputRef.current.splice(0, fitnesspackagepricing.length);
        spanRef.current = spanRef.current.splice(0, fitnesspackagepricing.length);

        // let valid = true
        // for (let i = 0; i < fitnesspackagepricing.length; i++) {
        //     if (fitnesspackagepricing[i].mrp.length) {
        //         let mrp = Number(fitnesspackagepricing[i].mrp);
        //         if (mrp > 0) {
        //             valid = true
        //         } else {
        //             valid = false
        //             break;
        //         }
        //     } else {
        //         valid = true
        //         break;
        //     }
        // }

        // if (!valid) {
        //     if (widgetProps.rawErrors) {
        //         widgetProps.rawErrors[0] = `MRP can't be empty or less than 1`
        //     }
        //     widgetProps.onChange(null)
        // } else {
        //     if (widgetProps.rawErrors) {
        //         widgetProps.rawErrors[0] = ""
        //     }
        //     widgetProps.onChange(123)
        // }


    }, [fitnesspackagepricing, userData])





    useEffect(() => {

    }, [fitnesspackagepricing])


    const handleValidationError = (e, index) => {
        let valid = false;
        const updateMRP = _.cloneDeep(fitnesspackagepricing)

        updateMRP[index].mrp = Number(e.target.value);
        setFitnesspackagepricing(updateMRP);


        for (let i = 0; i < updateMRP.length; i++) {
            if (updateMRP[i].mrp !== "") {
                let mrp = Number(updateMRP[i].mrp);
                console.log("mrp", Number(e.target.value))
                console.log("minPrice[index]", minPrice[index])
                if ((mrp > 0 && Number(updateMRP[i].mrp) >= minPrice[index]) || Number(e.target.value) >= minPrice[index]) {
                    valid = true;
                } else {
                    valid = false;
                    break;
                }
            } else {
                valid = false;
                break;
            }
        }
        console.log(valid)
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
                widgetProps.rawErrors[0] = `MRP can't be empty or less than ${minPrice[index]}`
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
                    style={{fontSize:"0.9rem"}}>
                    Can't be empty or less than ${minPrice[index]}
                </span>
            </td>
        })}

    </>
}
