import React, { useEffect } from 'react'
import { useRef } from 'react'
import { Form } from 'react-bootstrap'

interface Properties {
    customPTOnline: any
    customPTOffline: any
    customGroupOnline: any
    customGroupOffline: any
    record: any
    restDay: any
    duration: any
}
const CustomClasses: React.FC<{
    customProps: Properties
    widgetProps: any
    packageTypeName: any
    actionType: any
    userData: any
}> = (props) => {
    const dayAvailableRef = useRef<any>(null)

    useEffect(() => {
        const setValue = () => {
            if (props.userData.ptonline) {
                props.userData.customPTOnline.value = props.userData.ptonline
            }

            if (props.userData.ptoffline) {
                props.userData.customPTOffline.value = props.userData.ptoffline
            }

            if (props.userData.grouponline) {
                props.userData.customGroupOnline.value = props.userData.grouponline
            }

            if (props.userData.groupoffline) {
                props.userData.customGroupOffline.value = props.userData.groupoffline
            }
            if (props.userData.recordedclasses) {
                props.userData.record.value = props.userData.recordedclasses
            }
            if (props.userData.restDay) {
                props.userData.restDay.value = props.userData.restdays
            }
        }
        setValue()
    })

    const showErrorMessage = (e: { target: { value: string } }) => {
        if (dayAvailableRef.current < 0) {
            props.widgetProps.schema.maximum = 0
            if (props.widgetProps.rawErrors) {
                props.widgetProps.rawErrors[0] = `should be <= ${
                    parseInt(e.target.value) - dayAvailableRef.current * -1
                }`
            }
        } else if (dayAvailableRef.current >= 0) {
            props.widgetProps.schema.maximum = 30
            if (props.widgetProps.rawErrors) {
                props.widgetProps.rawErrors[0] = ''
            }
        }
    }

    const handleValidation = (e: { target: { value: string } }) => {
        dayAvailableRef.current = props.userData.duration.value
        if (props.userData.widgetProps.id === 'root_ptonline') {
            props.userData.customPTOnline.value = parseInt(e.target.value)

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.userData.customPTOffline.value +
                props.userData.customGroupOnline.value +
                props.userData.customGroupOffline.value +
                props.userData.record.value +
                props.userData.restDay.value

            // error message
            showErrorMessage(e)
        } else if (props.widgetProps.id === 'root_ptoffline') {
            props.userData.customPTOffline.value = parseInt(e.target.value)

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.userData.customPTOnline.value +
                props.userData.customGroupOnline.value +
                props.userData.customGroupOffline.value +
                props.userData.record.value +
                props.userData.restDay.value

            // error message
            showErrorMessage(e)
        } else if (props.widgetProps.id === 'root_grouponline') {
            props.userData.customGroupOnline.value = parseInt(e.target.value)

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.userData.customPTOnline.value +
                props.userData.customPTOffline.value +
                props.userData.customGroupOffline.value +
                props.userData.record.value +
                props.userData.restDay.value

            // error message
            showErrorMessage(e)
        } else if (props.widgetProps.id === 'root_groupoffline') {
            props.userData.customGroupOffline.value = parseInt(e.target.value)

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.userData.customPTOnline.value +
                props.userData.customPTOffline.value +
                props.userData.customGroupOnline.value +
                props.userData.record.value +
                props.userData.restDay.value

            // error message
            showErrorMessage(e)
        } else if (props.widgetProps.id === 'root_recordedclasses') {
            props.userData.record.value = parseInt(e.target.value)

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.userData.customPTOnline.value +
                props.userData.customPTOffline.value +
                props.userData.customGroupOffline.value +
                props.userData.customGroupOnline.value +
                props.userData.restDay.value

            // error message
            showErrorMessage(e)
        }
    }

    const handleChange = (
        e: { target: { value: string } },
        widgetProps: { onChange: (arg0: number) => void }
    ) => {
        handleValidation(e)
        widgetProps.onChange(parseInt(e.target.value))
    }

    return (
        <div className="d-flex justify-content-center aligns-items-center">
            {props.widgetProps.schema.title === 'Online' ? (
                props.widgetProps.id === 'root_ptonline' ? (
                    <img
                        src={`/assets/${props.packageTypeName}personal-training-online.svg`}
                        alt="123"
                        title={`${props.packageTypeName} personal training online`}
                    />
                ) : (
                    <img
                        src={`/assets/${props.packageTypeName}group-online.svg`}
                        alt="123"
                        title={`${props.packageTypeName} group online`}
                    />
                )
            ) : (
                ''
            )}
            {props.widgetProps.schema.title === 'Offline' ? (
                props.widgetProps.id === 'root_ptoffline' ? (
                    <img
                        src={`/assets/${props.packageTypeName}personal-training-offline.svg`}
                        alt="123"
                        title={`${props.packageTypeName} personal training offline`}
                    />
                ) : (
                    <img
                        src={`/assets/${props.packageTypeName}group-offline.svg`}
                        alt="123"
                        title={`${props.packageTypeName} group offline`}
                    />
                )
            ) : (
                ''
            )}
            {props.widgetProps.schema.title === 'Recorded' ? (
                <img
                    src={`/assets/${props.packageTypeName}classic.svg`}
                    alt="123"
                    title={`${props.packageTypeName} classic`}
                />
            ) : (
                ''
            )}

            <Form.Control
                className="text-center"
                width="100%"
                disabled={props.actionType === 'view' ? true : false}
                value={props.widgetProps.value && props.widgetProps.value}
                ref={dayAvailableRef}
                pattern="[0-9]+"
                onChange={(e: { target: { value: string } }) => handleChange(e, props.widgetProps)}
                type="number"
                min="0"
                max="30"
            />
        </div>
    )
}

export default CustomClasses
