import TextEditor from '../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../components/customWidgets/equipmentList';
import MuscleGroupSearch from '../../../components/customWidgets/muscleGroupList';
import FitnessMultiSelect from '../../../components/customWidgets/fitnessMultiSelect';
import BuildWorkout from './buildWorkout';
import Upload from '../../../components/upload/upload';


export const widgets = {
    fitnessSelect: FitnessMultiSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor,
    buildWorkout: BuildWorkout,
    upload: Upload
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
        "about": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3
            }
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 1
            }
        },
        "equipment": {
            "ui:widget": "equipmentSearch"
        },
        "muscleGroup": {
            "ui:widget": "muscleGroupSearch"
        },
        "discipline": {
            "ui:widget": "fitnessSelect"
        },
        "addWorkout": {
            "AddText": {
                "ui:widget": "textEditor"
            },
            "Upload": {
                "ui:widget": (props: any) => {
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
                },
            },
            "build": {
                "ui:widget": "buildWorkout"
            }
       }
    }