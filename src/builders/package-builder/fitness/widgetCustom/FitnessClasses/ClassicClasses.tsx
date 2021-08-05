import React from 'react'
import { useRef, useState } from 'react';


export default function ClassicClasses({ widgetProps, classicProps:{properties}, actionType, packageTypeName }) {

    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)
    const {recordedclasses, duration, restdays} = properties 

    // classic
    const handleValidation = (e: { target: { value: string; }; }) => {
        dayAvailableRef.current = duration.value;

       recordedclasses.value = parseInt(e.target.value);

        dayAvailableRef.current -= recordedclasses.value

        restdays.maximum = dayAvailableRef.current;
        setDayAvaliable(dayAvailableRef.current)
        console.log('current', dayAvailableRef.current)
    }


    const handleChange = (e: { target: any; }, widgetProps: { onChange: (arg0: number) => void; }) => {
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
                onChange={(e:{ target: { value: string; };}) => handleChange(e, widgetProps.widgetProps)}
                type="number"
                min="0"
                max="30"
            />
        </div>

    )
}
