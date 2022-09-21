import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { useQuery } from "@apollo/client";
import { GET_EXERCISELIST } from '../../builders/program-builder/exercises/queries';
import AuthContext from "../../context/auth-context";
import { flattenObj } from '../utils/responseFlatten';

const MIN_VALUE = 0;

const ExerciseList = (props: any) => {

     const exerciseDetails: any[] = props.formContext?.addWorkout?.warmup?.length > 0 ? props.formContext?.addWorkout?.warmup : [];

     const exerciseValues: any[] = ['reps', 'sets', 'restTime', 'weights', 'duration']; 

     
     const auth = useContext(AuthContext);
     const [exerciseList, setExerciseList] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>(exerciseDetails);
     const inputField = useRef<any>();
     let skipval: Boolean = true;
     
     function FetchExerciseList(_variable: {} = { id: auth.userid, filter: " " }) {
          useQuery(GET_EXERCISELIST, { variables: _variable, onCompleted: loadExerciseList, skip: !searchInput });
     }
     
     console.log(selected);
     function loadExerciseList(data: any) {
          const flattenedData = flattenObj({ ...data });
          setExerciseList(
               [...flattenedData.exercises].map((exercise) => {
                    return {
                         id: exercise.id,
                         name: exercise.exercisename
                    }
               })
          );
     }

     function ExerciseSearch(data: any) {
          if (data.length > 0) {
               setSearchInput(data);
               skipval = false;
          } else {
               setExerciseList([]);
          }
     }

     function handleSelectedExerciseAdd(name: any, id: any) {
          const values = [...selected];
          let a = values.find((e) => e.id === id);
          if (!a) {
               values.push({ value: name, id: id, type: 'exercise' });
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

     function handleDataChange(i: string, event: any, type: string) {
          const values = [...selected];
          let a = values.findIndex((e) => i === e.id);
          values[a][type] = parseInt(event.target.value >= 0 ? event.target.value : null);

          setSelected(values);

     }

     function handleValidation(){
          var value: boolean = false;
          for(var i=0; i<selected.length; i++){
               for(var j=0; j<exerciseValues.length; j++){
                    if(selected[i][exerciseValues[j]] > 0){
                         value = true;
                    }else {
                         value = false;
                    }
               }
          }
          return value;
     }

     if(handleValidation()){
          props.onChange(JSON.stringify(selected));
     }

     FetchExerciseList({ filter: searchInput, skip: skipval, id: auth.userid });

     return (
          <>
               <InputGroup>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search for exercises" id="searchInput" ref={inputField}
                         onChange={(e) => {
                              e.preventDefault();
                              ExerciseSearch(e.target.value);
                         }} autoComplete="off"
                    />
               </InputGroup>
               <>
                    {exerciseList.slice(0, 5).map((exercise) => {
                         return (
                              <Container className="pl-0">
                                   <option
                                        style={{ cursor: 'pointer' }}
                                        className="m-2 p-1 shadow-lg rounded bg-white"
                                        value={exercise.id}
                                        onClick={(e) => {
                                             e.preventDefault();
                                             handleSelectedExerciseAdd(exercise.name, exercise.id);
                                        }}>
                                        {exercise.name}
                                   </option>
                              </Container>
                         );
                    })}
               </>
               <>
                    {selected.map((val, index) => {
                         return (
                              <Container className="mt-2 p-2 shadow-lg rounded-lg bg-white" key={index}>
                                   <span style={{ fontWeight: 'bold', fontSize: '20px' }} className="ml-2">
                                        {val.value.charAt(0).toUpperCase() + val.value.slice(1)}</span>
                                   <i className="close fas fa-times pr-2" style={{ fontSize: '16px' }} onClick={() => handleSelectedExerciseRemove(val.value)} />
                                   <div className="text-center mt-3 ml-2">
                                        <Row className="text-center">
                                             <Col className="text-center">
                                                  <InputGroup className="mb-3" >
                                                       <FormControl
                                                            type="number"
                                                            min={MIN_VALUE}
                                                            placeholder="Enter reps"
                                                            value={val?.reps}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "reps")}
                                                            required

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
                                                            min={MIN_VALUE}
                                                            placeholder="Enter sets"
                                                            value={val?.sets}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "sets")}
                                                            required
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
                                                            min={MIN_VALUE}
                                                            placeholder="Enter rest time"
                                                            value={val?.restTime}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "restTime")}
                                                            required
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
                                                            min={MIN_VALUE}
                                                            placeholder="Weight"
                                                            value={val.weights}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "weights")}
                                                            required
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
                                                            min={MIN_VALUE}
                                                            placeholder="Duration"
                                                            value={val?.duration}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "duration")}
                                                            required
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
