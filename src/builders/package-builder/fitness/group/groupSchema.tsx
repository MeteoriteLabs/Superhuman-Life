import Upload from '../../../../components/upload/upload';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import LanguageList from '../../../../components/customWidgets/languageSelect';
import GroupProgramDetails from './groupProgramDetails';
import GroupConfig from './groupConfig';
import GroupPricingTable from './groupPricingTable';
import GroupBookingConfig from './bookingConfig';
import GroupPrimaryDateConfig from './primaryDatesConfig';
import DatesConfig from './groupDateConfig';

export const widgets = {
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    groupProgramDetails: GroupProgramDetails,
    groupConfig: GroupConfig,
    groupPricingTable: GroupPricingTable,
    groupBookingConfig: GroupBookingConfig,
    languageList: LanguageList
};

export const schema: any = {
    disciplines: {
        'ui:widget': 'fitnessSelect'
    },
    equipmentList: {
        'ui:widget': 'equipmentSelect'
    },
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    intensity: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    classSize: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    About: {
        'ui:widget': 'textarea',
        'ui:autofocus': true,
        'ui:options': {
            rows: 3
        },
        'ui:placeholder': 'About the program'
    },
    Benifits: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:placeholder': 'Benefits of the program'
    },
    thumbnail: {
        'ui:widget': (props: any) => {
            return (
                <Upload
                    allowImage={true}
                    allowVideo={false}
                    onChange={props.onChange}
                    value={props.value}
                    title={'Thumbnail'}
                />
            );
        }
    },
    VideoUrl: {
        'ui:placeholder': 'https://'
    },
    tags: {
        'ui:placeholder': 'Enter tag name'
    },
    packagename: {
        'ui:placeholder': 'Enter package name'
    },
    programDetails: {
        'ui:widget': 'groupProgramDetails',
        'ui:help': 'Sum of all sessions and rest days should be less than or equal to 30 days'
    },
    groupinstantbooking: {
        'ui:widget': 'groupConfig'
    },
    pricingDetail: {
        'ui:widget': 'groupPricingTable'
    },
    visibility: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    datesConfig: {
        'ui:widget': 'datesConfig'
    },
    durationOfOffering: {
        'ui:widget': 'checkboxes',
        'ui:options': {
            inline: true
        }
    },
    languages: {
        'ui:widget': 'languageList'
    },
    config: {
        bookingConfig: {
            'ui:widget': 'groupBookingConfig'
        }
    },
    dates: {
        'ui:widget': (props: any) => {
            return (
                <GroupPrimaryDateConfig
                    title1={'Start Date'}
                    title2={'End Date'}
                    value={props.value}
                    onChange={props.onChange}
                    type={'Cohort'}
                />
            );
        }
    }
};
