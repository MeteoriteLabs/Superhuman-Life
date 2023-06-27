import PricingTableChannel from './pricingTableChannel'
import Upload from '../../../../components/upload/upload'
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect'
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect'
import LanguageList from '../../../../components/customWidgets/languageSelect'
import ChannelConfig from './channelConfig'
import LiveBookingConfig from './bookingConfig'
import ChannelPrimaryDateConfig from './primaryDatesConfig'
import DatesConfig from './channelDateConfig'

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    channelConfig: ChannelConfig,
    liveBookingConfig: LiveBookingConfig,
    liveChannelLanguageSelect: LanguageList
}

export const schema: any = {
    tag: {
        'ui:placeholder': 'Enter tag name'
    },
    channelName: {
        'ui:placeholder': 'Enter package name'
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
    discpline: {
        'ui:widget': 'fitnessSelect'
    },
    equipment: {
        'ui:widget': 'equipmentSelect'
    },
    About: {
        'ui:widget': 'textarea',
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
    datesConfig: {
        'ui:widget': 'datesConfig'
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
            )
        }
    },
    VideoUrl: {
        'ui:placeholder': 'https://'
    },
    visibility: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    config: {
        bookingConfig: {
            'ui:widget': 'liveBookingConfig'
        }
    },
    programSchedule: {
        'ui:widget': 'checkboxes'
    },
    channelinstantBooking: {
        'ui:widget': 'channelConfig'
    },
    pricing: {
        'ui:widget': 'pricingTableChannel'
    },
    languages: {
        'ui:widget': 'liveChannelLanguageSelect'
    },
    durationOfOffering: {
        'ui:widget': 'checkboxes',
        'ui:options': {
            inline: true
        }
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
                />
            )
        }
    }
}
