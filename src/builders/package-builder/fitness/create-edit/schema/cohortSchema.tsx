import PricingTableChannel from '../widgets/pricingTableCohort';
import PreviewCohort from '../widgets/previewCohort';
import LocationList from '../widgets/locationList';
import LanguageList from '../widgets/languageSelect';
import ProgramDetails from '../widgets/programDetails';
import CourseDetails from '../widgets/course_details';
import Upload from '../../../../../components/upload/upload';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewCohort: PreviewCohort,
    locationList: LocationList,
    languageList: LanguageList,
    programDetails: ProgramDetails,
    courseDetails: CourseDetails
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
        "thumbnail": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
            },
        },
        "upload": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
            },
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
            "ui:widget": "previewCohort"
        },
        "programDetails": {
            "ui:widget": "programDetails"
        },
        "courseDetails": {
            "details": {
                "ui:widget": "courseDetails"
            }
        }
    }