import React, { useEffect } from 'react'
import { useRef } from 'react';
import { useState } from 'react';


export default function ModalCustomClasses(props) {

    const { PTProps, widgetProps, actionType, packageTypeName, classicProps, groupProps } = props;

    const [dayAvaliable, setDayAvaliable] = useState<number | null>();
    const dayAvailableRef = useRef<any>(null)



    console.log('widgetProps', widgetProps)
    console.log('packageTypeName', packageTypeName)
    console.log('classicProps', classicProps)
    console.log('pt props', PTProps)
    // console.log("dayAvailable", dayAvaliable);
    // console.log("dayAvailableProps", PTProps.properties.dayAvailable.value);



    const handleChange = (e: any) => {

        if (packageTypeName !== "classic") {
            dayAvailableRef.current = 30
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

            dayAvailableRef.current -= (PTProps.properties.ptonlineClasses.value + PTProps.properties.ptofflineClasses.value + groupProps.properties.grouponlineClasses.value + groupProps.properties.groupofflineClasses.value + PTProps.properties.restDay.value)
            console.log('ref', dayAvailableRef.current);

            if (dayAvailableRef.current === 0) {
                widgetProps.schema.maximum = 30
                console.log(' widgetProps.schema.maximum', widgetProps.schema.maximum)
            } else if (dayAvailableRef.current < 0) {
                widgetProps.schema.maximum = 0
            }

            PTProps.properties.restDay.maximum = dayAvailableRef.current;

        } else {
            const classicAvailable = classicProps.properties.duration.value - e.target.value;
            classicProps.properties.restdays.maximum = classicAvailable;
            console.log('classicAvailable', classicAvailable)
        }

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
                            <img src={`/assets/${packageTypeName}-online.svg`} alt='123' /> : <img src={`/assets/${packageTypeName}-offline.svg`} alt='123' />
                        }
                    </div>

                    <div className={packageTypeName === "classic" ? "d-block" : "d-none"}>
                        <img src={`/assets/${packageTypeName}.svg`} alt='123' />
                    </div>
                </div>
                :

                <div>
                    <div >
                        {widgetProps.schema.title === 'Online' ?
                            widgetProps.id === "root_ptonline" ? <img src={`/assets/${packageTypeName}personal-training-online.svg`} alt='123' /> : <img src={`/assets/${packageTypeName}group-online.svg`} alt='123' />
                            : ""
                        }
                        {widgetProps.schema.title === 'Offline' ?
                            widgetProps.id === "root_ptoffline" ? <img src={`/assets/${packageTypeName}personal-training-offline.svg`} alt='123' /> : <img src={`/assets/${packageTypeName}group-offline.svg`} alt='123' />
                            : ""
                        }
                        {widgetProps.schema.title === 'Recorded' ?
                            <img src={`/assets/${packageTypeName}classic.svg`} alt='123' /> : ""
                        }

                    </div>


                    {/* <div>
                    </div> */}
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
