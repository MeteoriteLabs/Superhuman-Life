import TimeField from '../../../../components/customWidgets/multipleTimeFields';
import DaysInput from '../daysInput';
import TextEditor from '../../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../../components/customWidgets/equipmentList';
import MuscleGroupSearch from '../../../../components/customWidgets/muscleGroupList';
import FitnessMultiSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import BuildWorkout from '../../workout/buildWorkout';
import WorkoutList from '../../../../components/customWidgets/workoutList';

export const widgets = {
     daysInput: DaysInput,
     workoutList: WorkoutList,
     timeField: TimeField,
     fitnessSelect: FitnessMultiSelect,
     equipmentSearch: EquipmentSearch,
     muscleGroupSearch: MuscleGroupSearch,
     textEditor: TextEditor,
     buildWorkout: BuildWorkout
};

export const schema: any = {
    day: {
        "ui:widget": "daysInput"
    },
    time: {
        "ui:widget": (props) => {
             return <TimeField onChange={props.onChange}/>
        }
    },
    "conditional": {
        "Create New Workout": {
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
        },
        "Import": {
            workoutEvent: {
                "ui:widget": "workoutList"
            }
        }
    },
}