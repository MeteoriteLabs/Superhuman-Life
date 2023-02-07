import { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap';

export default function FitnessRestday(props: any) {
    const { PTProps, widgetProps, actionType, groupProps, customProps, userData, type } = props;
    const dayAvailableRef = useRef<any>(null)

    useEffect(() => {
        if (userData.restdays) {
            PTProps.properties.restDay.value = userData.restdays
            groupProps.properties.restDay.value = userData.restdays
            customProps.properties.restDay.value = userData.restdays
        }
    })

    const handeValidation = (e: { target: { value: string; }; }) => {

        PTProps.properties.restDay.value = parseInt(e.target.value);
        groupProps.properties.restDay.value = parseInt(e.target.value)
        customProps.properties.restDay.value = parseInt(e.target.value)

        if (type === "One-On-One") {
            dayAvailableRef.current = PTProps.properties.duration.value - (PTProps.properties.ptonlineClasses.value + PTProps.properties.ptofflineClasses.value + PTProps.properties.restDay.value);
        }

        if (type === "Group Class") {
            dayAvailableRef.current = groupProps.properties.duration.value - (groupProps.properties.grouponlineClasses.value + groupProps.properties.groupofflineClasses.value + groupProps.properties.restDay.value);
        }

        if (type === "Custom Fitness") {
            dayAvailableRef.current = customProps.properties.duration.value - (customProps.properties.customPTOnline.value + customProps.properties.customPTOffline.value + customProps.properties.customGroupOnline.value + customProps.properties.customGroupOffline.value + customProps.properties.record.value + customProps.properties.restDay.value);
        }

        if (dayAvailableRef.current < 0) {
            widgetProps.schema.maximum = 0
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = `should be <= ${parseInt(e.target.value) - (dayAvailableRef.current * -1)}`
            }
        } else if (dayAvailableRef.current < PTProps.properties.duration.value || dayAvailableRef.current === 30) {
            widgetProps.schema.maximum = 30
            if (widgetProps.rawErrors) {
                widgetProps.rawErrors[0] = ""
            }
        }
    }

    const handleOnchange = (e) => {
        handeValidation(e)
        widgetProps.onChange(parseInt(e.target.value))
    }

    return <div className=' text-center text-black py-3 w-25 d-flex justify-content-start align-items-center' >
        <img src="/assets/rest-icon.svg" alt='123' />
        <label className='d-block font-weight-bold mb-0 mr-3'>{widgetProps.label}</label>

        <Form.Control
            required
            className='text-center w-50'
            ref={dayAvailableRef}
            disabled={(actionType === "view") ? true : false}
            value={widgetProps.value ? widgetProps.value : ""}
            pattern="[0-9]+"
            onChange={(e: { target: { value: string; }; }) => handleOnchange(e)}
            type="number"
            min="0"
            max="30"
        />

    </div>
}
