import React from "react";
import { Form } from "react-bootstrap";
function Widget() {
     return (
          <div>
               <div className="d-flex">
                    <div>
                         <Form.Group controlId="formBasicCheckbox">
                              <Form.Check type="checkbox" label="Rating" />
                         </Form.Group>
                    </div>
                    <div className="ml-3">
                         <Form.Group controlId="formBasicCheckbox">
                              <Form.Check type="checkbox" label="Notes" />
                         </Form.Group>
                    </div>
               </div>
          </div>
     );
}

export default Widget;
