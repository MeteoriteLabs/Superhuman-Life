import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';

export default function GroupClasses({ widgetProps, packageTypeName, groupProps, actionType, userData }) {
    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)
 


    if (userData.grouponline) {
        groupProps.properties.grouponlineClasses.value = userData.grouponline
    }

    if (userData.groupoffline) {
        groupProps.properties.groupofflineClasses.value = userData.groupoffline
    }

    console.log(groupProps)

    const handleValidation = (e) => {

        dayAvailableRef.current = groupProps.properties.duration.value

      
        if (widgetProps.label === 'Online') {
            groupProps.properties.grouponlineClasses.value = parseInt(e.target.value);
        }
        else if (widgetProps.label === 'Offline') {
            groupProps.properties.groupofflineClasses.value = parseInt(e.target.value);
        }


        dayAvailableRef.current -= (groupProps.properties.grouponlineClasses.value +  groupProps.properties.groupofflineClasses.value + groupProps.properties.restDay.value)

        groupProps.properties.restDay.maximum = dayAvailableRef.current;
        // groupProps.properties.dayAvailable.value = dayAvailableRef.current
        setDayAvaliable(dayAvailableRef.current)

        console.log('ref', dayAvailableRef.current);
        if(dayAvailableRef.current < 0){
            widgetProps.schema.maximum =  dayAvailableRef.current
        }else{
            widgetProps.schema.maximum  = 30
        }

        // groupProps.properties.restDay.maximum = dayAvailableRef.current;

    }
    

    const handleChange = (e: any, widgetProps) => {
        handleValidation(e)
      

        // widgetProps.onChange(parseInt(e.target.value));
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
        </div>



    )
}
