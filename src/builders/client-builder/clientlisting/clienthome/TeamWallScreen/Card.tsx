import { Card, Col, Row, FormControl, InputGroup, Button } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import "./Styles.css";
function CardComp(props: any) {
     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}-${month}-${year}`;
     }
     return (
          <div>
               <Card border="primary" className="mt-3">
                    <Card.Body>
                         <Row>
                              <img
                                   src="/assets/avatar-1.jpg"
                                   height="50"
                                   className="rounded-circle ml-2 mt-2"
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
                              <div dangerouslySetInnerHTML={{ __html: props.note }}></div>
                         </Card.Text>
                         {props.comments.map((e) => {
                              return (
                                   <Card.Body>
                                        <hr />
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
                    <hr />

                    <Card.Body>
                         <div className="d-flex">
                              <InputGroup className="mb-2">
                                   <FormControl aria-describedby="basic-addon1" placeholder="Add Comment..." />
                                   <InputGroup.Prepend>
                                        <Button variant="outline-secondary" onClick={(e: any) => {}}>
                                             Add
                                        </Button>
                                   </InputGroup.Prepend>
                              </InputGroup>
                         </div>
                    </Card.Body>
               </Card>
          </div>
     );
}

export default CardComp;
