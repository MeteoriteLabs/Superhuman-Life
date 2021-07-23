import React from 'react'


export default function ModalCustomClasses(props) {

    const { PTProps, widgetProps, actionType,  name } = props;
    console.log(PTProps)
    const duration = PTProps.properties.duration.value;
    const offlineClasses = PTProps.properties.offlineClasses.value
    const onlineClasses = PTProps.properties.onlineClasses.value
    const restDay = PTProps.properties.restDay.value


    PTProps.properties.dayAvailable.value = duration - offlineClasses - onlineClasses - restDay
    // props.schema.maximum = PTProps.PTProps.properties.dayAvailable.value

    if (PTProps.properties.dayAvailable.value === 0) {
        widgetProps.schema.maximum = 30
    } else if (PTProps.properties.dayAvailable.value < 0) {
        widgetProps.schema.maximum = 0
    }





    // console.log("dayAvailable", PTProps.PTProps.properties.dayAvailable.value);
    // console.log('mode',PTProps.PTProps.properties.currentMode.typeMode )

    return (
        <div>

            <div className='text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >

                {widgetProps.schema.title === 'Online' ?
                    <img src={`/assets/${name}-Online.svg`} alt='123' /> : <img src={`/assets/${name}-Offline.svg`} alt='123' />
                }
                <label className='d-block font-weight-bold mb-0 mr-5'>{widgetProps.schema.title}</label>
                <input
                    className="py-2 px-2"
                    disabled={actionType === "view" ? true : false}
                    value={widgetProps.value && widgetProps.value}
                    pattern="[0-9]+"
                    onChange={(event: any) => {

                        if (widgetProps.label === 'Offline') {
                            PTProps.properties.offlineClasses.value = parseInt(event.target.value)
                        } else if (props.label === 'Online') {
                            PTProps.properties.onlineClasses.value = parseInt(event.target.value)
                        }

                        // props.schema.maximum -= event.target.value
                        widgetProps.onChange(parseInt(event.target.value))

                    }}
                    type="number"
                    min="0"
                    // max={PTProps.PTProps.properties.dayAvailable.value <= 0 ? 0 : PTProps.PTProps.properties.dayAvailable.value}
                    max="30"
                />

            </div>
        </div>
    )
}
