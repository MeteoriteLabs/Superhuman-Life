import PricingTableChannel from '../widgets/pricingTableChannel';
import PreviewChannel from '../widgets/previewChannel';
import Upload from '../../../../../components/upload/upload';
import DatesConfig from '../../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../../components/customWidgets/fitnessSelect';
import EquipmentSelect from '../../../../../components/customWidgets/equipmentListSelect';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewChannel: PreviewChannel,
    datesConfig: DatesConfig,
    fitnessSelect: FitnessSelect,
    equipmentSelect: EquipmentSelect
};

export const schema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "intensity": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "discpline": {
            "ui:widget": "fitnessSelect",
        },
        "equipment": {
            "ui:widget": "equipmentSelect",
        },
        "About": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "Benifits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "datesConfig": {
            "ui:widget": "datesConfig"
        },
        "thumbnail": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
            },
        },
        "Upload": {
            "upload": {
                "ui:widget": (props: any) => {
                    console.log(props)
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
                },
            },  
            "VideoUrl": {
                "ui:placeholder": "https://"
            }
        },
        "visibility": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "config": {
            "acceptBooking": {
                "ui:widget": "radio",
                "ui:options": {
                    "inline": true
                }
            }
        },
        "programSchedule": {
            "ui:widget": "checkboxes"
        },
        "channelinstantBooking": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "pricing": {
            "ui:widget": "pricingTableChannel"
        },
        "preview": {
            "ui:widget": "previewChannel"
        }
    }