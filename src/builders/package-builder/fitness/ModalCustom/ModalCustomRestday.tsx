import React from 'react'

export default function ModalCustomRestday(PTProps: any) {

    // console.log(PTProps)
    const { props } = PTProps
    const duration = PTProps.PTProps.properties.title_package.duration;
    const offlineClasses = PTProps.PTProps.properties.offlineClasses.value
    const onlineClasses = PTProps.PTProps.properties.onlineClasses.value
    const restDay = PTProps.PTProps.properties.restDay.value


    PTProps.PTProps.properties.dayAvailable.value = duration - offlineClasses - onlineClasses - restDay

    if (PTProps.PTProps.properties.dayAvailable.value < 0) {
        props.schema.maximum = 0
    } else if (PTProps.PTProps.properties.dayAvailable.value === 0) {
        props.schema.maximum = 30
    }

    // console.log("dayAvailable", PTProps.PTProps.properties.dayAvailable.value);
    return <div className=' text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
        <img src="/assets/rest-icon.svg" alt='123' />
        <label className='d-block font-weight-bold mb-0 mr-3'>{PTProps.props.label}</label>
        <input
            className="py-2 px-2"
            // value={PTProps.props.value}
            // pattern="[0-9]+"
            onChange={(event: any) => {
                PTProps.PTProps.properties.restDay.value = parseInt(event.target.value)
                PTProps.props.onChange(event.target.value);
            }}
            type="number"
            min="0"
            max={PTProps.PTProps.properties.dayAvailable.value}
        />
    </div>
}
