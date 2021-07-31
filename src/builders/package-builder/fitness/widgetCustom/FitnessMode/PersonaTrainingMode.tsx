import React from 'react'

export default function PersonaTrainingMode({ type, actionType, widgetProps, PTProps }) {


    let arrMode = ["Online", "Offline", "Hybrid", "Workout"];
    if (type !== "Personal Training") {
        arrMode = arrMode.slice(0, 3)
    }




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



    return <div className='d-flex'>
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
}
