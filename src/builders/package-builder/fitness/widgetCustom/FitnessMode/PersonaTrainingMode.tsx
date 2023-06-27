import React from 'react'

const PersonaTrainingMode: React.FC<{
    type: string
    actionType: string
    widgetProps: any
    PTProps: any
    groupProps: any
    userData: any
}> = (props) => {
    let arrMode = ['Online', 'Offline', 'Hybrid', 'Online Workout', 'Offline Workout']
    if (props.type !== 'One-On-One') {
        arrMode = arrMode.slice(0, 3)
    }

    const handleChange = (e) => {
        props.widgetProps.onChange(e.target.value)
        if (e.target.value === 'Online Workout' || e.target.value === 'Offline Workout') {
            props.PTProps.properties.duration.value = 1
            props.PTProps.properties.duration.default = 1
            props.userData.duration = 1
        } else {
            props.PTProps.properties.duration.value = 30
            props.PTProps.properties.duration.default = 30
            props.groupProps.properties.duration.value = 30
            props.groupProps.properties.duration.default = 30
            props.userData.duration = 30
        }

        props.PTProps.properties.ptonlineClasses.value = 0
        props.PTProps.properties.ptofflineClasses.value = 0
        props.groupProps.properties.grouponlineClasses.value = 0
        props.groupProps.properties.groupofflineClasses.value = 0
    }

    return (
        <div>
            <div className="d-flex">
                {arrMode.map((item, index) => {
                    return (
                        <div className="radio mr-3" key={index}>
                            <label>
                                <input
                                    disabled={props.actionType === 'view' ? true : false}
                                    checked={props.widgetProps.value === item}
                                    className="mr-1"
                                    type="radio"
                                    value={item}
                                    onChange={(e) => handleChange(e)}
                                />
                                {item}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PersonaTrainingMode
