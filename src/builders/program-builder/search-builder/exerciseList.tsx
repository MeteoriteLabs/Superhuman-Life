import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container } from 'react-bootstrap';
import { gql, useQuery} from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ExerciseBuild from './exercisebuild';

const ExerciseList = (props: any) => {

     const auth = useContext(AuthContext);
     const [exerciseList, setExerciseList] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     let skipval: Boolean = true;

     
     
    const GET_EXERCISELIST = gql`
     query exercisesList($id: String) {
          exercises(where: { users_permissions_user: {id: $id}}){
               id
               exercisename
               users_permissions_user {
                    id
               }
          }
     }
     `
     
     function FetchExerciseList(_variable: {} = {id: auth.userid}){
          useQuery(GET_EXERCISELIST, { variables: _variable ,onCompleted: loadExerciseList, skip: !searchInput});
     }

     function loadExerciseList(data: any){
          setExerciseList(
          [...data.exercises].map((exercise) => {
               return {
                    id: exercise.id,
                    name: exercise.exercisename
               }
          })
          );
     }

  
     
     function ExerciseSearch(data: any) {
          if(data.length > 0){
               setSearchInput(data);
               skipval = false;
          }else {
               setExerciseList([]);
          }
     }

     function handleSelectedExerciseAdd(name: any, id: any) {
          const values = [...selected];
          let a = values.find((e) => e.id === id);
          if (!a){
               values.push({ value: name, id: id}); 
               setSelected(values);
          }
          inputField.current.value = "";
          setExerciseList([]);
          skipval = true;
     }

     function handleSelectedExerciseRemove(name: any) {
          const values = [...selected];
          values.splice(name, 1);
          setSelected(values);
     }
     
     onTrigger();

     function onTrigger() {
          props.exerciseList(selected);
     }

     FetchExerciseList({filter: searchInput, skip: skipval});

     return (
          <>
               <InputGroup>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search For Exercises" id="searchInput" ref={inputField}
                              onChange={(e) => {e.preventDefault();
                                   ExerciseSearch(e.target.value);
                         }} autoComplete="off"
                    />
               </InputGroup>
               <>
                    {exerciseList.slice(0,5).map((exercise) => {
                         return (
                              <Container className="pl-0">
                                   <option 
                                        style={{cursor: 'pointer'}}
                                        className="m-2 p-1 shadow-lg rounded bg-white"
                                        value={exercise.id} 
                                        onClick={(e) => {e.preventDefault(); 
                                             handleSelectedExerciseAdd(exercise.name, exercise.id);
                                             }}>
                                             {exercise.name}
                                   </option>
                              </Container>
                         );
                    })}
               </>
               <> 
                    {selected.map((val) => {
                         return (
                              <Container className="mt-2 p-2 shadow-sm rounded bg-white">
                                   <span style={{fontWeight: 'bold'}}>{val.value}</span>
                                   <i className="close fas fa-times pr-2" style={{ fontSize: '16px' }} onClick={() => handleSelectedExerciseRemove(val.value)}/>
                                   <div>
                                        <ExerciseBuild />
                                   </div>
                              </Container>
                         )
                    })}
               </>
          </>
     )
}

export default ExerciseList;