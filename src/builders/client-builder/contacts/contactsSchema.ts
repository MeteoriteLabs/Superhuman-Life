import PhoneEmailInput from "./PhoneEmailInput";

export const widgets = {
    emailAndPhone: PhoneEmailInput,
};
interface Schema {
    firstname: {
        'ui:placeholder': string;
    };
    lastname: {
        'ui:placeholder': string;
    };
    nameOfPayee: {
        'ui:placeholder': string;
    };
    gstNumber: {
        'ui:placeholder': string;
    };
    houseNumber: {
        'ui:placeholder': string;
    };
    address1: {
        'ui:placeholder': string;
    };
    address2: {
        'ui:placeholder': string;
    };
    city: {
        'ui:placeholder': string;
    };
    state: {
        'ui:placeholder': string;
    };
    country: {
        'ui:placeholder': string;
    };
    zipcode: {
        'ui:placeholder': string;
    };
    gst: {
        'ui:placeholder': string;
    };
    organisationName: {
        'ui:placeholder': string;
    };
    organisationEmail: {
        'ui:placeholder': string;
    };
    typeOfPayee: {
        'ui:widget': string;
        'ui:placeholder': string;
        'ui:options': {
            inline: boolean;
        };
    };
    appDownloadStatus: {
        'ui:widget': string;
        'ui:options': {
            inline: boolean;
        };
    };
    organisationDetails: {
        'ui:widget': string;
        'ui:options': {
            inline: boolean;
        };
    };
    isPayee: {
        'ui:widget': 'radio';
        'ui:options': {
            inline: boolean;
        };
    };
    emailAndPhone: {
        'ui:widget': 'emailAndPhone';
    };


}
export const schema: Schema = {
    firstname: {
        'ui:placeholder': 'Enter First Name'
    },
    lastname: {
        'ui:placeholder': 'Enter Last Name'
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
    },
    emailAndPhone: {
        'ui:widget': 'emailAndPhone'
    }
};
