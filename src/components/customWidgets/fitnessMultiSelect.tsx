import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FETCH_FITNESSDISCPLINES } from '../../builders/program-builder/workout/queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect = (props: any) => {

     console.log(props);

     const [multiSelections, setMultiSelections] = useState(
          props.value?.length > 0 ? props.value : []
        );
     const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);

     function FetchData(){
          useQuery(FETCH_FITNESSDISCPLINES, {onCompleted: loadData})
      }
  
     function loadData(data: any) {
          const flattenedData = flattenObj({...data});
          setFitnessDisciplines(
              [...flattenedData.fitnessdisciplines].map((discipline) => {
                  return {
                      id: discipline.id,
                      disciplinename: discipline.disciplinename,
                      updatedAt: discipline.updatedAt
                  }
              })
          );
     }

     function OnChange(e){
          // let id = e.map(d => {return d.id}).join(',');
          // props.onChange(id);
          setMultiSelections(e);
     }

     // if(props.value === multiSelections){
          props.onChange(JSON.stringify(multiSelections));
     // }

     FetchData();

     return (
          <div>
               <label>Fitness discplines</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="disciplinename"
               onChange={OnChange}
               options={fitnessdisciplines}
               placeholder="Choose multiple discplines..."
               selected={multiSelections}
               multiple
               disabled={props.uiSchema.readonly ? true : false}
               />
          </div>
     )
}

export default MultiSelect;