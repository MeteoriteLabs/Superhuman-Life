import OfferingsList from '../../../components/customWidgets/OfferingsOfferedByChangemaker';
import ClientContactLeadList from '../../../components/customWidgets/ClientContactLeadList';

export const widgets = {
  offerings: OfferingsList,
  contactList: ClientContactLeadList
};

export const schema: any = {
  existingEmail: {
    'ui:widget': 'contactList'
  },
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
  offerings: {
    'ui:widget': 'offerings'
  },
  type: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true
    }
  },
  offeringFilter:{
    'ui:widget': 'radio',
    'ui:options': {
      inline: true
    }
  }
};
