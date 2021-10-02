import  { useEffect } from 'react'
import { useRef } from 'react';
import { Form } from 'react-bootstrap';

export default function CustomClasses({ customProps: { properties }, widgetProps, packageTypeName, actionType, userData }) {


    const { customPTOnline, customPTOffline, customGroupOnline, customGroupOffline, record, restDay, duration } = properties

    const dayAvailableRef = useRef<any>(null)


    useEffect(() => {
        const setValue = () =>{
            if (userData.ptonline) {
               customPTOnline.value = userData.ptonline
            }
    
            if (userData.ptoffline) {
                customPTOffline.value = userData.ptoffline
            }
    
            if (userData.grouponline) {
                customGroupOnline.value = userData.grouponline
            }
    
            if (userData.groupoffline) {
                customGroupOffline.value = userData.groupoffline
            }
            if (userData.recordedclasses) {
                record.value = userData.recordedclasses
    
            }
            if (userData.restDay) {
               restDay.value = userData.restdays
            }
        }
        setValue()
    })
    

    const showErrorMessage = (e: { target: { value: string; }; }) => {
        if (dayAvailableRef.current < 0) {
            widgetProps.schema.maximum = 0
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = `should be <= ${parseInt(e.target.value) - (dayAvailableRef.current * -1)}`
            }
        } else if (dayAvailableRef.current >= 0) {
            widgetProps.schema.maximum = 30
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = ""
            }

        }
    }



    const handleValidation = (e: { target: { value: string; }; }) => {
        dayAvailableRef.current = duration.value
        if (widgetProps.id === "root_ptonline") {
            customPTOnline.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + customPTOffline.value + customGroupOnline.value + customGroupOffline.value + record.value + restDay.value);

            // error message
            showErrorMessage(e)

        } else if (widgetProps.id === "root_ptoffline") {
            customPTOffline.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + customPTOnline.value + customGroupOnline.value + customGroupOffline.value + record.value + restDay.value);

            // error message
            showErrorMessage(e)

        } else if (widgetProps.id === "root_grouponline") {
            customGroupOnline.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + customPTOnline.value + customPTOffline.value + customGroupOffline.value + record.value + restDay.value);

            // error message
            showErrorMessage(e)

        } else if (widgetProps.id === "root_groupoffline") {
            customGroupOffline.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + customPTOnline.value + customPTOffline.value + customGroupOnline.value + record.value + restDay.value);

            // error message
            showErrorMessage(e)

        } else if (widgetProps.id === "root_recordedclasses") {
           record.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + customPTOnline.value + customPTOffline.value + customGroupOffline.value + customGroupOnline.value + restDay.value);

            // error message
            showErrorMessage(e)

        }

    }

    const handleChange = (e: { target: { value: string; }; }, widgetProps: { onChange: (arg0: number) => void; }) => {
        handleValidation(e)
        widgetProps.onChange(parseInt(e.target.value));
    }


    return (
        <div className="d-flex justify-content-center aligns-items-center">
            {widgetProps.schema.title === 'Online' ?
                widgetProps.id === "root_ptonline" ?
                    <img src={`/assets/${packageTypeName}personal-training-online.svg`} alt='123' title={`${packageTypeName} personal training online`} />
                    : <img src={`/assets/${packageTypeName}group-online.svg`} alt='123' title={`${packageTypeName} group online`} />
                : ""
            }
            {widgetProps.schema.title === 'Offline' ?
                widgetProps.id === "root_ptoffline" ?
                    <img src={`/assets/${packageTypeName}personal-training-offline.svg`} alt='123' title={`${packageTypeName} personal training offline`} />
                    : <img src={`/assets/${packageTypeName}group-offline.svg`} alt='123' title={`${packageTypeName} group offline`} />
                : ""
            }
            {widgetProps.schema.title === 'Recorded' ?
                <img src={`/assets/${packageTypeName}classic.svg`} alt='123' title={`${packageTypeName} classic`} /> : ""
            }


          
                <Form.Control
                    className='text-center'
                    width="100%"
                    disabled={actionType === "view" ? true : false}
                    value={widgetProps.value && widgetProps.value}
                    ref={dayAvailableRef}
                    pattern="[0-9]+"
                    onChange={(e: { target: { value: string; }; }) => handleChange(e, widgetProps)}
                    type="number"
                    min="0"
                    max="30"
                />
         


        </div>
    )
}
