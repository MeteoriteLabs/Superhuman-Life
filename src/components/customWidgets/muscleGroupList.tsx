import { useState, useRef } from 'react';
import { InputGroup, FormControl, Container } from 'react-bootstrap';
import { gql, useQuery} from "@apollo/client";

const MuscleGroupList = (props: any) => {

     const [muscleGroup, setMuscleGroup] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     let skipval: Boolean = true;

     const GET_MUSCLEGROUPS = gql`
        query muscleGroupQuery($filter: String!){
            muscleGroups(sort: "updatedAt", where: {name_contains: $filter}){
                id 
                name
            }
        }
    `

     function FetchMuscleGroupList(_variable: {} = {filter: " "}){
          useQuery(GET_MUSCLEGROUPS, {variables: _variable, onCompleted: loadMuscleGroupList, skip: !searchInput});
      }
  
      function loadMuscleGroupList(data: any){
          setMuscleGroup(
               [...data.muscleGroups].map((equipment) => {
                    return {
                         id: equipment.id,
                         name: equipment.name
                    }
               })
               );
      }

     function muscleGroupSearch(data: any) {
          if(data.length > 0){
               setSearchInput(data);
               skipval = false;
          }else {
               setMuscleGroup([]);
          }
     }

     function handleSeletedMuscleGroupAdd(name: any, id: any) {
          const values = [...selected];
          let a = values.find((e) => e.id === id);
          if (!a){
               values.push({ value: name, id: id}); 
               setSelected(values);
          }
          props.onChange(values.map((e) => {
               return e.id;
          }).join(','))
          inputField.current.value = "";
          setMuscleGroup([]);
          skipval = true;
     }

     function handleSelectedMuscleGroupRemove(name: any) {
          const values = [...selected];
          values.splice(name, 1);
          setSelected(values);
          props.onChange(values.map((e) => {
               return e.id;
          }).join(','))
     }

     FetchMuscleGroupList({ filter: searchInput, skip: skipval});
     return (
          <>
               <label style={{ fontSize: 17}}>Muscle group</label>
                    <InputGroup>
                         <FormControl aria-describedby="basic-addon1" placeholder="Search For Muscle Group"  id="searchInput" ref={inputField}
                         onChange={(e) => {e.preventDefault();
                                   muscleGroupSearch(e.target.value);
                              }} autoComplete="off"
                         />
                    </InputGroup>
                    <>
                         {muscleGroup.slice(0,5).map((muscle) => {
                              return (
                                   <Container className="pl-0">
                                   <option style={{cursor: 'pointer'}}
                                        className="m-2 p-1 shadow-sm rounded bg-white"
                                        value={muscle.id}
                                        onClick={(e) => {e.preventDefault(); handleSeletedMuscleGroupAdd(muscle.name, muscle.id);
                                             }}>
                                        {muscle.name}
                                   </option>
                                   </Container>
                              );
                         })}
                    </>
                    <>
                         {selected.map((val) => {
                              return (
                                   <div className="text-center mt-2 mr-2" style={{ 
                                        display: 'inline-block',
                                        height: '32px',
                                        padding: '0px 12px',
                                        fontSize: '14px',
                                        lineHeight: '32px',
                                        borderRadius: '16px',
                                        color: 'rgba(0,0,0,0.8)',
                                        backgroundColor: '#bebdb8',
                                   }}>
                                        {val.value}
                                        <i className="close fas fa-times" 
                                             style={{ fontSize: '14px', 
                                             cursor: 'pointer', 
                                             float: 'right', 
                                             paddingLeft: '8px', 
                                             lineHeight: '32px',
                                             height: '32px'
                                        }} 
                                             onClick={() => handleSelectedMuscleGroupRemove(val.value)}></i>
                                   </div>
                              )
                         })}
                    </> 
          </>
     )
}

export default MuscleGroupList;