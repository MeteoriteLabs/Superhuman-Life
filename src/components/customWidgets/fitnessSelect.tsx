import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FETCH_FITNESSDISCPLINES } from '../../builders/program-builder/exercises/queries';
import { useQuery } from "@apollo/client";
import {flattenObj} from '../utils/responseFlatten';

const FitnessSelect = (props: any) => {

     console.log(props)

     const [singleSelections, setSingleSelections] = useState<any[]>(
          props.value?.length > 0 ? JSON.parse(props.value) : []
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

     function OnChange(e) {
          setSingleSelections(e);
     }
      
     props.onChange(JSON.stringify(singleSelections));

    FetchData();

     return (
          <div>
               <label>Fitness Discplines</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="disciplinename"
               onChange={OnChange}
               options={fitnessdisciplines}
               placeholder="Choose Discpline..."
               selected={singleSelections}
               />
          </div>
     )
}

export default FitnessSelect;