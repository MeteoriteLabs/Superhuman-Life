import { Card, Col, Row, FormControl, InputGroup, Button } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
import "./Styles.css";
function CardComp() {
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
                                   <h5>User Name</h5>
                                   <p className="font-weight-light desc">Nutritionist</p>
                              </Col>
                              <div className="d-flex flex-row-reverse mr-3 p-2">
                                   <ActionButton action1="Edit" action2="Delete" />
                                   <p className="mr-3">Updated On: 12-07-21</p>
                              </div>
                         </Row>
                         <Card.Title>Special title treatment</Card.Title>
                         <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                    </Card.Body>
                    <hr />

                    <Card.Body>
                         <div className="d-flex">
                              <img
                                   src="/assets/avatar-1.jpg"
                                   height="40"
                                   className="rounded-circle ml-2 mr-2"
                                   alt="avatar"
                              />

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
