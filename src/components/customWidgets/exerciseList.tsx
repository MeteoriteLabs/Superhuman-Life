import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import {useQuery} from "@apollo/client";
import { GET_EXERCISELIST } from '../../builders/program-builder/exercises/queries';
import AuthContext from "../../context/auth-context";

const ExerciseList = (props: any) => {

     const auth = useContext(AuthContext);
     const [exerciseList, setExerciseList] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     let skipval: Boolean = true;
     
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

     function handleDataChange(i: any, event: any, idx: number){
          const values = [...selected];
          let a = values.findIndex((e) => i === e.id);
          if(idx === 1){
               values[a].reps = parseInt(event.target.value);
          }else if(idx === 2){
               values[a].sets = parseInt(event.target.value); 
          }else if(idx === 3){
               values[a].weights = parseInt(event.target.value);
          }else if(idx === 4){
               values[a].duration = parseInt(event.target.value); 
          }else {
               values[a].restTime = parseInt(event.target.value);
          }
          setSelected(values);
     }

     props.onChange(selected);
     

     FetchExerciseList({filter: searchInput, skip: skipval});

     return (
          <>
               <InputGroup>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search for exercises" id="searchInput" ref={inputField}
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
                              <Container className="mt-2 p-2 shadow-lg rounded-lg bg-white">
                                   <span style={{fontWeight: 'bold', fontSize: '20px'}} className="ml-2">
                                        {val.value.charAt(0).toUpperCase() + val.value.slice(1)}</span>
                                   <i className="close fas fa-times pr-2" style={{ fontSize: '16px' }} onClick={() => handleSelectedExerciseRemove(val.value)}/>
                                   <div className="text-center mt-3 ml-2">
                                        <Row className="text-center">
                                             <Col className="text-center">
                                                  <InputGroup className="mb-3">
                                                       <FormControl
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter reps"
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, 1)}
                                                       />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text id="basic-addon2">Reps</InputGroup.Text>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                             </Col>
                                             <Col>
                                                  <InputGroup className="mb-3">
                                                       <FormControl
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter sets"
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, 2)}
                                                       />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text id="basic-addon2">Sets</InputGroup.Text>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                             </Col>
                                             <Col>
                                                  <InputGroup className="mb-3">
                                                       <FormControl
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter rest time"
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, 5)}
                                                       />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text>min</InputGroup.Text>
                                                            <InputGroup.Text id="basic-addon2">Rest time</InputGroup.Text>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                             </Col>
                                        </Row>
                                        <Row>
                                        <Col>
                                             <InputGroup className="mb-3">
                                                  <FormControl
                                                       type="number"
                                                       min="0"
                                                       placeholder="Weight"
                                                       aria-describedby="basic-addon2"
                                                       onChange={e => handleDataChange(val.id, e, 3)}
                                                  />
                                                  <InputGroup.Append>
                                                       <InputGroup.Text>Kg</InputGroup.Text>
                                                       <InputGroup.Text id="basic-addon2">Weights</InputGroup.Text>
                                                  </InputGroup.Append>
                                             </InputGroup>
                                             </Col>
                                             <Col>
                                                  <InputGroup className="mb-3">
                                                       <FormControl
                                                            type="number"
                                                            min="0"
                                                            placeholder="Duration"
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, 4)}
                                                       />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text>min</InputGroup.Text>
                                                            <InputGroup.Text id="basic-addon2">Duration</InputGroup.Text>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                             </Col>
                                        </Row>
                                   </div>
                              </Container>
                         )
                    })}
               </>
          </>
     )
}

export default ExerciseList;
