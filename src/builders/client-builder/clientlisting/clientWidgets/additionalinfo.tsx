import { useState } from "react";
import { Button } from "react-bootstrap";
import { InputGroup, FormControl, Form } from "react-bootstrap";

function Additionalinfo() {
     const [show, setShow] = useState<any>(false);
     return (
          <>
               <div className="container">
                    <div className="row">
                         <div className="col-*-* p-1">
                              <p className="font-weight-bold">Add Additional Details</p>
                         </div>
                         <div className="col-*-* ml-3">
                              <Button variant={show ? "success" : "danger"} size="sm" onClick={() => setShow(!show)}>
                                   {show ? "On" : "Off"}
                              </Button>
                         </div>
                    </div>
               </div>
               {show && (
                    <>
                         <div>
                              <label style={{ fontSize: 17 }}>Location</label>
                              <InputGroup>
                                   <FormControl
                                        aria-describedby="basic-addon1"
                                        placeholder="Enter Location"
                                        id="location"
                                        onChange={() => {}}
                                        autoComplete="off"
                                   />
                              </InputGroup>
                         </div>

                         <div className="mt-4">
                              <label style={{ fontSize: 17 }}>Date of Birth</label>
                              <InputGroup>
                                   <FormControl
                                        aria-describedby="basic-addon1"
                                        placeholder="Enter Date of Birth"
                                        id="dob"
                                        onChange={() => {}}
                                        autoComplete="off"
                                   />
                              </InputGroup>
                         </div>

                         <div className="mt-4">
                              <Form>
                                   {["radio"].map((type: any) => (
                                        <div key={`inline-${type}`} className="mb-3">
                                             <Form.Check
                                                  inline
                                                  label="Male"
                                                  name="name"
                                                  type={type}
                                                  id={`inline-${type}-1`}
                                             />
                                             <Form.Check
                                                  inline
                                                  label="Female"
                                                  name="name"
                                                  type={type}
                                                  id={`inline-${type}-2`}
                                             />
                                             <Form.Check
                                                  inline
                                                  label="Doesn't Matter"
                                                  name="name"
                                                  type={type}
                                                  id={`inline-${type}-3`}
                                             />
                                        </div>
                                   ))}
                              </Form>
                         </div>

                         <div className="mt-4">
                              <label style={{ fontSize: 17 }}>Height (cm)</label>
                              <InputGroup>
                                   <FormControl
                                        aria-describedby="basic-addon1"
                                        placeholder="Enter Height"
                                        id="height"
                                        onChange={() => {}}
                                        autoComplete="off"
                                   />
                              </InputGroup>
                         </div>

                         <div className="mt-4">
                              <label style={{ fontSize: 17 }}>Weight (kg)</label>
                              <InputGroup>
                                   <FormControl
                                        aria-describedby="basic-addon1"
                                        placeholder="Enter Weight"
                                        id="weight"
                                        onChange={() => {}}
                                        autoComplete="off"
                                   />
                              </InputGroup>
                         </div>
                    </>
               )}
          </>
     );
}

export default Additionalinfo;
