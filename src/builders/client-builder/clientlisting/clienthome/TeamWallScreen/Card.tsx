import { Card, Col, Row, FormControl, InputGroup, Button } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import { ADD_COMMENT, GET_TAGNAME } from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import "./Styles.css";

function CardComp(props: any) {
     const auth = useContext(AuthContext);
     const comment = useRef<any>();
     const [name, setName] = useState<any>();

     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}-${month}-${year}`;
     }
     const [createComment] = useMutation(ADD_COMMENT, {});

     function FetchData(_variables: {} = { id: props.resourceid }) {
          useQuery(GET_TAGNAME, { variables: _variables, onCompleted: loadName });
     }

     function loadName(d: any) {
          setName(d.workouts[0].workouttitle);
     }
     function addComment(val: any) {
          createComment({
               variables: {
                    feedback_note: props.id,
                    comment: val,
                    users_permissions_user: auth.userid,
               },
          });
     }
     FetchData({ id: props.resourceid });

     return (
          <div>
               <Card border="primary" className="mt-3">
                    <Card.Body>
                         <Row>
                              <img
                                   src="/assets/avatar-1.jpg"
                                   height="50"
                                   className="rounded-circle ml-2"
                                   alt="avatar"
                              />
                              <Col>
                                   <h5>{props.userName}</h5>
                                   <p className="font-weight-light desc">{props.designation}</p>
                              </Col>
                              <div className="d-flex flex-row-reverse mr-3 p-2">
                                   <ActionButton action1="Edit" action2="Delete" />
                                   <p className="mr-3">Updated: {getDate(Date.parse(props.updatedOn))}</p>
                              </div>
                         </Row>
                         <Card.Text>
                              <h6>{name}</h6>
                              <div className="mt-1" dangerouslySetInnerHTML={{ __html: props.note }}></div>
                         </Card.Text>

                         <Card.Body>
                              <div className="d-flex">
                                   <InputGroup className="mb-1">
                                        <FormControl
                                             aria-describedby="basic-addon1"
                                             placeholder="Add Comment..."
                                             ref={comment}
                                        />
                                        <InputGroup.Prepend>
                                             <Button
                                                  variant="outline-secondary"
                                                  onClick={(e: any) => {
                                                       console.log(props.id);
                                                       //e.preventDefault();
                                                       addComment(comment.current.value);
                                                  }}
                                             >
                                                  Add
                                             </Button>
                                        </InputGroup.Prepend>
                                   </InputGroup>
                              </div>
                         </Card.Body>

                         {props.comments.map((e) => {
                              return (
                                   <Card.Body className="cardBorder">
                                        <Row>
                                             <img
                                                  src="/assets/avatar-1.jpg"
                                                  height="40"
                                                  className="rounded-circle ml-1 mr-1"
                                                  alt="avatar"
                                             />
                                             <Col>
                                                  <h5>{e.users_permissions_user.username}</h5>
                                             </Col>
                                             <div className="d-flex flex-row-reverse mr-3 p-2">
                                                  <ActionButton action1="Edit" action2="Delete" />
                                                  <p className="mr-3">
                                                       Updated: {getDate(Date.parse(props.updatedOn))}
                                                  </p>
                                             </div>
                                        </Row>
                                        <Card.Text className="ml-3">{e.comment}</Card.Text>
                                   </Card.Body>
                              );
                         })}
                    </Card.Body>
               </Card>
          </div>
     );
}

export default CardComp;
