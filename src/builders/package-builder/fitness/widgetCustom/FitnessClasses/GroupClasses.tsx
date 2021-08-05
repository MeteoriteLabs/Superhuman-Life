import React, { useRef, useState, useEffect } from 'react'


export default function GroupClasses({ widgetProps, packageTypeName, groupProps: { properties }, actionType, userData }) {
    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)

    const { grouponlineClasses, groupofflineClasses, restDay, duration } = properties
    useEffect(() => {

        if (userData.grouponline) {
            grouponlineClasses.value = userData.grouponline
        }

        if (userData.groupoffline) {
            groupofflineClasses.value = userData.groupoffline
        }
        if (userData.restDay) {
            restDay.value = userData.restdays
        }

    }, [])





    const showErrorMessage = (e: { target: any; }) => {
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

    const handleValidationFor30Day = (e: { target: any; }, widgetProps: { onChange?: (arg0: number) => void; label?: any; }) => {
        // online
        if (widgetProps.label === 'Online') {
            grouponlineClasses.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + groupofflineClasses.value + restDay.value);
            console.log('ref', dayAvailableRef.current);

            // error message
            showErrorMessage(e)


            // offline
        } else if (widgetProps.label === 'Offline') {
            groupofflineClasses.value = parseInt(e.target.value);

            dayAvailableRef.current -= (parseInt(e.target.value) + grouponlineClasses.value + restDay.value);
            console.log('ref', dayAvailableRef.current);
            // widgetProps.schema.maximum = 0

            // error message
            showErrorMessage(e)
        }

    }



    const handleValidation = (e: { target: any; }, widgetProps: { onChange: (arg0: number) => void; }) => {
        dayAvailableRef.current = duration.value
        handleValidationFor30Day(e, widgetProps)

    }



    const handleChange = (e: { target: any; }, widgetProps: { onChange: (arg0: number) => void; }) => {
        handleValidation(e, widgetProps)
        widgetProps.onChange(parseInt(e.target.value));
    }


    return (
        <div>
            {widgetProps.schema.title === 'Online' ?
                <img src={`/assets/${packageTypeName}-online.svg`} alt={packageTypeName} title={`${packageTypeName} online`} />
                :
                <img src={`/assets/${packageTypeName}-offline.svg`} alt='123' title={`${packageTypeName} offline`} />
            }


            <input
                className="py-2 px-2"
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
