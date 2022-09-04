import PricingTableChannel from '../widgets/pricingTableCohort';
import PreviewCohort from '../widgets/previewCohort';
import LocationList from '../widgets/locationList';
import LanguageList from '../widgets/languageSelect';
import ProgramDetails from '../widgets/programDetails';
import CourseDetails from '../widgets/course_details';
import Upload from '../../../../../components/upload/upload';
import DatesConfig from '../../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../../components/customWidgets/fitnessSelect';
import EquipmentSelect from '../../../../../components/customWidgets/equipmentListSelect';

export const widgets = {
    pricingTableChannel: PricingTableChannel,
    previewCohort: PreviewCohort,
    locationList: LocationList,
    languageList: LanguageList,
    programDetails: ProgramDetails,
    courseDetails: CourseDetails,
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
        "languages": {
            "ui:widget": "languageList",
        },
        "thumbnail": {
            "ui:widget": (props: any) => {
                return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
            },
        },
        "datesConfig": {
            "ui:widget": "datesConfig"
        },
        "dates": {
            "ui:widget": (props: any) => {
                return <DatesConfig title1={'Start Date'} title2={'End Date'} value={props.value} onChange={props.onChange}/>
            }
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