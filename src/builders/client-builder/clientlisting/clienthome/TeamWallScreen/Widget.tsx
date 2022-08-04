import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Editor from "./textEditor";
import { GET_FITNESSSCALE_NEW, GET_MOODSCALE_NEW } from "./queries";
import { useQuery } from "@apollo/client";
import Rating from "./Rating";
import {flattenObj} from '../../../../../components/utils/responseFlatten';

function Widget(props: any) {
     let Data = props.value !== undefined && JSON.parse(props.value);
     const [editor, setEditor] = useState<any>(false);
     const [rating, setRating] = useState<any>(false);
     const [rate1, setRate1] = useState<any>();
     const [img, setImg] = useState<any>();
     const [value, setValue] = useState<any>(props.value ? Data.rpm.rating : "");
     const [value2, setValue2] = useState<any>(props.value ? Data.mood.rating : "");
     const [render, setRender] = useState<any>();
     const [icon, setIcon] = useState<any>();

     const [data, setData] = useState<any>();
     const [id1, setId1] = useState<any>();
     const [id2, setId2] = useState<any>();

     function handleChange(e) {
          setValue(e);
          setRender(rate1[e - 1]);
     }

     function handleMoodChange(e) {
          setValue2(e);
          setIcon(img[e - 1]);
     }

     function Fetch() {
          useQuery(GET_MOODSCALE_NEW, { onCompleted: loadRating });
          useQuery(GET_FITNESSSCALE_NEW, { onCompleted: loadMood });
     }

     function loadRating(data: any) {
          const flattenData = flattenObj({ ...data });
          [...flattenData.ratingScales].map((p) => {
               setRate1(p.items);
               setId1(p.id);
               return {};
          });
     }
     function loadMood(data: any) {
          const flattenData = flattenObj({ ...data });
          [...flattenData.ratingScales].map((p) => {
               setImg(p.items);
               setId2(p.id);
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
                         <Editor
                              onChange={props.onChange}
                              value1={value}
                              value2={value2}
                              sendValue={setData}
                              value={props.value ? Data.note : ""}
                         />
                    </div>
               ) : (
                    " "
               )}
               {rating ? (
                    <div className="">
                         <Rating
                              heading1="Rate of Perceived Exertion"
                              min1={1}
                              max1={rate1?.length}
                              value1={value}
                              handleChange1={handleChange}
                              title1={render}
                              heading2="Mood Status"
                              min2={1}
                              max2={img?.length}
                              value2={value2}
                              handleChange2={handleMoodChange}
                              icon={icon}
                              onChange={props.onChange}
                              editorData={data}
                              moodId={id2}
                              rpmId={id1}
                         />
                    </div>
               ) : (
                    ""
               )}
          </div>
     );
}

export default Widget;
