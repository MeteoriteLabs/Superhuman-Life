import { Card, Col, Row, FormControl, InputGroup, Button } from "react-bootstrap";
import ActionButton from "../../../../../components/actionbutton/index";
function CardComp() {
     return (
          <div>
               <Card border="primary" className="mt-3">
                    <Card.Header>
                         <Row>
                              <img
                                   src="/assets/avatar-1.jpg"
                                   height="60"
                                   className="rounded-circle ml-3"
                                   alt="avatar"
                              />
                              <Col>
                                   <h5>User Name</h5>
                                   <p>Nutritionist</p>
                              </Col>
                              <div className="d-flex flex-row-reverse mr-3 p-2">
                                   <ActionButton action1="Edit" action2="Delete" />
                              </div>
                         </Row>
                    </Card.Header>
                    <Card.Body>
                         <Card.Title>Special title treatment</Card.Title>
                         <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                         <div className="d-flex">
                              <img
                                   src="/assets/avatar-1.jpg"
                                   height="40"
                                   className="rounded-circle ml-2 mr-2"
                                   alt="avatar"
                              />

                              <InputGroup className="mb-2">
                                   <FormControl aria-describedby="basic-addon1" placeholder="Search" />
                                   <InputGroup.Prepend>
                                        <Button variant="outline-secondary" onClick={(e: any) => {}}>
                                             Add
                                        </Button>
                                   </InputGroup.Prepend>
                              </InputGroup>
                         </div>
                    </Card.Footer>
               </Card>
               <p>Updated On 12-07-21</p>
          </div>
     );
}

export default CardComp;
