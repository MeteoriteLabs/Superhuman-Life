import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const MultiSelect = (props: any) => {

     const [multiSelections, setMultiSelections] = useState([]);

     onTrigger();

    function onTrigger(){
         props.fitnessdisciplinesList(multiSelections);
    }


     return (
          <div>
               <label>Fitness discplines</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="disciplineName"
               onChange={setMultiSelections}
               options={props.options}
               placeholder="Choose multiple discplines..."
               selected={multiSelections}
               multiple
               />
          </div>
     )
}

export default MultiSelect;