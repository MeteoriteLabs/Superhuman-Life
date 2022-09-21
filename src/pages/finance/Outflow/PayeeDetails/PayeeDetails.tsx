import React from 'react';
// import { useState, useContext, useRef } from 'react';
import Form from "@rjsf/core";
import { schema, widgets } from "./PayeeDetailsSchema";
// import AuthContext from "../../../../context/auth-context";
// import { useMutation, useQuery } from "@apollo/client";
// import { flattenObj } from "../../../../components/utils/responseFlatten";
// import Toaster from '../../../../components/Toaster';

function PayeeDetails() {
  const payeeDetailsJson: { [name: string]: any } = require("./PayeeDetails.json");
  return (
    <div>
      <div style={{background: '#0D6EBA'}} className="p-4">
        <h4 className='text-light'>Basic Details</h4>
      </div>
      <div className='p-5'>
      <Form
          uiSchema={schema}
          schema={payeeDetailsJson}
          // ref={formRef}
          // onSubmit={(frm: any) => { OnSubmit(frm) }}
          // formData={emptyPayeeDetails}
          widgets={widgets}
        />
        </div>

    </div>

  )
}

export default PayeeDetails;
