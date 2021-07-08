import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const FitnessSelect = (props: any) => {

     const [singleSelections, setSingleSelections] = useState<any[]>([]);

     onTrigger();

    function onTrigger(){
         props.fitnessdisciplinesList(singleSelections);
    }


     return (
          <div>
               <label>Fitness Discplines</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="disciplineName"
               onChange={setSingleSelections}
               options={props.options}
               placeholder="Choose Discpline..."
               selected={singleSelections}
               />
          </div>
     )
}

export default FitnessSelect;