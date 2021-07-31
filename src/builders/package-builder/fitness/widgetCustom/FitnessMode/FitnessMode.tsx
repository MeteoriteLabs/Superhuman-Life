
import React from 'react'
import PersonaTrainingMode from './PersonaTrainingMode'

export default function FitnessMode(props) {
    const { widgetProps, PTProps, type, userData, actionType } = props

    console.log(userData);


    return (
        <div>
            {(type !== "Classic Class") &&
                <div>
                    <PersonaTrainingMode
                        type={type}
                        actionType={actionType}
                        widgetProps={widgetProps}
                        PTProps={PTProps}
                    />


                    <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
                        <p className='m-0'>Set for {userData.duration ? userData.duration : PTProps.properties.duration.default} days</p>
                    </div>
                </div>}
        </div>

    )
}
