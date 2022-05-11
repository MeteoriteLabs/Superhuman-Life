import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { DESIGNATIONS } from './queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect = (props: any) => {

     const [multiSelections, setMultiSelections] = useState(
          props.value?.length > 0 ? props.value.split(",") : []
        );
     const [designations, setDesignations] = useState<any[]>([]);

     function FetchData(){
          useQuery(DESIGNATIONS, {onCompleted: loadData, onError: error => console.log(error)});
      }
  
     function loadData(data: any) {
          const flattenedData = flattenObj({...data});
          console.log(flattenedData);
          setDesignations(
              [...flattenedData.designations].map((designation) => {
                  return {
                      id: designation.id,
                      title: designation.Designation_title
                  }
              })
          );
     }

     function OnChange(e){
          let id = e.map(d => {return d.id}).join(',');
          props.onChange(id);
          setMultiSelections(e);
     }

     FetchData();

     return (
          <div>
               <label>Designation</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="title"
               onChange={OnChange}
               options={designations}
               placeholder="Select Designation..."
               selected={multiSelections}
               multiple
               />
          </div>
     )
}

export default MultiSelect;