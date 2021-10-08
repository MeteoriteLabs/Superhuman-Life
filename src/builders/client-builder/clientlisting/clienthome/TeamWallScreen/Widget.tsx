import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Editor from "./textEditor";
import { GET_FITNESSSCALE, GET_MOODSCALE } from "./queries";
import { useQuery } from "@apollo/client";
import Rating from "./Rating";

function Widget(props: any) {
     const [editor, setEditor] = useState<any>(false);
     const [rating, setRating] = useState<any>(false);
     const [value, setValue] = useState<any>();
     const [value2, setValue2] = useState<any>();
     const [render, setRender] = useState<any>();
     const [icon, setIcon] = useState<any>();
     const [rate1, setRate1] = useState<any>();
     const [img, setImg] = useState<any>();
     const [data, setData] = useState<any>();

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
                         <Editor onChange={props.onChange} value1={value} value2={value2} sendValue={setData} />
                    </div>
               ) : (
                    " "
               )}
               {rating ? (
                    <div className="">
                         <Rating
                              heading1="Rate of Perceived Exertion"
                              min1={1}
                              max1={rate1.length}
                              value1={value}
                              handleChange1={handleChange}
                              title1={render}
                              heading2="Mood Status"
                              min2={1}
                              max2={img.length}
                              value2={value2}
                              handleChange2={handleMoodChange}
                              icon={icon}
                              onChange={props.onChange}
                              editorData={data}
                         />
                    </div>
               ) : (
                    ""
               )}
          </div>
     );
}

export default Widget;
