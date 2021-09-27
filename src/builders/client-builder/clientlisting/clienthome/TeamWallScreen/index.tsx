import { useRef } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import CardComp from "./Card";
import CreatePost from "./addPost";

function Index() {
     const CreatePostComponent = useRef<any>(null);
     return (
          <div>
               <div className="d-flex flex-row-reverse mr-3 p-2">
                    <Button
                         variant="btn btn-light"
                         onClick={() => {
                              CreatePostComponent.current.TriggerForm({
                                   id: null,
                                   type: "create",
                              });
                         }}
                    >
                         <i className="fas fa-plus-circle"></i> Post
                    </Button>
                    <CreatePost ref={CreatePostComponent}></CreatePost>
               </div>
               <Card>
                    <Card.Header>
                         <h5>Changemakers</h5>
                    </Card.Header>

                    <Card.Body>
                         <Row>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                              <Col>
                                   <img
                                        src="/assets/avatar-1.jpg"
                                        height="50"
                                        className="rounded-circle ml-3"
                                        alt="avatar"
                                   />
                                   <p>CoachName</p>
                              </Col>
                         </Row>
                    </Card.Body>
               </Card>
               <CardComp />
               <CardComp />
          </div>
     );
}

export default Index;
