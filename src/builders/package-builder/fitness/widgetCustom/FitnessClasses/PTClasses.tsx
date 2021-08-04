import React from 'react'
import { useRef, useState } from 'react';




export default function PTClasses({ widgetProps, packageTypeName, PTProps, actionType, userData }) {
    console.log("🚀 ~ file: PTClasses.tsx ~ line 8 ~ PTClasses ~ userData", userData)
    console.log("🚀 ~ file: PTClasses.tsx ~ line 8 ~ PTClasses ~ PTProps", PTProps)
    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)




  

    if (userData.ptonline) {
        PTProps.properties.ptonlineClasses.value = userData.ptonline
    }

    if (userData.ptoffline) {
        PTProps.properties.ptofflineClasses.value = userData.ptoffline
    }

    const handleValidation = (e, widgetProps) => {


        dayAvailableRef.current = PTProps.properties.duration.value


        if (widgetProps.label === 'Online') {
            PTProps.properties.ptonlineClasses.value = parseInt(e.target.value);
        }
        else if (widgetProps.label === 'Offline') {
            PTProps.properties.ptofflineClasses.value = parseInt(e.target.value);
        }


        dayAvailableRef.current -= (PTProps.properties.ptonlineClasses.value + PTProps.properties.ptofflineClasses.value + PTProps.properties.restDay.value)

        console.log('ref', dayAvailableRef.current);

        if (dayAvailableRef.current < 0) {
            widgetProps.schema.maximum = dayAvailableRef.current
        } else if (dayAvailableRef.current === 0) {
            widgetProps.schema.maximum = 30
        }

        PTProps.properties.restDay.maximum = dayAvailableRef.current;
        // PTProps.properties.dayAvailable.value = dayAvailableRef.current

        // setDayAvaliable(dayAvailableRef.current)
    }

    const handleChange = (e: any, widgetProps) => {

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
                onChange={(e: any) => handleChange(e, widgetProps)}
                type="number"
                min="0"
                max="30"
            />

            {PTProps.properties.duration.value === 1 ?
                <div className='ml-3 mt-1'>
                    <i style={{ color: "gray", fontSize: '0.9rem' }}>*** This field can only set to be 1</i>
                </div> : ""
            }

        </div>



    )
}
