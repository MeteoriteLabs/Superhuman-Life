import React, { useEffect } from 'react'
import { useRef } from 'react';
import { useState } from 'react';


export default function ModalCustomClasses(props) {

    const { PTProps, widgetProps, actionType, packageTypeName, classicProps, groupProps, recordedProps, customProps } = props;

    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)



    console.log('widgetProps', widgetProps)
    console.log('packageTypeName', packageTypeName)



    // console.log("dayAvailable", dayAvaliable);
    // console.log("dayAvailableProps", PTProps.properties.dayAvailable.value);

    const countingAvailableDays = (dayAvailableRef: number, ptonlineValue: number, ptofflineValue: number, grouponlineValue: number, groupofflineValue: number, recordValue:number, restdayValue: number) => {
        dayAvailableRef -= (ptonlineValue + ptofflineValue + grouponlineValue + groupofflineValue + recordValue +  restdayValue);

        if (dayAvailableRef === 0) {
            widgetProps.schema.maximum = 30
            console.log(' widgetProps.schema.maximum', widgetProps.schema.maximum)
        } else if (dayAvailableRef < 0) {
            widgetProps.schema.maximum = 0
        }
        return dayAvailableRef
    }

    // pt group
    const handlePTGroupInputValue = (e) => {
        console.log('pt props', PTProps);
        console.log('group props', groupProps);
        dayAvailableRef.current = PTProps.properties.duration.default
        //    console.log('ref', dayAvailableRef.current);
        if (packageTypeName === "personal-training") {
            if (widgetProps.label === 'Online') {
                PTProps.properties.ptonlineClasses.value = parseInt(e.target.value);
            }
            else if (widgetProps.label === 'Offline') {
                PTProps.properties.ptofflineClasses.value = parseInt(e.target.value);
            }
        } else if (packageTypeName === "group") {
            if (widgetProps.label === 'Online') {
                groupProps.properties.grouponlineClasses.value = parseInt(e.target.value);
            }
            else if (widgetProps.label === 'Offline') {
                groupProps.properties.groupofflineClasses.value = parseInt(e.target.value);
            }
        }

        dayAvailableRef.current = countingAvailableDays(dayAvailableRef.current, PTProps.properties.ptonlineClasses.value, PTProps.properties.ptofflineClasses.value, groupProps.properties.grouponlineClasses.value, groupProps.properties.groupofflineClasses.value,  customProps.properties.record.value ,PTProps.properties.restDay.value)

        console.log('ref', dayAvailableRef.current);

    }


    
    // custom
    const handleCustomInputValue = (e) => {
        console.log('custom', customProps)
        dayAvailableRef.current = PTProps.properties.duration.default
        if (widgetProps.id === "root_ptonline") {
            customProps.properties.ptonlineClasses.value = parseInt(e.target.value);
        } else if (widgetProps.id === "root_ptoffline") {
            customProps.properties.ptofflineClasses.value = parseInt(e.target.value);
        } else if (widgetProps.id === "root_grouponline") {
            customProps.properties.grouponlineClasses.value = parseInt(e.target.value);
        } else if (widgetProps.id === "root_groupoffline") {
            customProps.properties.groupofflineClasses.value = parseInt(e.target.value);
        } else if (widgetProps.id === "root_recordedclasses") {
            customProps.properties.record.value = parseInt(e.target.value);
        }

        dayAvailableRef.current = countingAvailableDays(dayAvailableRef.current,customProps.properties.ptonlineClasses.value, customProps.properties.ptofflineClasses.value, customProps.properties.grouponlineClasses.value, customProps.properties.groupofflineClasses.value, customProps.properties.record.value, PTProps.properties.restDay.value)
      
        console.log('ref', dayAvailableRef.current);
    }



    // classic
    const handleClassicInputValue = (e) => {
        console.log('classicProps', classicProps)
        const classicAvailable = classicProps.properties.duration.value - e.target.value;
        classicProps.properties.restdays.maximum = classicAvailable;
        console.log('classicAvailable', classicAvailable)
    }




    const handleChange = (e: any) => {
        if (packageTypeName !== "classic" && packageTypeName !== "custom") {
            handlePTGroupInputValue(e)
        } else if (packageTypeName === "custom") {
            handleCustomInputValue(e)
        } else {
            handleClassicInputValue(e)
        }

        PTProps.properties.restDay.maximum = dayAvailableRef.current;
        PTProps.properties.dayAvailable.value = dayAvailableRef.current
        widgetProps.onChange(parseInt(e.target.value));
        setDayAvaliable(dayAvailableRef.current)
    }



    return (

        <div className='text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
            {packageTypeName !== "custom" ?
                <div>
                    <div className={packageTypeName !== "classic" ? "d-block" : "d-none"}>
                        {widgetProps.schema.title === 'Online' ?
                            <img src={`/assets/${packageTypeName}-online.svg`} alt={packageTypeName} title={`${packageTypeName} online`} /> : <img src={`/assets/${packageTypeName}-offline.svg`} alt='123' title={`${packageTypeName} offline`} />
                        }
                    </div>

                    <div className={packageTypeName === "classic" ? "d-block" : "d-none"}>
                        <img src={`/assets/${packageTypeName}.svg`} alt='123' title={`${packageTypeName}`} />
                    </div>
                </div>
                :

                <div>
                    <div >
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

                    </div>
                </div>
            }


            {/* <div className={packageTypeName === "classic" ? "d-block" : "d-none"}>
                <img src={`/assets/${packageTypeName}classic.svg`} alt='123' />
            </div> */}

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
