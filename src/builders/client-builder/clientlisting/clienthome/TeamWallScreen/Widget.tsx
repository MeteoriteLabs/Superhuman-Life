import React, { useState } from "react";
import { Form, Col, Row } from "react-bootstrap";
import Editor from "./textEditor";

function Widget() {
     const [editor, setEditor] = useState<any>(false);
     const [rating, setRating] = useState<any>(false);
     const [value, setValue] = useState<any>();

     function handleChange(e) {
          setValue(e.target.id);
          console.log(e.target.id);
     }
     function handleMoodChange(e) {
          console.log(e.target.id);
     }
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
                    <Col className="mt-2">
                         <div className="mt-4">
                              <h5>Rate Of Perceived Excertion</h5>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <div>
                                        <Form.Check
                                             type="radio"
                                             label="Extremely light"
                                             name="formHorizontalRadios"
                                             id="extremelylight"
                                             onChange={(e) => {
                                                  handleChange(e);
                                             }}
                                        />
                                   </div>

                                   {value === "extremelylight" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">like light stretching</p>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <div>
                                        <Form.Check
                                             type="radio"
                                             label="Very light"
                                             name="formHorizontalRadios"
                                             id="verylight"
                                             onChange={(e) => {
                                                  handleChange(e);
                                             }}
                                        />
                                   </div>

                                   {value === "verylight" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">like walking slowly</p>
                                        </div>
                                   ) : (
                                        " "
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Light"
                                        name="formHorizontalRadios"
                                        id="light"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />
                                   {value === "light" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">moving around, but breathing</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Moderate"
                                        name="formHorizontalRadios"
                                        id="moderate"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />

                                   {value === "moderate" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">light workout, but can talk</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Considerable"
                                        name="formHorizontalRadios"
                                        id="considerable"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />

                                   {value === "considerable" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold"> Heavier breathing, heart rate up</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Challenging"
                                        name="formHorizontalRadios"
                                        id="challenging"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />

                                   {value === "challenging" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">breathing hard, not talking much</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Hard"
                                        name="formHorizontalRadios"
                                        id="hard"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />

                                   {value === "hard" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">tough workout, hard to talk</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Very hard"
                                        name="formHorizontalRadios"
                                        id="veryhard"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />
                                   {value === "veryhard" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">breathing very heard, whole body tired</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Extremely hard"
                                        name="formHorizontalRadios"
                                        id="extremelyhard"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />
                                   {value === "extremelyhard" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">almost maxed out, not talking</p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>
                         <div className="mb-1">
                              <Row className="ml-1">
                                   <Form.Check
                                        type="radio"
                                        label="Max effort"
                                        name="formHorizontalRadios"
                                        id="maxeffort"
                                        onChange={(e) => {
                                             handleChange(e);
                                        }}
                                   />

                                   {value === "maxeffort" ? (
                                        <div className="ml-3">
                                             <p className="font-weight-bold">
                                                  Feels impossible to continue, unable to talk
                                             </p>
                                        </div>
                                   ) : (
                                        ""
                                   )}
                              </Row>
                         </div>

                         <div className="mt-4">
                              <h5>Mood Of Person</h5>
                         </div>
                         <div className="mb-1">
                              <Form.Check
                                   type="radio"
                                   label="Angry"
                                   name="Mood"
                                   id="angry"
                                   onChange={(e) => {
                                        handleMoodChange(e);
                                   }}
                              />
                              <Form.Check
                                   type="radio"
                                   label="Upset"
                                   name="Mood"
                                   id="upset"
                                   onChange={(e) => {
                                        handleMoodChange(e);
                                   }}
                              />
                              <Form.Check
                                   type="radio"
                                   label="Neutral"
                                   name="Mood"
                                   id="neutral"
                                   onChange={(e) => {
                                        handleMoodChange(e);
                                   }}
                              />
                              <Form.Check
                                   type="radio"
                                   label="Happy"
                                   name="Mood"
                                   id="happy"
                                   onChange={(e) => {
                                        handleMoodChange(e);
                                   }}
                              />
                              <Form.Check
                                   type="radio"
                                   label="Excited"
                                   name="Mood"
                                   id="excited"
                                   onChange={(e) => {
                                        handleMoodChange(e);
                                   }}
                              />
                         </div>
                    </Col>
               ) : (
                    ""
               )}
          </div>
     );
}

export default Widget;
