
import { useRef } from 'react';
import { Form } from 'react-bootstrap';


export default function ClassicClasses({ widgetProps, classicProps: { properties }, actionType, packageTypeName }) {

    const dayAvailableRef = useRef<any>(null)
    const { recordedclasses, duration, restdays } = properties

    // classic
    const handleValidation = (e: { target: { value: string; }; }) => {
        dayAvailableRef.current = duration.value;

        recordedclasses.value = parseInt(e.target.value);

        dayAvailableRef.current -= recordedclasses.value

        restdays.maximum = dayAvailableRef.current;
    
    }


    const handleChange = (e: { target: any; }, widgetProps: { onChange: (arg0: number) => void; }) => {
        handleValidation(e)
        widgetProps.onChange(parseInt(e.target.value));
    }


    return (
        <div className="d-flex justify-content-center aligns-items-center">
            <img src={`/assets/${packageTypeName}.svg`} alt='123' title={`${packageTypeName}`} />
            <Form>
                <Form.Control
                   className='text-center'
                    disabled={actionType === "view" ? true : false}
                    value={widgetProps.widgetProps.value && widgetProps.widgetProps.value}
                    ref={dayAvailableRef}
                    pattern="[0-9]+"
                    onChange={(e: { target: { value: string; }; }) => handleChange(e, widgetProps.widgetProps)}
                    type="number"
                    min="0"
                    max="30"
                />
            </Form>
        </div>

    )
}
