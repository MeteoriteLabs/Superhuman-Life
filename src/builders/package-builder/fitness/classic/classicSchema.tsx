import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import LanguageSelect from '../../../../components/customWidgets/languageSelect';
import ClassicProgramDetails from './classicProgramDetails';
import ClassicBookingConfig from './bookingConfig';
import ClassicPricingTable from './classicPricingTable';

export const widgets = {
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    classicProgramDetails: ClassicProgramDetails,
    classPricingTable: ClassicPricingTable,
    classicBookingConfig: ClassicBookingConfig,
    classicLanguageSelect: LanguageSelect
};

export const schema: any = {
    tags: {
        'ui:placeholder': 'Enter tag name'
    },
    packagename: {
        'ui:placeholder': 'Enter package name'
    },
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
    programDetails: {
        'ui:widget': 'classicProgramDetails',
        'ui:help': 'Sum of sessions and rest days should be less than or equal to duration'
    },
    pricingDetail: {
        'ui:widget': 'classPricingTable'
    },
    datesConfig: {
        'ui:widget': 'datesConfig'
    },
    visibility: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    languages: {
        'ui:widget': 'classicLanguageSelect'
    },
    config: {
        bookingConfig: {
            'ui:widget': 'classicBookingConfig'
        }
    }
};
