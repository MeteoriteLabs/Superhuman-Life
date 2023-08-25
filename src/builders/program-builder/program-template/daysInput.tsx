import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import moment from 'moment';

const DaysInput = (props: any) => {

    function handleReturnType(value: any) {
        if (typeof value === 'number') {
            return [`Day - ${value}`];
        }
        if (typeof value !== 'string') {
            if (value.length > 0) {
                return value;
            }
        } else {
            return JSON.parse(value);
        }
    }

    const [selected, setSelected]: any[] = useState(
        props.dayType === 'day' && props.val
            ? handleReturnType(props.val)
            : props.val
            ? handleReturnType(props.val)
            : []
    );
    //add this in the above line incase of error in the first arr moment(props.startDate).add(props.val, 'days').format("Do, MMM YY")
    const days: any[] = [];

    function renderInputField() {
        if (props?.dayType === 'day') {
            for (let i = 0; i < props?.duration; i++) {
                days.push({ key: i + 1, day: `Day - ${i + 1}` });
            }
        } else {
            for (let j = 0; j < props?.duration; j++) {
                days.push({
                    key: j + 1,
                    value: `${moment(props?.startDate).add(j, 'days').format('YYYY-MM-DD')}`,
                    day: `${moment(props?.startDate).add(j, 'days').format('Do, MMM YY')}`
                });
            }
        }
    }

    function OnChange(e) {
        const objectToString = JSON.stringify(e);
        props.onChange(objectToString);
        setSelected(e);
    }

    renderInputField();

    return (
        <>
            <div style={{zIndex: 999, height: "150px"}}>
                {props.type === 'transfer' ? null : <label>Select Day</label>}
                <Typeahead
                    id="basic-typeahead-multiple"
                    clearButton={
                        props.id
                            ? props.id === 'newWorkout' || props.id === 'duplicateWorkout'
                                ? true
                                : false
                            : false
                    }
                    labelKey="day"
                    onChange={OnChange}
                    options={days}
                    placeholder={
                        props.id
                            ? props.id === 'newWorkout' || props.id === 'duplicateWorkout'
                                ? 'Choose a day...'
                                : 'Choose days...'
                            : 'Choose days...'
                    }
                    selected={selected}
                    multiple={
                        props.id
                            ? props.id === 'newWorkout' || props.id === 'duplicateWorkout'
                                ? false
                                : true
                            : true
                    }
                />
            </div>
        </>
    );
};

export default DaysInput;
