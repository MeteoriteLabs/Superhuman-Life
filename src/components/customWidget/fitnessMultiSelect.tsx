import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery } from "@apollo/client";
import { FETCH_FITNESSDISCPLINES } from '../../builders/session-builder/graphQL/queries';
import {flattenObj} from '../utils/responseFlatten';

const MultiSelect: React.FC<{onChange: (args: string) => void; value: any;}> = (props) => {
     const [multiSelections, setMultiSelections] = useState([]);
     const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([]);

     function FetchData() {
          useQuery(FETCH_FITNESSDISCPLINES, { onCompleted: loadData })
     }

     function loadData(data: any) {
          const flattenData = flattenObj({ ...data });
          setFitnessDisciplines(
               [...flattenData.fitnessdisciplines].map((discipline) => {
                    return {
                         id: discipline.id,
                         disciplinename: discipline.disciplinename,
                         updatedAt: discipline.updatedAt
                    }
               })
          );
          if(props.value){
               setMultiSelections(props.value)
          }
     }

     function OnChange(e) {
          const id = e.map(d => { return d.id }).join(',');
          props.onChange(id);
          setMultiSelections(e);
     }

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
               />
          </div>
     )
}

export default MultiSelect;