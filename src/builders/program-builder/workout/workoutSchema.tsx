import TextEditor from '../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../components/customWidgets/equipmentList';
import MuscleGroupSearch from '../../../components/customWidgets/muscleGroupList';
import FitnessSelect from '../../../components/customWidgets/fitnessMultiSelect';
import BuildWorkout from './buildWorkout';


export const widgets = {
     fitnessSelect: FitnessSelect,
     equipmentSearch: EquipmentSearch,
     muscleGroupSearch: MuscleGroupSearch,
     textEditor: TextEditor,
     buildWorkout: BuildWorkout
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
                "ui:options": {
                    "accept": ".mp4"
                }
            },
            "build": {
                "ui:widget": "buildWorkout"
            }
       }
    }