import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Editor from "./textEditor";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { GET_FITNESSSCALE, GET_MOODSCALE } from "./queries";
import { useQuery } from "@apollo/client";

function Widget() {
     const [editor, setEditor] = useState<any>(false);
     const [rating, setRating] = useState<any>(false);
     const [value, setValue] = useState<any>();
     const [value2, setValue2] = useState<any>();
     const [render, setRender] = useState<any>();
     const [icon, setIcon] = useState<any>();
     const [rate1, setRate1] = useState<any>();
     const [img, setImg] = useState<any>();

     function handleChange(e) {
          setValue(e);
          setRender(rate1[e - 1]);
     }

     function handleMoodChange(e) {
          setValue2(e);
          setIcon(img[e - 1]);
     }

     function Fetch() {
          useQuery(GET_FITNESSSCALE, { onCompleted: loadRating });
          useQuery(GET_MOODSCALE, { onCompleted: loadMood });
     }

     function loadRating(data: any) {
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
     return (
          <div>
               <div className="d-flex">
                    <div>
                         <Form.Group controlId="formBasicCheckbox">
                              <Form.Check type="checkbox" label="Notes" onChange={() => setEditor(!editor)} />
                         </Form.Group>
                    </div>
                    <div className="ml-3">
                         <Form.Group controlId="formBasicCheckbox">
                              <Form.Check type="checkbox" label="Rating" onChange={() => setRating(!rating)} />
                         </Form.Group>
                    </div>
               </div>
               {editor ? (
                    <div className="mt-2">
                         <Editor />
                    </div>
               ) : (
                    " "
               )}
               {rating ? (
                    <div className="mt-3">
                         <div>
                              <h5>Rate of Perceived Exertion</h5>
                              <div className="slider w-75 ml-1">
                                   <Slider min={1} max={rate1.length} value={value} onChange={handleChange} />
                                   <p className="">{render}</p>
                              </div>
                         </div>
                         <div>
                              <h5>Mood Status</h5>
                              <div className="slider w-75 ml-1">
                                   <Slider min={1} max={img.length} value={value2} onChange={handleMoodChange} />
                                   <img src={`/assets/ratingicons/${icon}`} alt="" />
                              </div>
                         </div>
                    </div>
               ) : (
                    ""
               )}
          </div>
     );
}

export default Widget;
