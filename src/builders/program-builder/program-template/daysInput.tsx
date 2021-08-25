import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

const DaysInput = (props: any) => {
     const last = window.location.pathname.split('/').pop();

     const [data, setData] = useState(0);
     const [selected, setSelected] = useState("");

     const GET_PROGRAM = gql`
          query getprogram($id: String!){
               fitnessprograms(where: {id: $id}){
                    id
                    duration_days
               }
          }
     `

     function FetchData(_variables: {} = {id: last}) {
          useQuery(GET_PROGRAM, {variables: _variables, onCompleted: loadData});
     }

     function loadData(data: any) {
          setData(
             data.fitnessprograms[0].duration_days
         )
     }

     FetchData({id: last});

     const days: any[] = [];

     function renderInputField() {
          for (var i=0; i<data;i++){
               days.push({"day": `Day-${i+1}`})
          }         
     }

     function OnChange(e){
          const objectToString = JSON.stringify(e);
          props.onChange(objectToString);
          setSelected(e);
     }
     
     renderInputField();

     return (
          <div>
               <label>Select Day</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="day"
               onChange={OnChange}
               options={days}
               placeholder={props.id === 'newWorkout' ? 'Choose a day...' : 'Choose days...'}
               selected={selected}
               multiple={props.id === 'newWorkout' ? false : true}
               />
          </div>
     );
}

export default DaysInput;