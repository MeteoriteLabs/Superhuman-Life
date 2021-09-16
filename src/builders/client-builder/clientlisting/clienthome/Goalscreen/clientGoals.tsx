import { Row, Button } from "react-bootstrap";
import { useRef } from "react";
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import GoalCard from "./Card";
import MilestoneCard from "./MilestoneCard";
import CreateGoal from "./addGoal";
import CreateMovement from "./addMovement";
import CreateHealth from "./addHealth";
import CreateNutrition from "./addNutrition";
import { GET_GOALS } from "./queries";
import { useQuery } from "@apollo/client";

function Goals() {
     const CreateGoalComponent = useRef<any>(null);
     const CreateHealthComponent = useRef<any>(null);
     const CreateNutritionComponent = useRef<any>(null);
     const CreateMovementComponent = useRef<any>(null);

     const last = window.location.pathname.split("/").pop();

     var settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
          responsive: [
               {
                    breakpoint: 1350,
                    settings: {
                         slidesToShow: 2,
                         slidesToScroll: 2,
                         infinite: true,
                         dots: true,
                    },
               },
               {
                    breakpoint: 600,
                    settings: {
                         slidesToShow: 1,
                         slidesToScroll: 1,
                         initialSlide: 1,
                    },
               },
          ],
     };
     function getDate(time: any) {
          let dateObj = new Date(time);
          let month = dateObj.getMonth() + 1;
          let year = dateObj.getFullYear();
          let date = dateObj.getDate();

          return `${date}-${month}-${year}`;
     }

     const { data }: any = useQuery(GET_GOALS, { variables: { id: last } });

     return (
          <div>
               <div>
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Goals</h5>
                              <div>
                                   <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => {
                                             CreateGoalComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> New Goal
                                   </Button>
                                   <CreateGoal ref={CreateGoalComponent}></CreateGoal>
                              </div>
                         </Row>
                    </div>
                    <div className="w-95 ml-5 mr-5 mt-3">
                         <Slider {...settings}>
                              {data &&
                                   [...data.userGoals].map((Detail) => {
                                        return (
                                             <GoalCard
                                                  goalName={Detail.goals[0].name}
                                                  startDate={getDate(Date.parse(Detail.start))}
                                                  endDate={getDate(Date.parse(Detail.end))}
                                                  updatedBy={Detail.assignedBy[0].username}
                                                  updatedOn={getDate(Date.parse(Detail.updatedAt))}
                                             />
                                        );
                                   })}
                         </Slider>
                    </div>
               </div>
               <div className="mt-4">
                    <div className="border rounded border-dark bg-secondary pt-1 mb-2">
                         <Row className="d-flex justify-content-between mr-4 ml-1">
                              <h5 className="text-white font-weight-bold ml-3 p-1 ">Milestones</h5>
                              <div className="m-1">
                                   <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => {
                                             CreateNutritionComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> New Nutrition
                                   </Button>
                                   <CreateNutrition ref={CreateNutritionComponent}></CreateNutrition>
                              </div>
                              <div className="m-1">
                                   <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => {
                                             CreateHealthComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> New Health
                                   </Button>
                                   <CreateHealth ref={CreateHealthComponent}></CreateHealth>
                              </div>
                              <div className="m-1">
                                   <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => {
                                             CreateMovementComponent.current.TriggerForm({
                                                  id: null,
                                                  type: "create",
                                             });
                                        }}
                                   >
                                        <i className="fas fa-plus-circle"></i> New Movement
                                   </Button>
                                   <CreateMovement ref={CreateMovementComponent}></CreateMovement>
                              </div>
                         </Row>
                    </div>
                    <div className="w-95 ml-5 mr-5 mt-3">
                         {/* slider */}
                         <Slider {...settings}>
                              <MilestoneCard />
                              <MilestoneCard />
                              <MilestoneCard />
                              <MilestoneCard />
                              <MilestoneCard />
                              <MilestoneCard />
                              <MilestoneCard />
                         </Slider>
                    </div>
               </div>
          </div>
     );
}

export default Goals;
