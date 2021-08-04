import React from 'react'


export default function FitnessRestday(props: any) {
    const { PTProps, widgetProps, actionType, groupProps, customProps } = props;


    console.log(PTProps)

    return <div className=' text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
        <img src="/assets/rest-icon.svg" alt='123' />
        <label className='d-block font-weight-bold mb-0 mr-3'>{widgetProps.label}</label>
        <input
            required
            disabled={(actionType === "view") ? true : false}
            className="py-2 px-2"
            value={widgetProps.value ? widgetProps.value : ""}
            pattern="[0-9]+"
            onChange={(event: any) => {
                if (event.target.value > PTProps.properties.restDay.maximum || event.target.value > groupProps.properties.restDay.maximum) {
                    // widgetProps.schema.maximum = 0
                    event.target.value = 0
                } else {
                    PTProps.properties.restDay.value = parseInt(event.target.value);
                    groupProps.properties.restDay.value = parseInt(event.target.value)
                    customProps.properties.restDay.value = parseInt(event.target.value)
                    widgetProps.onChange(event.target.value);
                }
            }}
            type="number"
            min="0"
            max="30"
        />
    </div>
}
