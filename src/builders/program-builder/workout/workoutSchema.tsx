import TextEditor from '../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from '../../../components/customWidgets/muscleGroupMultiSelect';
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
            },
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 1
            }
        },
        "equipment": {
            "ui:widget": "equipmentSearch",
            "ui:help": "Add all equipments required to perform the exercise. Example - Pullup you can add a pullup bar and resistance bands.It is required field"
        },
        "muscleGroup": {
            "ui:widget": "muscleGroupSearch",
            "ui:help": " Add all equipments required to perform the exercises in the workout.It is required field"
        },
        "discipline": {
            "ui:widget": "fitnessSelect",
            "ui:help": "Choose the relevant  discipline for the workout .It is required field"
        },
        "addWorkout": {
            "AddText": {
                "ui:widget": "textEditor"
            },
            "Upload": {
                "ui:widget": (props: any) => {
                    return <Upload allowImage={false} allowVideo={true} onChange={props.onChange} value={props.value} />;
                },
            },
            "build": {
                "ui:widget": "buildWorkout"
            }
       }
    }