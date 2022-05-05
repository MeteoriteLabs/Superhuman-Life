import PricingTableChannel from '../widgets/pricingTableCohort';
import PreviewChannel from '../widgets/preview';
import LocationList from '../widgets/locationList';
import LanguageList from '../widgets/languageSelect';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewChannel: PreviewChannel,
    locationList: LocationList,
    languageList: LanguageList
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
        "languages": {
            "ui:widget": "languageList",
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
        "mode": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "location": {
            "ui:widget": "locationList",
        },
        "residential": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "description": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "programSchedule": {
            "ui:widget": "checkboxes"
        },
        "pricing": {
            "ui:widget": "pricingTableChannel"
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
        "preview": {
            "ui:widget": (props: any) => {
                return <PreviewChannel props={props} />
            }
        }
    }