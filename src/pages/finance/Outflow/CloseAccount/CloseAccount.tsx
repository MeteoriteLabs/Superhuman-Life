import React from 'react';
import Form from "@rjsf/core";
import { schema } from "./CloseAccountSchema";

function CloseAccount() {
    const closeAccountJson: { [name: string]: any } = require("./CloseAccount.json");

    return (
        <div>
            <div style={{ background: '#0D6EBA' }} className="p-4">
                <h4 className='text-light'>Basic Details</h4>
            </div>
            <div className='p-5'>
                <Form
                    uiSchema={schema}
                    schema={closeAccountJson}
                    // ref={formRef}
                    // onSubmit={(frm: any) => { OnSubmit(frm) }}
                    // formData={emptyPayeeDetails}
                    
                />
            </div>

        </div>
    )
}

export default CloseAccount;
