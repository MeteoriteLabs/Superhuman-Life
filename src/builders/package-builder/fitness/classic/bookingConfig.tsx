import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

const BookingConfig = (props: any) => {
    const inputDisabled = props.uiSchema.readonly
    const [config, setConfig] = useState(
        props.value !== undefined ? JSON.parse(props.value).config : ''
    )

    function handleValidation() {
        if (config !== '') {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (handleValidation()) {
            props.onChange(JSON.stringify({ config: config }))
        } else {
            props.onChange(undefined)
        }
        //eslint-disable-next-line
    }, [config])

    return (
        <>
            <div>
                <Form.Check
                    inline
                    label="Manual"
                    value={'Manual'}
                    disabled={inputDisabled}
                    defaultChecked={config === 'Manual' ? true : false}
                    onClick={(e: any) => setConfig(e.target.value)}
                    name="group1"
                    type="radio"
                    id={`inline-1`}
                />
                <Form.Check
                    inline
                    label="Auto"
                    value={'Auto'}
                    disabled={inputDisabled}
                    defaultChecked={config === 'Auto' ? true : false}
                    onClick={(e: any) => setConfig(e.target.value)}
                    name="group1"
                    type="radio"
                    id={`inline-2`}
                />
                <Form.Text className="text-muted">
                    In auto it will automatically accept all bookings
                </Form.Text>
            </div>
        </>
    )
}

export default BookingConfig
