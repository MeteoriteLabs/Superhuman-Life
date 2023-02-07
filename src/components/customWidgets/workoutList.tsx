import { useState, useRef, useContext } from "react";
import {
  InputGroup,
  FormControl,
  Container,
  Col,
  Row,
  Button,
} from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import AuthContext from "../../context/auth-context";
import { flattenObj } from "../utils/responseFlatten";

const ProgramList = (props: any) => {
  const auth = useContext(AuthContext);
  const [workoutList, setWokroutList] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState(null);
  const [selected, setSelected] = useState<any[]>([]);
  const inputField = useRef<any>();
  let skipval: Boolean = true;

  const GET_WORKOUTLIST = gql`
    query workoutlistQuery($id: ID!, $filter: String!) {
      workouts(
        filters: {
          users_permissions_user: { id: { eq: $id } }
          workouttitle: { containsi: $filter }
        }
      ) {
        data {
          id
          attributes {
            workouttitle
            About
            level
            intensity
            fitnessdisciplines {
              data {
                attributes {
                  disciplinename
                }
              }
            }
            equipment_lists {
              data {
                attributes {
                  name
                }
              }
            }
            users_permissions_user {
              data {
                id
              }
            }
          }
        }
      }
    }
  `;

  function FetchEquipmentList(
    _variable: {} = { id: auth.userid, filter: " " }
  ) {
    useQuery(GET_WORKOUTLIST, {
      variables: _variable,
      onCompleted: loadProgramList,
      skip: !searchInput,
    });
  }

  function loadProgramList(data: any) {
    const flattenedData = flattenObj({ ...data });
    setWokroutList(
      [...flattenedData.workouts].map((workout) => {
        return {
          id: workout.id,
          name: workout.workouttitle,
          level: workout.level,
          description: workout.About,
          intensity: workout.intensity,
          discipline: workout.fitnessdisciplines,
          equipment: workout.equipment_lists,
        };
      })
    );
  }

  function EquipmentSearch(data: any) {
    if (data.length > 0) {
      setSearchInput(data);
      skipval = false;
    } else {
      setWokroutList([]);
    }
  }

  function handleSelectedEquipmentAdd(
    name: any,
    id: any,
    level: any,
    description: any,
    intensity: any,
    equipment: any,
    discipline: any
  ) {
    const values = [...selected];
    let a = values.find((e) => e.id === id);
    let b = values.length === 0;
    if (!a && b) {
      values.push({
        name: name,
        id: id,
        level: level,
        description: description,
        intensity: intensity,
        equipment: equipment,
        discipline: discipline,
      });
      setSelected(values);
    }
    props.onChange(
      values
        .map((e) => {
          return e.id;
        })
        .join(",")
    );
    inputField.current.value = "";
    setWokroutList([]);
    skipval = true;
  }

  function handleSelectedEquipmentRemove(name: any) {
    const values = [...selected];
    values.splice(name, 1);
    setSelected(values);
    props.onChange(
      values
        .map((e) => {
          return e.id;
        })
        .join(",")
    );
  }

  FetchEquipmentList({ filter: searchInput, skip: skipval, id: auth.userid });
  if (selected.length > 0) {
    props.onChange(JSON.stringify(selected));
  }

  return (
    <>
      <label style={{ fontSize: 17 }}>Import from existing workout</label>
      <InputGroup>
        <FormControl
          aria-describedby="basic-addon1"
          placeholder="Search for workout"
          id="searchInput"
          ref={inputField}
          onChange={(e) => {
            e.preventDefault();
            EquipmentSearch(e.target.value);
          }}
          autoComplete="off"
          disabled={selected.length > 0 ? true : false}
        />
      </InputGroup>
      <>
        {workoutList.slice(0, 5).map((workout, index: number) => {
          return (
            <Container className="pl-0">
              <div
                key={index}
                style={{ cursor: "pointer" }}
                className="m-2 ml-4 p-2 shadow-sm rounded bg-white "
                id={workout.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectedEquipmentAdd(
                    workout.name,
                    workout.id,
                    workout.level,
                    workout.description,
                    workout.intensity,
                    workout.equipment,
                    workout.discipline
                  );
                }}
              >
                <div>
                  <Row>
                    <Col style={{ textAlign: "start" }}>
                      {workout.intensity}
                    </Col>
                    <Col style={{ textAlign: "center", fontWeight: "bold" }}>
                      {workout.name}
                    </Col>
                    <Col style={{ textAlign: "end" }}>{workout.level}</Col>
                  </Row>
                  <Row
                    style={{ justifyContent: "center" }}
                    className="mt-2 mb-2"
                  >
                    <Col className="text-center">{workout.description}</Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "start" }}>
                      {workout.equipment
                        .map((e) => {
                          return e.name;
                        })
                        .join(", ")}
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                      {workout.discipline
                        .map((e) => {
                          return e.disciplinename;
                        })
                        .join(", ")}
                    </Col>
                  </Row>
                </div>
              </div>
            </Container>
          );
        })}
      </>
      <>
        {selected.map((val) => {
          return (
            <div>
              <Row>
                <Col lg={8}>
                  <div
                    style={{ cursor: "pointer", maxWidth: "100%" }}
                    className="mt-3 ml-5 p-2 shadow-sm rounded bg-white"
                    id={val.id}
                  >
                    <div>
                      <Row>
                        <Col style={{ textAlign: "start" }}>
                          {val.intensity}
                        </Col>
                        <Col
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          {val.name}
                        </Col>
                        <Col style={{ textAlign: "end" }}>{val.level}</Col>
                      </Row>
                      <Row
                        style={{ justifyContent: "center" }}
                        className="mt-2 mb-2"
                      >
                        <Col className="text-center">{val.description}</Col>
                      </Row>
                      <Row>
                        <Col style={{ textAlign: "start" }}>
                          {val.equipment
                            .map((e) => {
                              return e.name;
                            })
                            .join(", ")}
                        </Col>
                        <Col style={{ textAlign: "end" }}>
                          {val.discipline
                            .map((e) => {
                              return e.disciplinename;
                            })
                            .join(", ")}
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col
                  lg={4}
                  style={{ top: "50%", transform: "translateY(40%)" }}
                >
                  <div>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleSelectedEquipmentRemove(val.value)}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </>
    </>
  );
};

export default ProgramList;
