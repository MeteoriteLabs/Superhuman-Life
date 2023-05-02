import OfferingsList from '../../../components/customWidgets/OfferingsOfferedByChangemaker';

export const widgets = {
  offerings: OfferingsList
};

export const schema: any = {
  
  offerings: {
    'ui:widget': 'offerings'
  },
  packageDuration: {
    'ui:placeholder': 'Enter Package Duration'
}
};
