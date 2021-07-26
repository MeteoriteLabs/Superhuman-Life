import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';


export default function ModalCustomClasses(props) {

    const { PTProps, widgetProps, actionType, packageTypeName, classicProps } = props;

    const [dayAvaliable, setDayAvaliable] = useState<number | null>()
    const dayAvailableRef = useRef<any>(null)

    console.log('widgetProps', widgetProps)
    console.log('packageTypeName', packageTypeName)
    console.log('classicProps', classicProps)
    // console.log("dayAvailable", dayAvaliable);
    // console.log("dayAvailableProps", PTProps.properties.dayAvailable.value);



    const handleChange = (e: any) => {
   
        const classicAvailable = classicProps.properties.duration.value - e.target.value;
        classicProps.properties.restdays.maximum = classicAvailable;
        console.log('classicAvailable', classicAvailable)


        if (packageTypeName !== "classic") {
            dayAvailableRef.current = 30
            //    console.log('ref', dayAvailableRef.current);
            if (widgetProps.label === 'Online') {
                PTProps.properties.onlineClasses.value = parseInt(e.target.value);
                // dayAvailableRef.current -=  PTProps.properties.onlineClasses.value 
            }
            else if (widgetProps.label === 'Offline') {
                PTProps.properties.offlineClasses.value = parseInt(e.target.value);
                // dayAvailableRef.current -=   PTProps.properties.offlineClasses.value
            }

            dayAvailableRef.current -= (PTProps.properties.onlineClasses.value + PTProps.properties.offlineClasses.value + PTProps.properties.restDay.value)
            console.log('ref', dayAvailableRef.current);

            if (dayAvailableRef.current === 0) {
                widgetProps.schema.maximum = 30
                console.log(' widgetProps.schema.maximum', widgetProps.schema.maximum)
            } else if (dayAvailableRef.current < 0) {
                widgetProps.schema.maximum = 0
            }

        }

        PTProps.properties.dayAvailable.value = dayAvailableRef.current
        widgetProps.onChange(parseInt(e.target.value));
        setDayAvaliable(dayAvailableRef.current)
    }



    return (

        <div className='text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
            <div className={packageTypeName !== "classic" ? "d-block" : "d-none"}>
                {widgetProps.schema.title === 'Online' ?
                    <img src={`/assets/${packageTypeName}-Online.svg`} alt='123' /> : <img src={`/assets/${packageTypeName}-Offline.svg`} alt='123' />
                }
            </div>
            <div className={packageTypeName === "classic" ? "d-block" : "d-none"}>
                <img src={`/assets/${packageTypeName}.svg`} alt='123' />
            </div>
            <label className='d-block font-weight-bold mb-0 mr-3' >{widgetProps.schema.title}</label>
            <input
                className="py-2 px-2"
                disabled={actionType === "view" ? true : false}
                value={widgetProps.value && widgetProps.value}
                ref={dayAvailableRef}
                pattern="[0-9]+"
                onChange={(e: any) => handleChange(e)}
                type="number"
                min="0"
                max="30"
            />
        </div>

    )
}
