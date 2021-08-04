import React from 'react'
import { useState } from 'react';
import PTClasses from '../FitnessClasses/PTClasses';


export default function PersonaTrainingMode({ type, actionType, widgetProps, PTProps, groupProps }) {

    const [mode, setMode] = useState()

    let arrMode = ["Online", "Offline", "Hybrid", "Online Workout", "Offline Workout"];
    if (type !== "Personal Training") {
        arrMode = arrMode.slice(0, 3)
    }




    const handleChange = (e) => {
        console.log('PTProps', PTProps)
        widgetProps.onChange(e.target.value)
        if (e.target.value === "Online Workout" || e.target.value === "Offline Workout") {
            PTProps.properties.duration.value = 1
            PTProps.properties.duration.default = 1
        } else {
            PTProps.properties.duration.value = 30
            PTProps.properties.duration.default = 30
            groupProps.properties.duration.value = 30
            groupProps.properties.duration.default = 30
        }

        PTProps.properties.ptonlineClasses.value = 0
        PTProps.properties.ptofflineClasses.value = 0
        groupProps.properties.grouponlineClasses.value = 0
        groupProps.properties.groupofflineClasses.value = 0
        setMode(e.target.value)
    }



    return <div>

        <div className='d-flex'>
            {arrMode.map((item, index) => {
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
            })}
        </div>


            
            {/* <PTClasses
                packageTypeName={packageTypeName}
                widgetProps={widgetProps}
                actionType={actionType}
                PTProps={PTProps}

            /> */}
      

    </div>
}
