import { useState, useRef, useContext } from 'react';
import { InputGroup, FormControl, Container, Col, Row, Button } from 'react-bootstrap';
import { gql, useQuery } from "@apollo/client";
import AuthContext from '../../context/auth-context';
import '../../builders/program-builder/program-template/styles.css';
import SchedulerEvent from '../../builders/program-builder/program-template/scheduler-event';

const ProgramList = (props: any) => {

     const auth = useContext(AuthContext);
     const [programList, setProgramList] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any>({});
     const inputField = useRef<any>();
     let skipval: Boolean = true;



     const GET_PROGRAMLIST = gql`
     query programlistQuery($id: String!, $filter: String!) {
          fitnessprograms(where: {users_permissions_user: {id:$id}, title_contains: $filter}){
               id
               title
               duration_days
               level
               description
               events
               fitnessdisciplines {
                    id
                    disciplinename
               }
               users_permissions_user {
                    id
               }
          }
     }
     `

     function FetchEquipmentList(_variable: {} = { id: auth.userid, filter: " " }) {
          useQuery(GET_PROGRAMLIST, { variables: _variable, onCompleted: loadProgramList, skip: !searchInput });
     }

     function loadProgramList(data: any) {
          setProgramList(
               [...data.fitnessprograms].map((program) => {
                    return {
                         id: program.id,
                         name: program.title,
                         duration: program.duration_days,
                         level: program.level,
                         description: program.description,
                         discpline: program.fitnessdisciplines,
                         events: program.events
                    }
               })
          );
     }

     function EquipmentSearch(data: any) {
          if (data.length > 0) {
               setSearchInput(data);
               skipval = false;
          } else {
               setProgramList([]);
          }
     }

     function handleSelectedEquipmentAdd(name: any, id: any, duration: any, level: any, description: any, discpline: any, events: any) {
          setSelected({ name: name, id: id, duration: duration, level: level, description: description, discpline: discpline, events: events });
          inputField.current.value = "";
          setProgramList([]);
          skipval = true;
     }

     var days: any = [];

     for (var i = 1; i <= selected.duration; i++) {
          days.push(i);
     }

     function renderEventsTable() {
          if (selected.duration) {
               return (
                    <SchedulerEvent programDays={days} programEvents={selected.events} />
               )
          }
     }

     FetchEquipmentList({ filter: searchInput, skip: skipval, id: auth.userid });

     return (
          <>
               <label style={{ fontSize: 17 }}>Import from existing program</label>
               <Button variant="outline-danger" className="float-right mb-3" onClick={() => { props.callback('none'); setSelected({}) }}>close</Button>
               <InputGroup>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search for program" id="searchInput" ref={inputField}
                         onChange={(e) => {
                              setSelected({});
                              e.preventDefault();
                              EquipmentSearch(e.target.value);
                         }} autoComplete="off"
                    />
               </InputGroup>
               <>
                    {programList.slice(0, 5).map((program) => {
                         return (
                              <Container className="pl-0">
                                   <div
                                        style={{ cursor: 'pointer', maxWidth: '60%' }}
                                        className="m-2 ml-5 p-2 shadow-sm rounded bg-white "
                                        id={program.id}
                                        onClick={(e) => {
                                             e.preventDefault();
                                             handleSelectedEquipmentAdd(program.name, program.id, program.duration, program.level, program.description, program.discpline, program.events);
                                        }}>
                                        <div>
                                             <Row>
                                                  <Col style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                                       {program.name}
                                                  </Col>
                                                  <Col style={{ textAlign: 'center' }}>
                                                       {program.description}
                                                  </Col>
                                                  <Col style={{ textAlign: 'end' }}>
                                                       {program.level}
                                                  </Col>
                                             </Row>
                                        </div>
                                   </div>
                              </Container>
                         );
                    })}
               </>
               <>
                    <div className="mt-5">
                         {renderEventsTable()}
                    </div>
               </>
          </>
     )
}

export default ProgramList;
