export const schema: any = {
    PaymentMode: {
        "ui:widget": "checkboxes"
    },
    accountType: {
        "ui:widget": "select"
    },
    PayeeName: {
        "ui:placeholder": "Enter Payee name"
    },
    Email: {
        "ui:placeholder": "Enter Payee's email address"
    },
    GSTNumber: {
        "ui:placeholder": "Enter GST number"
    },
    Phone_Number: {
        "ui:placeholder": "Enter Payee's contact number"
    },
    organisationName: {
        "ui:placeholder": "Enter Organisation Name"
    },
    TypeofPayee: {
        "ui:widget": "radio",
        "ui:placeholder": "Individual",
        "ui:options": {
            "inline": true
        }
    },
    PayeeCategory: {
        "ui:widget": "radio",
        "ui:options": {
            "inline": true
        }
    },
    FrequencyOfPayment: {
        "ui:widget": "radio",
        "ui:options": {
            "inline": true
        }
    },
    provideBreakdown: {
        "ui:widget": "radio",
        "ui:options": {
            "inline": true
        }
    },
    amountToBePaid: {
        "ui:placeholder": "Enter Amount"
    },
    basicPay: {
        "ui:placeholder": "Enter Basic Pay"
    },
    HRA: {
        "ui:placeholder": "Enter HRA or HRR"
    },
    Gratuity: {
        "ui:placeholder": "Enter Gratuity"
    },
    LTA: {
        "ui:placeholder": "Enter LTA"
    },
    ESI: {
        "ui:placeholder": "Enter ESI"
    },
    MedicalReimbrusement: {
        "ui:placeholder": "Enter Medical Reimbrusement"
    },
    ChildCare: {
        "ui:placeholder": "Enter Child Care"
    },
    SpecialAllowance: {
        "ui:placeholder": "Enter Special Allowance"
    },
    ProfessionalTax: {
        "ui:placeholder": "Enter Professional Tax"
    },
    TDS: {
        "ui:placeholder": "Enter TDS"
    },
    ProvidentFund: {
        "ui:placeholder": "Enter Provident Fund"
    }
};
