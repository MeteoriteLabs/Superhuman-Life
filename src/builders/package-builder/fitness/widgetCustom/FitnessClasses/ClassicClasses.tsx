import React, { useRef } from 'react'
import { Form } from 'react-bootstrap'

interface Properties {
    recordedclasses: any
    duration: any
    restdays: any
}

interface Props {
    widgetProps: any
    classicProps: Properties
    actionType: string
    packageTypeName: string | null
}

const ClassicClasses: React.FC<Props> = (props) => {
    const dayAvailableRef = useRef<any>(null)

    // classic
    const handleValidation = (e: { target: { value: string } }) => {
        dayAvailableRef.current = props.classicProps.duration.value
        props.classicProps.recordedclasses.value = parseInt(e.target.value)
        dayAvailableRef.current -= props.classicProps.recordedclasses.value
        props.classicProps.restdays.maximum = dayAvailableRef.current
    }

    const handleChange = (
        e: { target: any },
        widgetProps: { onChange: (arg0: number) => void }
    ) => {
        handleValidation(e)
        widgetProps.onChange(parseInt(e.target.value))
    }

    return (
        <div className="d-flex justify-content-center aligns-items-center">
            <img
                src={`/assets/${props.packageTypeName}.svg`}
                alt="123"
                title={`${props.packageTypeName}`}
            />

            <Form.Control
                className="text-center"
                disabled={props.actionType === 'view' ? true : false}
                value={props.widgetProps.widgetProps.value && props.widgetProps.widgetProps.value}
                ref={dayAvailableRef}
                pattern="[0-9]+"
                onChange={(e: { target: { value: string } }) =>
                    handleChange(e, props.widgetProps.widgetProps)
                }
                type="number"
                min="0"
                max="30"
            />
        </div>
    )
}

export default ClassicClasses
