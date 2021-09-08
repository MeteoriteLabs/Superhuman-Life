import { Row, Button, Carousel } from "react-bootstrap";
function Goals() {
     return (
          <div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Goals</h5>
                              <div>
                                   <Button variant="outline-light" size="sm" onClick={() => {}}>
                                        <i className="fas fa-plus-circle"></i> New Goal
                                   </Button>
                              </div>
                         </Row>
                    </div>
                    <div className="border rounded border-dark">
                         <Carousel>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />
                                   <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />
                                   <Carousel.Caption>
                                        <h3>Second slide label</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />

                                   <Carousel.Caption>
                                        <h3>Third slide label</h3>
                                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                         </Carousel>
                    </div>
               </div>
               <div className="mt-4">
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Milestones</h5>
                              <div>
                                   <Button variant="outline-light" size="sm" onClick={() => {}}>
                                        <i className="fas fa-plus-circle"></i> New Nutrition
                                   </Button>
                              </div>
                              <div>
                                   <Button variant="outline-light" size="sm" onClick={() => {}}>
                                        <i className="fas fa-plus-circle"></i> New Health
                                   </Button>
                              </div>
                              <div>
                                   <Button variant="outline-light" size="sm" onClick={() => {}}>
                                        <i className="fas fa-plus-circle"></i> New Movement
                                   </Button>
                              </div>
                         </Row>
                    </div>
                    <div className="border rounded border-dark">
                         <Carousel>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />
                                   <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />
                                   <Carousel.Caption>
                                        <h3>Second slide label</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                              <Carousel.Item>
                                   <img
                                        width={800}
                                        height={300}
                                        className="d-block w-100"
                                        src="/assets/background.svg"
                                        alt="First slide"
                                   />

                                   <Carousel.Caption>
                                        <h3>Third slide label</h3>
                                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                   </Carousel.Caption>
                              </Carousel.Item>
                         </Carousel>
                    </div>
               </div>
          </div>
     );
}

export default Goals;
