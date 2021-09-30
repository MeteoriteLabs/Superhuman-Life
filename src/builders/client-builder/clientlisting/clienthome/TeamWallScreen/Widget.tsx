import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Editor from "./textEditor";

function Widget() {
     const [editor, setEditor] = useState<any>(false);
     const [rating, setRating] = useState<any>(false);

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
                         <p>Rating</p>
                    </div>
               ) : (
                    ""
               )}
          </div>
     );
}

export default Widget;
