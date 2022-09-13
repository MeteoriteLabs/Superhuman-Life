import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { GET_EQUIPMENTLIST } from './queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect = (props: any) => {

     console.log(props);

     const [multiSelections, setMultiSelections] = useState(
          props.value?.length > 0 ? JSON.parse(props.value) : []
        );
     const [equipmentList, setEquipmentList] = useState<any[]>([]);

     function FetchData(){
          useQuery(GET_EQUIPMENTLIST, {onCompleted: loadData})
      }
  
     function loadData(data: any) {
          const flattenedData = flattenObj({...data});
          setEquipmentList(
              [...flattenedData.equipmentLists].map((equipment) => {
                  return {
                      id: equipment.id,
                      name: equipment.name
                  }
              })
          );
     }

     function OnChange(e){
          // let id = e.map(d => {return d.id}).join(',');
          props.onChange(JSON.stringify(e));
          setMultiSelections(e);
     }

     FetchData();

     return (
          <div>
               <label>Equipment</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="name"
               onChange={OnChange}
               options={equipmentList}
               placeholder="Choose multiple discplines..."
               selected={multiSelections}
               multiple
               disabled={props.uiSchema.readonly ? true : false}
               />
          </div>
     )
}

export default MultiSelect;