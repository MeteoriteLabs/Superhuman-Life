import React from 'react';
import Form from "@rjsf/core";
import { schema, widgets } from "./PayeePaymentModeSchema";

function PayeePaymentMode() {
  const payeePaymentModeJson: { [name: string]: any } = require("./PayeePaymentMode.json");
  return (
    <div>
      <div style={{background: '#0D6EBA'}} className="p-4">
        <h4 className='text-light'>Payee Payment Mode</h4>
      </div>
      <div className='p-5'>
      <Form
          uiSchema={schema}
          schema={payeePaymentModeJson}
          // ref={formRef}
          // onSubmit={(frm: any) => { OnSubmit(frm) }}
          // formData={emptyPayeeDetails}
          widgets={widgets}
        />
        </div>

    </div>

  )
}

export default PayeePaymentMode;
