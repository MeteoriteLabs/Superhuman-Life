import { Row, Button } from "react-bootstrap";
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

function Goals() {
     var settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
          responsive: [
               {
                    breakpoint: 1024,
                    settings: {
                         slidesToShow: 3,
                         slidesToScroll: 3,
                         infinite: true,
                         dots: true,
                    },
               },
               {
                    breakpoint: 600,
                    settings: {
                         slidesToShow: 2,
                         slidesToScroll: 2,
                         initialSlide: 2,
                    },
               },
               {
                    breakpoint: 480,
                    settings: {
                         slidesToShow: 1,
                         slidesToScroll: 1,
                    },
               },
          ],
     };
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
                    <div className="w-80 ml-5 mr-5">
                         {/* slider */}
                         <Slider {...settings}>
                              <div>
                                   <h3>1</h3>
                              </div>
                              <div>
                                   <h3>2</h3>
                              </div>
                              <div>
                                   <h3>3</h3>
                              </div>
                              <div>
                                   <h3>4</h3>
                              </div>
                              <div>
                                   <h3>5</h3>
                              </div>
                              <div>
                                   <h3>6</h3>
                              </div>
                              <div>
                                   <h3>7</h3>
                              </div>
                              <div>
                                   <h3>8</h3>
                              </div>
                         </Slider>
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
                    <div className="border rounded border-dark">{/* slider */}</div>
               </div>
          </div>
     );
}

export default Goals;
