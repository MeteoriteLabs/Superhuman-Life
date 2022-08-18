import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import moment from 'moment';

const DaysInput = (props: any) => {
     const last = window.location.pathname.split('/').pop();

     // const [data, setData] = useState(0);
     const [selected, setSelected] = useState(props.val ? [moment(props.startDate).add(props.val, 'days').format("Do, MMM YY")] : []);

     const GET_PROGRAM = gql`
     query getprogram($id: ID!) {
          fitnessprograms(filters: { id: { eq: $id } }) {
          data {
               id
               attributes {
               duration_days
               }
          }
          }
     }
  `;

     function FetchData(_variables: {} = {id: last}) {
          useQuery(GET_PROGRAM, {variables: _variables, onCompleted: loadData});
     }

     function loadData(data: any) {
          // const flattenData = flattenObj({...data});
     //      setData(
     //           flattenData.fitnessprograms[0].duration_days
     //     )
     }

     FetchData({id: last});

     const days: any[] = [];

     function renderInputField() {
          if(props?.type === 'day') {
               for (var i=0; i<props?.duration;i++){
                    days.push({"key": i+1,"day": `Day - ${i+1}`})
               }
          }else {
               for (var i=0; i<props?.duration;i++){
                    days.push({"key": i+1,"day": `${moment(props?.startDate).add(i, 'days').format("Do, MMM YY")}`})
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