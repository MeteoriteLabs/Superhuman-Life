import PricingTableChannel from '../widgets/pricingTableChannel';
import PreviewChannel from '../widgets/previewChannel';
import Upload from '../../../../../components/upload/upload';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewChannel: PreviewChannel,
};

export const schema: any = {
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
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
        "thumbnail": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
            },
        },
        "upload": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'upload picture or video'}/>;
            },
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