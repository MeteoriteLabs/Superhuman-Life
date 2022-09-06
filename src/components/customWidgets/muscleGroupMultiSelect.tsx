import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { GET_MUSCLEGROUPS } from './queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const MuscleGroupMultiSelect = (props: any) => {
    const [multiSelections, setMultiSelections] = useState<any[]>(
        props.value?.length > 0 ? props.value : []
      );
      const [muscleList, setMuscleList] = useState<any[]>([]);

   function FetchData(){
        useQuery(GET_MUSCLEGROUPS, {onCompleted: loadData})
    }

   function loadData(data: any) {
                  const flattenedData = flattenObj({...data});
                  console.log('flattenedData',flattenedData);
                  setMuscleList(
                      [...flattenedData.muscleGroups].map((muscles) => {
                          return {
                              id: muscles.id,
                              name: muscles.name
                          }
                      })
                  );
             }

   function OnChange(e) {
        setMultiSelections(e);
      }
    
   props.onChange(multiSelections.map((d) => {
        return d.id;
        }).join(",").toString()
   );

  FetchData();

   return (
        <div>
             <label>Muscle Group</label>
             <Typeahead
             id="basic-typeahead-multiple"
             labelKey="name"
             onChange={OnChange}
             options={muscleList}
             placeholder="Choose Discpline..."
             selected={multiSelections}
             multiple
             />
        </div>
   )
}

export default MuscleGroupMultiSelect;



// const MultiSelect = (props: any) => {

//      const [multiSelections, setMultiSelections] = useState<any[]>(
//           props.value?.length > 0 ? props.value : []
//         );
//         const [equipmentList, setEquipmentList] = useState<any[]>([]);

//      function FetchData(){
//           useQuery(GET_EQUIPMENTLIST, {onCompleted: loadData})
//       }

//      function loadData(data: any) {
//                     const flattenedData = flattenObj({...data});
//                     setEquipmentList(
//                         [...flattenedData.equipmentLists].map((equipment) => {
//                             return {
//                                 id: equipment.id,
//                                 name: equipment.name
//                             }
//                         })
//                     );
//                }

//      function OnChange(e) {
//           setMultiSelections(e);
//         }
      
//      props.onChange(multiSelections.map((d) => {
//           return d.id;
//           }).join(",").toString()
//      );

//     FetchData();

//      return (
//           <div>
//                <label>Equipments</label>
//                <Typeahead
//                id="basic-typeahead-multiple"
//                labelKey="name"
//                onChange={OnChange}
//                options={equipmentList}
//                placeholder="Choose Discpline..."
//                selected={multiSelections}
//                multiple
//                />
//           </div>
//      )
// }

// export default MultiSelect;