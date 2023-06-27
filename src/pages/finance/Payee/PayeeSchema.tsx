import ContactList from '../../../components/customWidgets/ContactList';
import Changemaker from '../../../components/customWidgets/Changemakers';

export const widgets = {
    contactList: ContactList,
    changemaker: Changemaker
};
// eslint-disable-next-line
export const schema: any = {
    PaymentCategory: {
        'ui:help': 'Select payment category'
    },
    PaymentMode: {
        'ui:widget': 'checkboxes'
    },
    accountType: {
        'ui:widget': 'select'
    },
    PayeeName: {
        'ui:placeholder': "Enter Payee's name"
    },
    Email: {
        'ui:placeholder': "Enter Payee's email address"
    },
    GSTNumber: {
        'ui:placeholder': 'Enter GST number'
    },
    Phone_Number: {
        'ui:placeholder': "Enter Payee's contact number"
    },
    organisationName: {
        'ui:placeholder': 'Enter Organisation Name'
    },
    PayeeFirstName: {
        'ui:placeholder': "Enter Payee's First Name"
    },
    PayeeLastName: {
        'ui:placeholder': "Enter Payee's Last Name"
    },
    gstNumber: {
        'ui:placeholder': 'Enter GST number'
    },
    houseNumber: {
        'ui:placeholder': 'Enter House number'
    },
    address1: {
        'ui:placeholder': 'Enter address 1'
    },
    address2: {
        'ui:placeholder': 'Enter address 2'
    },
    city: {
        'ui:placeholder': 'Enter your city'
    },
    state: {
        'ui:placeholder': 'Enter your state'
    },
    country: {
        'ui:placeholder': 'Enter your country name'
    },
    zipcode: {
        'ui:placeholder': "Enter your area's Zipcode"
    },
    gst: {
        'ui:placeholder': "Enter your organisation's GST Number"
    },
    organisationEmail: {
        'ui:placeholder': 'Enter Organisation email address'
    },
    PayeeCategory: {
        'ui:widget': 'radio',
        'ui:help': 'Select all contact if contact already exist or select new to create new payee',
        'ui:options': {
            inline: true
        }
    },
    searchContact: {
        'ui:widget': 'contactList',
        'ui:help': 'Select Contact'
    },
    FrequencyOfPayment: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    provideBreakdown: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    amountToBePaid: {
        'ui:placeholder': 'Enter Amount'
    },
    basicPay: {
        'ui:placeholder': 'Enter Basic Pay'
    },
    HRA: {
        'ui:placeholder': 'Enter HRA or HRR'
    },
    Gratuity: {
        'ui:placeholder': 'Enter Gratuity'
    },
    LTA: {
        'ui:placeholder': 'Enter LTA'
    },
    ESI: {
        'ui:placeholder': 'Enter ESI'
    },
    MedicalReimbursement: {
        'ui:placeholder': 'Enter Medical Reimbursement'
    },
    ChildCare: {
        'ui:placeholder': 'Enter Child Care'
    },
    SpecialAllowance: {
        'ui:placeholder': 'Enter Special Allowance'
    },
    ProfessionalTax: {
        'ui:placeholder': 'Enter Professional Tax'
    },
    TDS: {
        'ui:placeholder': 'Enter TDS'
    },
    ProvidentFund: {
        'ui:placeholder': 'Enter Provident Fund'
    },
    AccountNumber: {
        'ui:placeholder': "Enter Payee's Account Number "
    },
    ifscCode: {
        'ui:placeholder': 'Enter the IFSC Code'
    },
    BankName: {
        'ui:placeholder': 'Enter the name of the Bank'
    },
    Branch: {
        'ui:placeholder': 'Enter the bank branch'
    },
    UPI_ID: {
        'ui:placeholder': "Enter Payee's UPI ID"
    },
    upiPhoneNumber: {
        'ui:placeholder': "Enter Payee's UPI phone number"
    },
    searchChangemaker: {
        'ui:widget': 'changemaker',
        'ui:help': 'Select Changemaker'
    }
};
