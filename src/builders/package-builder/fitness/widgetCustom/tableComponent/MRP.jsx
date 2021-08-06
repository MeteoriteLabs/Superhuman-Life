import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { Form } from 'react-bootstrap'
import './MRP.css'




export default function MRP(props) {
    const { actionType, fitnesspackagepricing, setFitnesspackagepricing, type, mode, formData, widgetProps } = props
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4

    // console.log('widgetProps.rawErrors', widgetProps.rawErrors)
    // console.log('widgetProps', widgetProps)

 

    const [stateValid, setStateValid] = useState(false)
 

    const inputRef = useRef([])
    const spanRef = useRef([])

   

    useEffect(() => {
        inputRef.current = inputRef.current.splice(0, fitnesspackagepricing.length)
        spanRef.current = spanRef.current.splice(0, fitnesspackagepricing.length)
    }, [fitnesspackagepricing])
    
    useEffect(() => {

        for (let i = 0; i < fitnesspackagepricing.length; i++) {
            if (fitnesspackagepricing[i].mrp.length) {
                let mrp = Number(fitnesspackagepricing[i].mrp);
                if (mrp > 0) {
                    setStateValid(true);
                } else {
                    setStateValid(false)
                    break;
                }
            } else {
                setStateValid(true)
                break;
            }
        }
    
        if (!stateValid) {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = "MRP can't be empty or less than 1"
            }
            widgetProps.onChange(null)
        } else {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = ""
            }
        }
    },[])
    



    const handleChange = (e, index) => {
        e.preventDefault();

        const updateMRP = _.cloneDeep(fitnesspackagepricing)
        updateMRP[index].mrp = e.target.value;
        setFitnesspackagepricing(updateMRP);

        console.log('inputRef.current', inputRef.current[index])
        console.log('spanRef.current', spanRef.current[index])

        console.log(updateMRP)

        let valid = false;
        for (let i = 0; i < updateMRP.length; i++) {
            if (updateMRP[i].mrp.length) {
                let mrp = Number(updateMRP[i].mrp);
                if (mrp > 0) {
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



        console.log('widgetProps.rawErrors', widgetProps)

        if (valid && stateValid) {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = ""
            }
            widgetProps.onChange(e.target.value)
            inputRef.current[index].className = "input"
            spanRef.current[index].className = "d-none"
          
        } else {
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = "MRP can't be empty or less than 1"
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
                        style={{margin:'0 auto', width:'80%', textAlign:'center'}}
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
                    className='d-none'>
                    Can't be empty or less than 1
                </span>
            </td>
        })}

    </>
}
