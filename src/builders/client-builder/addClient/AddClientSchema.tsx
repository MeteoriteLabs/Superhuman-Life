import OfferingsList from '../../../components/customWidgets/OfferingsOfferedByChangemaker';
import ClientContactLeadList from '../../../components/customWidgets/ClientContactLeadList';
import classBasedOffering from '../../../components/customWidgets/classBasedOffering';

export const widgets = {
  offerings: OfferingsList,
  contactList: ClientContactLeadList,
  classBasedOffering: classBasedOffering
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
  },
  classBasedOfferings: {
    'ui:widget': 'classBasedOffering'
  }
};
