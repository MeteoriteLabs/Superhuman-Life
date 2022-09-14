import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import moment from 'moment';

const DaysInput = (props: any) => {

     console.log(props);

     function handleReturnType(value: any){
          console.log(value.length);
          if(typeof value === 'number'){
               return [`Day - ${value}`];
          }else if(value.length > 0 && typeof value !== 'string'){
               return value;
          }else {
               return JSON.parse(value)
          }
     }

     const [selected, setSelected]: any[] = useState(props.dayType === "day" && props.val ? handleReturnType(props.val)  : props.val ? [moment(props.startDate).add(props.val, 'days').format("Do, MMM YY")] : []);

     const days: any[] = [];

     function renderInputField() {
          if(props?.dayType === 'day') {
               for (var i=0; i<props?.duration;i++){
                    days.push({"key": i+1,"day": `Day - ${i+1}`})
               }
          }else {
               for (var j=0; j<props?.duration;j++){
                    days.push({"key": j+1,"day": `${moment(props?.startDate).add(j, 'days').format("Do, MMM YY")}`})
               }  
          }
     }

     function OnChange(e){
          const objectToString = JSON.stringify(e);
          props.onChange(objectToString);
          setSelected(e);
     }
     
     renderInputField();

     return (
          <>
          <div>
               {props.type === 'transfer' ? null : <label>Select Day</label>}
               <Typeahead
               id="basic-typeahead-multiple"
               clearButton={props.id ? props.id === 'newWorkout' || 'duplicateWorkout' ? true : false : false}
               labelKey="day"
               onChange={OnChange}
               options={days}
               placeholder={props.id ? props.id === 'newWorkout' || 'duplicateWorkout' ? 'Choose a day...' : 'Choose days...' : 'Choose days...'}
               selected={selected}
               multiple={props.id ? props.id === 'newWorkout' || 'duplicateWorkout' ? false : true : true}
               />
          </div>
          </>
     );
}

export default DaysInput;