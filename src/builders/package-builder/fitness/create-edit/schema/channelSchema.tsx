import BookingsWidget  from "../widgets/bookingsWidget";
import PricingTableChannel from '../widgets/pricingTableChannel';
import BookingConfig from '../widgets/bookingConfig';

export const widgets = {
    bookingWidget: BookingsWidget,
    pricingTableChannel: PricingTableChannel,
    bookingConfig: BookingConfig
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
                "rows": 1
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
        "programSchedule": {
            "ui:widget": "checkboxes"
        },
        "bookingConfig": {
            "ui:widget": "bookingWidget"
        },
        "pricing": {
            "ui:widget": "pricingTableChannel"
        },
        "config": {
            "ui:widget": "bookingConfig"
        }
    }