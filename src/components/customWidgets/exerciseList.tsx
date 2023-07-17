import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_EXERCISELIST } from 'builders/program-builder/exercises/queries';
import AuthContext from 'context/auth-context';
import { flattenObj } from '../utils/responseFlatten';

const MIN_VALUE = 0;

const ExerciseList = (props: any) => {
    const inputDisabled = props?.readonly;

    const exerciseDetails: any[] = props.value === undefined ? [] : JSON.parse(props.value);

    const exerciseValues: any[] = ['reps', 'sets', 'restTime', 'weights', 'duration'];

    const auth = useContext(AuthContext);
    const [exerciseList, setExerciseList] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(null);
    const [selected, setSelected] = useState<any[]>(exerciseDetails);
    const inputField = useRef<any>();
    let skipval = true;

    function FetchExerciseList(
        _variable: Record<string, unknown> = { id: auth.userid, filter: ' ' }
    ) {
        useQuery(GET_EXERCISELIST, {
            variables: _variable,
            onCompleted: loadExerciseList,
            skip: !searchInput
        });
    }

    function loadExerciseList(data: any) {
        const flattenedData = flattenObj({ ...data });
        setExerciseList(
            [...flattenedData.exercises].map((exercise) => {
                return {
                    id: exercise.id,
                    name: exercise.exercisename
                };
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
        const a = values.find((e) => e.id === id);
        if (!a) {
            values.push({ value: name, id: id, type: 'exercise' });
            setSelected(values);
        }
        inputField.current.value = '';
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
        const a = values.findIndex((e) => i === e.id);
        values[a][type] = parseInt(event.target.value >= 0 ? event.target.value : null);

        setSelected(values);
    }

    function handleValidation() {
        let isValid = false;
        for (let i = 0; i < selected.length; i++) {
            for (let j = 0; j < exerciseValues.length; j++) {
                if (selected[i][exerciseValues[j]] > 0) {
                    isValid = true;
                } else {
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    if (handleValidation()) {
        props.onChange(JSON.stringify(selected));
    } else {
        props.onChange(undefined);
    }

    FetchExerciseList({ filter: searchInput, skip: skipval, id: auth.userid });

    return (
        <>
            <InputGroup>
                <FormControl
                    aria-describedby="basic-addon1"
                    disabled={inputDisabled}
                    placeholder="Search for exercises"
                    id="searchInput"
                    ref={inputField}
                    onChange={(e) => {
                        e.preventDefault();
                        ExerciseSearch(e.target.value);
                    }}
                    autoComplete="off"
                />
            </InputGroup>
            <>
                {exerciseList.slice(0, 5).map((exercise, index) => {
                    return (
                        <Container className="pl-0" key={index}>
                            <option
                                style={{ cursor: 'pointer' }}
                                className="m-2 p-1 shadow-lg rounded bg-white"
                                value={exercise.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectedExerciseAdd(exercise.name, exercise.id);
                                }}
                            >
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
                                {val.value.charAt(0).toUpperCase() + val.value.slice(1)}
                            </span>
                            <i
                                className="close fas fa-times pr-2"
                                style={{ fontSize: '16px' }}
                                onClick={() => handleSelectedExerciseRemove(val.value)}
                            />
                            <div className="text-center mt-3 ml-2">
                                <Row className="text-center">
                                    <Col sm={12} lg={4} className="text-center">
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="number"
                                                min={MIN_VALUE}
                                                placeholder="Enter reps"
                                                disabled={inputDisabled}
                                                value={val?.reps}
                                                aria-describedby="basic-addon2"
                                                onChange={(e) =>
                                                    handleDataChange(val.id, e, 'reps')
                                                }
                                                required
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">
                                                    Reps
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                    <Col sm={12} lg={4}>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="number"
                                                min={MIN_VALUE}
                                                placeholder="Enter sets"
                                                disabled={inputDisabled}
                                                value={val?.sets}
                                                aria-describedby="basic-addon2"
                                                onChange={(e) =>
                                                    handleDataChange(val.id, e, 'sets')
                                                }
                                                required
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">
                                                    Sets
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                    <Col sm={12} lg={4}>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="number"
                                                min={MIN_VALUE}
                                                placeholder="Enter rest time"
                                                disabled={inputDisabled}
                                                value={val?.restTime}
                                                aria-describedby="basic-addon2"
                                                onChange={(e) =>
                                                    handleDataChange(val.id, e, 'restTime')
                                                }
                                                required
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text>min</InputGroup.Text>
                                                <InputGroup.Text id="basic-addon2">
                                                    Rest time
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} lg={6}>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="number"
                                                min={MIN_VALUE}
                                                placeholder="Weight"
                                                disabled={inputDisabled}
                                                value={val.weights}
                                                aria-describedby="basic-addon2"
                                                onChange={(e) =>
                                                    handleDataChange(val.id, e, 'weights')
                                                }
                                                required
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text>Kg</InputGroup.Text>
                                                <InputGroup.Text id="basic-addon2">
                                                    Weights
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                    <Col xs={12} lg={6}>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                type="number"
                                                min={MIN_VALUE}
                                                placeholder="Duration"
                                                disabled={inputDisabled}
                                                value={val?.duration}
                                                aria-describedby="basic-addon2"
                                                onChange={(e) =>
                                                    handleDataChange(val.id, e, 'duration')
                                                }
                                                required
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text>min</InputGroup.Text>
                                                <InputGroup.Text id="basic-addon2">
                                                    Duration
                                                </InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                    );
                })}
            </>
        </>
    );
};

export default ExerciseList;
