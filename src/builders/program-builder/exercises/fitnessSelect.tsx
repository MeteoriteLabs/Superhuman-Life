import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FETCH_FITNESSDISCPLINES } from './queries';
import { useQuery } from "@apollo/client";

const FitnessSelect = (props: any) => {

     const [singleSelections, setSingleSelections] = useState<any[]>([]);
     const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);

     function FetchData(){
          useQuery(FETCH_FITNESSDISCPLINES, {onCompleted: loadData})
      }
  
     function loadData(data: any) {
          setFitnessDisciplines(
              [...data.fitnessdisciplines].map((discipline) => {
                  return {
                      id: discipline.id,
                      disciplineName: discipline.disciplinename,
                      updatedAt: discipline.updatedAt
                  }
              })
          );
     }

     onTrigger();

    function onTrigger(){
         props.fitnessdisciplinesList(singleSelections);
    }

    FetchData();


     return (
          <div>
               <label>Fitness Discplines</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="disciplineName"
               onChange={setSingleSelections}
               options={fitnessdisciplines}
               placeholder="Choose Discpline..."
               selected={singleSelections}
               />
          </div>
     )
}

export default FitnessSelect;