import PricingTableChannel from '../widgets/pricingTableChannel';
import PreviewChannel from '../widgets/previewChannel';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewChannel: PreviewChannel
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
        "UploadPicture": {
            "ui:options": {
                "accept": ".png, .svg, .jpg"
            }
        },
        "UploadVideo": {
            "ui:options": {
                "accept": ".mp4"
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