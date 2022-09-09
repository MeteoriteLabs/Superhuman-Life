import PricingTableChannel from './pricingTableChannel';
import PreviewChannel from './previewChannel';
import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import ChannelConfig from './channelConfig';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewChannel: PreviewChannel,
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect,
    channelConfig: ChannelConfig,
};

export const schemaView: any = {
        "channelName": {
            "ui:readonly": true
        },
        "tag": {
            "ui:readonly": true
        },
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            },
            "ui:readonly": true
        },
        "intensity": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            },
            "ui:readonly": true
        },
        "discpline": {
            "ui:widget": "fitnessSelect",
            "readonly": true
        },
        "equipment": {
            "ui:widget": "equipmentSelect",
            "readonly": true
        },
        "About": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            },
            "ui:placeholder": "About the program",
            "ui:readonly": true,
        },
        "Benifits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            },
            "ui:placeholder": "Benifits of the program",
            "ui:readonly": true,
        },
        "datesConfig": {
            "ui:widget": "datesConfig",
            "ui:readonly": true,
        },
        "thumbnail": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} readonly={true}/>;
            },
        },
        "Upload": {
            "upload": {
                "ui:widget": (props: any) => {
                    console.log(props)
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} readonly={true}/>;
                },
            },  
            "VideoUrl": {
                "ui:placeholder": "https://",
                "ui:readonly": true,
            }
        },
        "visibility": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            },
            "ui:readonly": true,
        },
        "config": {
            "acceptBooking": {
                "ui:widget": "radio",
                "ui:options": {
                    "inline": true
                }
            },
            "ui:readonly": true,
            "maxBookingMonth": {
                "ui:readonly": true,
            },
            "maxBookingDay": {
                "ui:readonly": true
            }
        },
        "programSchedule": {
            "ui:widget": "checkboxes",
            "ui:readonly": true
        },
        "channelinstantBooking": {
            "ui:widget": "channelConfig",
            "ui:readonly": true
        },
        "pricing": {
            "ui:widget": "pricingTableChannel",
            "ui:readonly": true
        },
        "preview": {
            "ui:widget": "previewChannel",
            "ui:readonly": true
        }
    }