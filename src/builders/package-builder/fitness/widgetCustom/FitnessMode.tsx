import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'

export default function FitnessMode(props) {
    const { widgetProps, PTProps, type, formData, actionType } = props
 


    const handleChange = (e) => {
        widgetProps.onChange(e.target.value)
        if (e.target.value === "Workout") {
            PTProps.properties.duration.value = 1
            PTProps.properties.duration.default = 1
        } else {
            PTProps.properties.duration.value = 30
            PTProps.properties.duration.default = 30
        }
    }



    const renderPT = (type) => {
        let arrMode = ["Online", "Offline", "Hybrid", "Workout"];
        if (type !== "Personal Training") {
            arrMode = arrMode.slice(0, 3)
        }
        return arrMode.map((item, index) => {
            return <div className="radio mr-3" key={index}>
                <label >
                    <input
                        disabled={(actionType === "view") ? true : false}
                        checked={widgetProps.value === item}
                        className='mr-1'
                        type="radio"
                        value={item}
                        onChange={e => handleChange(e)} />
                    {item}
                </label>
            </div>
        })

    }

    return (
        <div>
            {(type !== "Classic Class") &&
                <div>
                    <div className='d-flex '>
                        {renderPT(type)}
                    </div>

                    <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
                        <p className='m-0'>Set for {PTProps.properties.duration.default} days</p>
                    </div>
                </div>}
        </div>

    )
}
