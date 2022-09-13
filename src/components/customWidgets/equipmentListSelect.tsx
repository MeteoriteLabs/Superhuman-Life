import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { GET_EQUIPMENTLIST } from './queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect = (props: any) => {

     const [multiSelections, setMultiSelections] = useState<any[]>(
          props.value?.length > 0 ? props.value : []
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

     function OnChange(e) {
          setMultiSelections(e);
        }
      
     props.onChange(multiSelections?.map((d) => {
          return d.id;
          }).join(",").toString()
     );

    FetchData();

     return (
          <div>
               <label>Equipments</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="name"
               onChange={OnChange}
               options={equipmentList}
               placeholder="Choose Discpline..."
               selected={multiSelections}
               multiple
               disabled={props.uiSchema.readonly ? true : false}
               />
          </div>
     )
}

export default MultiSelect;