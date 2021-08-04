import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';

export default function CustomClasses({ customProps, widgetProps, packageTypeName, actionType }) {



    const [dayAvaliable, setDayAvaliable] = useState<number | null>(30);
    const dayAvailableRef = useRef<any>(null)



    const countingAvailableDays = (dayAvailableRef: number, ptonlineValue: number, ptofflineValue: number, grouponlineValue: number, groupofflineValue: number, recordValue: number, restdayValue: number) => {

        dayAvailableRef -= (ptonlineValue + ptofflineValue + grouponlineValue + groupofflineValue + recordValue + restdayValue);

        if (dayAvailableRef === 0) {
            widgetProps.schema.maximum = 30
        } else if (dayAvailableRef < 0) {
            widgetProps.schema.maximum = 0
        }
        return dayAvailableRef
    }






    const handleValidation = (e, customProps) => {
        dayAvailableRef.current = customProps.properties.duration.value
        if (widgetProps.id === "root_ptonline") {
            customProps.properties.customPTOnline.value = parseInt(e.target.value);

        } else if (widgetProps.id === "root_ptoffline") {
            customProps.properties.customPTOffline.value = parseInt(e.target.value);

        } else if (widgetProps.id === "root_grouponline") {
            customProps.properties.customGroupOnline.value = parseInt(e.target.value);

        } else if (widgetProps.id === "root_groupoffline") {
            customProps.properties.customGroupOffline.value = parseInt(e.target.value);

        } else if (widgetProps.id === "root_recordedclasses") {
            customProps.properties.record.value = parseInt(e.target.value);

        }

        dayAvailableRef.current = countingAvailableDays(dayAvailableRef.current, customProps.properties.customPTOnline.value, customProps.properties.customPTOffline.value, customProps.properties.customGroupOnline.value, customProps.properties.customGroupOffline.value, customProps.properties.record.value, customProps.properties.restDay.value)


        customProps.properties.restDay.maximum = dayAvailableRef.current;

        setDayAvaliable(dayAvailableRef.current)
    }

    const handleChange = (e: any, widgetProps) => {
        handleValidation(e, customProps)
        widgetProps.onChange(parseInt(e.target.value));
    }


    return (
        <div>

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
