import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container, Row, Col, Form } from 'react-bootstrap';
import { useQuery } from "@apollo/client";
import { GET_EXERCISELIST } from '../../builders/program-builder/exercises/queries';
import AuthContext from "../../context/auth-context";
import { flattenObj } from '../utils/responseFlatten';

const MIN_VALUE = 0;

const ExerciseList = (props: any) => {

     const auth = useContext(AuthContext);
     const [exerciseList, setExerciseList] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>(props?.value[0]?.type === "exercise" ? props.value : []);
     const inputField = useRef<any>();
     // const [isRepsEmpty, setIsRepsEmpty] = useState<boolean>(false);
     // const [isSetsEmpty, setIsSetsEmpty] = useState<boolean>(false);
     // const [isWeightEmpty, setIsWeightEmpty] = useState<boolean>(false);
     // const [isRestTimeEmpty, setIsRestTimeEmpty] = useState<boolean>(false);
     // const [isDurationEmpty, setIsDurationEmpty] = useState<boolean>(false);
     let skipval: Boolean = true;

     function FetchExerciseList(_variable: {} = { id: auth.userid, filter: " " }) {
          useQuery(GET_EXERCISELIST, { variables: _variable, onCompleted: loadExerciseList, skip: !searchInput });
     }

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
          // if(event.target.value === null && type === 'reps'){
          //      setIsRepsEmpty(true);
          // }
          setSelected(values);
     }

     props.onChange(selected);

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
                    {selected.map((val) => {
                         return (
                              <Container className="mt-2 p-2 shadow-lg rounded-lg bg-white">
                                   <span style={{ fontWeight: 'bold', fontSize: '20px' }} className="ml-2">
                                        {val.value.charAt(0).toUpperCase() + val.value.slice(1)}</span>
                                   <i className="close fas fa-times pr-2" style={{ fontSize: '16px' }} onClick={() => handleSelectedExerciseRemove(val.value)} />
                                   <div className="text-center mt-3 ml-2">
                                        <Row className="text-center">
                                             <Col className="text-center">
                                                  <InputGroup className="mb-3" hasValidation>
                                                       <FormControl
                                                            type="number"
                                                            min={MIN_VALUE}
                                                            placeholder="Enter reps"
                                                            value={val?.reps}
                                                            aria-describedby="basic-addon2"
                                                            onChange={e => handleDataChange(val.id, e, "reps")}
                                                            required
                                                            // isInvalid={isRepsEmpty}
                                                       />
                                                       <InputGroup.Append>
                                                            <InputGroup.Text id="basic-addon2">Reps</InputGroup.Text>
                                                       </InputGroup.Append>
                                                       <Form.Control.Feedback type="invalid">
                                                            This is required field.
                                                       </Form.Control.Feedback>
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
                                                            // isInvalid={isSetsEmpty}
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
                                                            // isInvalid={isRestTimeEmpty}
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
                                                            // isInvalid={isWeightEmpty}
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
                                                            // isInvalid={isDurationEmpty}
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
