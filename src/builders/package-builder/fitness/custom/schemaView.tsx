import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import CustomProgramDetails from './customProgramDetails';
import CustomPricingTable from './customPricingTable';
import LanguageList from '../../../../components/customWidgets/languageSelect';
import CustomBookingConfig from './bookingConfig';

export const widgets = {
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    customProgramDetails: CustomProgramDetails,
    customPricingTable: CustomPricingTable,
    customBookingConfig: CustomBookingConfig,
    customLanguageSelect: LanguageList
};

export const schemaView: any = {
    packagename: {
        'ui:readonly': true
    },
    disciplines: {
        'ui:widget': 'fitnessSelect',
        readonly: true
    },
    equipmentList: {
        'ui:widget': 'equipmentSelect',
        readonly: true
    },
    tags: {
        'ui:readonly': true
    },
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    intensity: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    classSize: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    About: {
        'ui:widget': 'textarea',
        'ui:autofocus': true,
        'ui:options': {
            rows: 3
        },
        'ui:placeholder': 'About the program',
        'ui:readonly': true
    },
    Benifits: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:placeholder': 'Benifits of the program',
        'ui:readonly': true
    },
    thumbnail: {
        'ui:widget': (props: any) => {
            return (
                <Upload
                    allowImage={true}
                    allowVideo={true}
                    onChange={props.onChange}
                    value={props.value}
                    title={'Thumbnail'}
                    readonly={true}
                />
            );
        }
    },
    VideoUrl: {
        'ui:placeholder': 'https://',
        'ui:readonly': true
    },
    programDetails: {
        'ui:widget': 'customProgramDetails',
        'ui:readonly': true,
        'ui:help': 'Sum of all sessions and rest days should be less than or equal to 30 days'
    },
    groupinstantbooking: {
        'ui:widget': 'groupConfig',
        'ui:readonly': true
    },
    pricingDetail: {
        'ui:widget': 'customPricingTable',
        'ui:readonly': true
    },
    visibility: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    datesConfig: {
        'ui:widget': 'datesConfig',
        'ui:readonly': true
    },
    languages: {
        'ui:widget': 'customLanguageSelect',
        'ui:readonly': true
    },
    config: {
        bookingConfig: {
            'ui:widget': 'customBookingConfig',
            readonly: true
        }
    }
};
