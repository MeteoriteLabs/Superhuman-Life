import { Card, Col, Row, FormControl, InputGroup, Button } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import CreatePost from "./addPost";
import { ADD_COMMENT, GET_TAGNAME, GET_RATING_NOTES, GET_FITNESSSCALE, GET_MOODSCALE } from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import "./Styles.css";

function CardComp(props: any) {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);
     const comment = useRef<any>();
     const [name, setName] = useState<any>();
     const [rating, setRating] = useState<any>();
     const [img, setImg] = useState<any>();
     const [rate1, setRate1] = useState<any>();
     const createEditMessageComponent = useRef<any>();

     const actionClick1 = () => {
          //handleRedirect(row.original.id);
     };
     const actionClick2 = () => {
          createEditMessageComponent.current.TriggerForm({
               id: props.id,
               type: "deleteNote",
          });
     };

     const arrayAction = [
          { actionName: "Edit", actionClick: actionClick1 },
          { actionName: "Delete", actionClick: actionClick2 },
     ];

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
     function FetchRating(_variables: {} = { id: props.resourceid, clientid: last }) {
          useQuery(GET_RATING_NOTES, { variables: _variables, onCompleted: loadRating });
     }
     function loadRating(d: any) {
          setRating(d.ratings);
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
     function Fetch() {
          useQuery(GET_FITNESSSCALE, { onCompleted: loadRating2 });
          useQuery(GET_MOODSCALE, { onCompleted: loadMood });
     }

     function loadRating2(data: any) {
          [...data.ratingScales].map((p) => {
               setRate1(p.items);
               return {};
          });
     }
     function loadMood(data: any) {
          [...data.ratingScales].map((p) => {
               setImg(p.items);
               return {};
          });
     }
     Fetch();
     FetchData({ id: props.resourceid });
     FetchRating({ id: props.resourceid, clientid: last });

     // <StatusModal
     //         modalTitle="Delete"
     //         modalBody="Do you want to delete this message?"
     //         buttonLeft="Cancel"
     //         buttonRight="Yes"
     //         onClick={() => {DeleteMessage(operation.id)}}
     //         />

     //deleteComment({ variables: { id: e.id } });
     //deleteNote({ variables: { id: props.id } });
     return (
          <div>
               <CreatePost ref={createEditMessageComponent}></CreatePost>
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
                                   <ActionButton arrayAction={arrayAction}></ActionButton>
                                   <p className="mr-3">Updated: {getDate(Date.parse(props.updatedOn))}</p>
                              </div>
                         </Row>
                         <Card.Text>
                              <div>
                                   <h5>{name}</h5>
                              </div>
                              <div>
                                   <div dangerouslySetInnerHTML={{ __html: props.note }}></div>
                              </div>

                              <Row className="ml-2">
                                   {rating &&
                                        rating.map((d) => {
                                             if (d.type === "rpm") {
                                                  let word = rate1[d.rating - 1];
                                                  let string = word.split("-");
                                                  return (
                                                       <div className="rounded border border-dark p-2">
                                                            <h6 className="ml-2">Rate Of Perceived Exertion</h6>

                                                            <p className="rating1">{string[0]} </p>
                                                            <p>{string[1]}</p>
                                                       </div>
                                                  );
                                             }
                                             if (d.type === "mood") {
                                                  return (
                                                       <div className="rounded border border-dark p-2 rating2">
                                                            <h6 className="ml-3">Mood</h6>
                                                            <img
                                                                 src={`/assets/ratingicons/${img[d.rating - 1]}`}
                                                                 alt=""
                                                            />
                                                       </div>
                                                  );
                                             }
                                             return "";
                                        })}
                              </Row>
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
                              const actionClick1 = () => {
                                   //handleRedirect(row.original.id);
                              };
                              const actionClick2 = () => {
                                   createEditMessageComponent.current.TriggerForm({
                                        id: e.id,
                                        type: "deleteComment",
                                   });
                              };
                              const arrayAction = [
                                   { actionName: "Edit", actionClick: actionClick1 },
                                   { actionName: "Delete", actionClick: actionClick2 },
                              ];
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
                                                  <ActionButton arrayAction={arrayAction}></ActionButton>
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
