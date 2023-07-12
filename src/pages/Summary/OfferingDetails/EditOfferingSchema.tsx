import OfferingsList from 'components/customWidgets/OfferingsOfferedByChangemaker';

export const widgets = {
    offerings: OfferingsList
};

interface Schema {
    offerings: {
        'ui:widget': string;
    };
    packageDuration: {
        'ui:placeholder': string;
    };
}

export const schema: Schema = {
    offerings: {
        'ui:widget': 'offerings'
    },
    packageDuration: {
        'ui:placeholder': 'Enter Package Duration'
    }
};
