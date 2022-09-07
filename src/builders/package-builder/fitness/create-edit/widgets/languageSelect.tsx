import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { LANGUAGES } from '../../graphQL/queries';
import { useQuery } from "@apollo/client";
import { flattenObj} from '../../../../../components/utils/responseFlatten';

const MultiSelect = (props: any) => {

     console.log(props);

     const [multiSelections, setMultiSelections] = useState<any>(props.value !== undefined ? JSON.parse(props.value) : []);
     const [languages, setlanguages] = useState<any[]>([]);

     function FetchData(){
          useQuery(LANGUAGES, {onCompleted: loadData, onError: error => console.log(error)});
      }
  
     function loadData(data: any) {
          const flattenedData = flattenObj({...data});
          setlanguages(
              [...flattenedData.languages].map((language) => {
                  return {
                      id: language.id,
                      languages: language.languages
                  }
              })
          );
     }

     function OnChange(e){
        props.onChange(JSON.stringify(e));
        setMultiSelections(e);
     }

     FetchData();

     return (
          <div>
               <label>Languages</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="languages"
               onChange={OnChange}
               options={languages}
               placeholder="Select languages..."
               selected={multiSelections}
               multiple
               />
          </div>
     )
}

export default MultiSelect;