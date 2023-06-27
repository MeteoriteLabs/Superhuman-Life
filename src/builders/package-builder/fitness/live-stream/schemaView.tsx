import PricingTableChannel from './pricingTableChannel';
import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import ChannelConfig from './channelConfig';
import LanguageList from '../../../../components/customWidgets/languageSelect';
import LiveBookingConfig from './bookingConfig';
import ChannelPrimaryDateConfig from './primaryDatesConfig';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    channelConfig: ChannelConfig,
    liveBookingConfig: LiveBookingConfig,
    liveChannelLanguageSelect: LanguageList
};

export const schemaView: any = {
    channelName: {
        'ui:readonly': true
    },
    tag: {
        'ui:readonly': true
    },
    durationOfOffering: {
        'ui:widget': 'checkboxes',
        'ui:options': {
            inline: true
        }
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
    discpline: {
        'ui:widget': 'fitnessSelect',
        readonly: true
    },
    equipment: {
        'ui:widget': 'equipmentSelect',
        readonly: true
    },
    About: {
        'ui:widget': 'textarea',
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
        'ui:placeholder': 'Benefits of the program',
        'ui:readonly': true
    },
    datesConfig: {
        'ui:widget': 'datesConfig',
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
    visibility: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    config: {
        bookingConfig: {
            'ui:widget': 'liveBookingConfig',
            readonly: true
        }
    },
    programSchedule: {
        'ui:widget': 'checkboxes',
        'ui:readonly': true
    },
    channelinstantBooking: {
        'ui:widget': 'channelConfig',
        'ui:readonly': true
    },
    pricing: {
        'ui:widget': 'pricingTableChannel',
        'ui:readonly': true
    },
    languages: {
        'ui:widget': 'liveChannelLanguageSelect',
        'ui:readonly': true
    },
    dates: {
        'ui:widget': (props: any) => {
            return (
                <ChannelPrimaryDateConfig
                    title1={'Start Date'}
                    title2={'End Date'}
                    value={props.value}
                    onChange={props.onChange}
                    type={'Cohort'}
                    readonly={true}
                />
            );
        }
    }
};
