export const schema: any = {
    firstname: {
        'ui:placeholder': 'Enter First Name'
    },
    lastname: {
        'ui:placeholder': 'Enter Last Name'
    },
    phone: {
        'ui:placeholder': 'Enter Phone Number'
    },
    email: {
        'ui:placeholder': 'Enter Email address'
    },
    nameOfPayee: {
        'ui:placeholder': 'Enter Payee name'
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
    organisationName: {
        'ui:placeholder': 'Enter Organisation Name'
    },
    organisationEmail: {
        'ui:placeholder': 'Enter Organisation email address'
    },
    typeOfPayee: {
        'ui:widget': 'radio',
        'ui:placeholder': 'Individual',
        'ui:options': {
            inline: true
        }
    },
    appDownloadStatus: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    organisationDetails: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    isPayee: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    }
}
