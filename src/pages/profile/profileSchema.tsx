import UploadImageToS3WithNativeSdk from '../../components/upload/upload';

export const widgets = {
    uploadImageToS3WithNativeSdk: UploadImageToS3WithNativeSdk
};

// eslint-disable-next-line
export const schema: any = {
    Institute_Name: {
        'ui:placeholder': 'Enter Institute Name'
    },
    Specialization: {
        'ui:placeholder': 'Enter Specialization'
    },
    Type_of_degree: {
        'ui:placeholder': 'Select type of degree'
    },
    Year: {
        'ui:placeholder': 'Enter year'
    },
    House_Number: {
        'ui:placeholder': 'Enter house number'
    },
    address1: {
        'ui:placeholder': 'Enter address'
    },
    address2: {
        'ui:placeholder': 'Enter address'
    },
    city: {
        'ui:placeholder': 'Enter city'
    },
    state: {
        'ui:placeholder': 'Enter state'
    },
    country: {
        'ui:placeholder': 'Enter country'
    },
    zipcode: {
        'ui:placeholder': 'Enter valid zipcode of your area'
    },
    Title: {
        'ui:placeholder': 'Enter address label eg: Permanent or Temporary'
    }
};
