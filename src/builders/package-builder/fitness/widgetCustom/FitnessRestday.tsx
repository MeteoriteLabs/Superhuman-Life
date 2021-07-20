import React from 'react'


export default function ModalCustomRestday(props: any) {
    const { PTProps, widgetProps, actionType } = props;
    const duration = PTProps.properties.title_package.duration;
    const offlineClasses = PTProps.properties.offlineClasses.value
    const onlineClasses = PTProps.properties.onlineClasses.value
    const restDay = PTProps.properties.restDay.value


    PTProps.properties.dayAvailable.value = duration - offlineClasses - onlineClasses - restDay
    // props.schema.maximum = PTProps.PTProps.properties.dayAvailable.value
    if (PTProps.properties.dayAvailable.value === 0) {
        widgetProps.schema.maximum = 30
    }





    // console.log("dayAvailable", PTProps.PTProps.properties.dayAvailable.value);
    return <div className=' text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
        <img src="/assets/rest-icon.svg" alt='123' />
        <label className='d-block font-weight-bold mb-0 mr-3'>{widgetProps.label}</label>
        <input
            disabled={actionType === "view" ? true: false}
            className="py-2 px-2"
            value={widgetProps.value && widgetProps.value}
            // pattern="[0-9]+"
            onChange={(event: any) => {
                if (PTProps.properties.dayAvailable.value <= 0) {
                    event.target.value = 0
                }

                PTProps.properties.restDay.value = parseInt(event.target.value)
                widgetProps.onChange(event.target.value);
            }}
            type="number"
            min="0"
            max="30"
        // max={PTProps.PTProps.properties.dayAvailable.value}
        />
    </div>
}
