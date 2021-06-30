import { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { gql, useQuery,useMutation } from "@apollo/client";

const MuscleGroupList = () => {

     const [muscleGroup, setMuscleGroup] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState('');
     const [select, setSelected] = useState<any[]>([]);

     const GET_MUSCLEGROUPS = gql`
        query muscleGroupQuery($filter: String!){
            muscleGroups(sort: "updatedAt", where: {name_contains: $filter}){
                id 
                name
            }
        }
    `

     function FetchMuscleGroupList(_variable: {} = {filter: " "}){
          useQuery(GET_MUSCLEGROUPS, {variables: _variable, onCompleted: loadMuscleGroupList});
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
          console.log(data);
          setSearchInput(data);
      }

      FetchMuscleGroupList({ filter: searchInput});
     return (
          <>
               <label style={{ fontSize: 17}}>Muscle Group</label>
                    <InputGroup className="mb-3" >
                         <FormControl aria-describedby="basic-addon1" placeholder="Search"  id="searchInput" 
                         onChange={(e) => {e.preventDefault();
                                   muscleGroupSearch(e.target.value);
                              }} autoComplete="off"
                         />
                         <InputGroup.Prepend>
                              <Button variant="outline-secondary"><i className="fas fa-search"></i></Button>
                         </InputGroup.Prepend>
                    </InputGroup>
                    <div>
                         {muscleGroup.slice(0,5).map((muscle) => {
                              return (
                                   <option style={{cursor: 'pointer'}} 
                                        onClick={(e) => {e.preventDefault(); setSelected(muscle.name)}}>
                                        {muscle.name}
                                   </option>
                              );
                         })}
                    </div> 
          </>
     )
}

export default MuscleGroupList;