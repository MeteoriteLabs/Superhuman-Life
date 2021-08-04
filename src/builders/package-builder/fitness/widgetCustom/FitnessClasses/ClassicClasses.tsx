import React from 'react'
import { useRef, useState } from 'react';


export default function ClassicClasses({ widgetProps, classicProps, actionType, packageTypeName }) {

    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)


    // classic
    const handleValidation = (e) => {
        dayAvailableRef.current = classicProps.properties.duration.value;

        classicProps.properties.recordedclasses.value = parseInt(e.target.value);

        dayAvailableRef.current -= classicProps.properties.recordedclasses.value

        classicProps.properties.restdays.maximum = dayAvailableRef.current;
        setDayAvaliable(dayAvailableRef.current)
        console.log('current', dayAvailableRef.current)
    }


    const handleChange = (e: any, widgetProps) => {

        handleValidation(e)

        widgetProps.onChange(parseInt(e.target.value));
    }


    return (
        <div>

            <img src={`/assets/${packageTypeName}.svg`} alt='123' title={`${packageTypeName}`} />

            <input
                className="py-2 px-2"
                disabled={actionType === "view" ? true : false}
                value={widgetProps.widgetProps.value && widgetProps.widgetProps.value}
                ref={dayAvailableRef}
                pattern="[0-9]+"
                onChange={(e: any) => handleChange(e, widgetProps.widgetProps)}
                type="number"
                min="0"
                max="30"
            />
        </div>

    )
}
