import TextEditor from '../../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../../components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from '../../../../components/customWidgets/muscleGroupMultiSelect';
import ExerciseList from '../../../../components/customWidgets/exerciseList';
import FitnessMultiSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import Upload from '../../../../components/upload/upload';
import TimeField from '../../../../components/customWidgets/timeField';
import DaysInput from '../daysInput';
import ClassTypeSelect from '../../../../components/customWidgets/classTypeSelect';
import Toaster from '../../../../components/Toaster';

export const widgets = {
    fitnessSelect: FitnessMultiSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor,
    upload: Upload,
    exerciseList: ExerciseList
};

export const schema: any = {
        tag: {
            "ui:widget": (props) => {
                return <ClassTypeSelect onChange={props.onChange} value={props.value}/>
            }
        },
        day: {
            "ui:widget": (props) => {
                return <DaysInput dayType={schema.type} startDate={schema.startDate} duration={schema.duration} id="newWorkout" onChange={props.onChange} val={props.value}/>
            }
        },
        time: {
            "ui:widget": (props) => {
                return <TimeField onChange={props.onChange} value={props.value}/>
            }
        },
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
                "rows": 3
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
            },
            "warmup": {
                "exercise": {
                    "ui:widget": "exerciseList",
                    "ui:options": {
                     label: false
                    }
                },
                "text": {
                     "ui:widget": "textEditor"
                }, 
                "url": {
                    "ui:placeholder": "https://"
                },
                "upload": {
                     "ui:widget": (props: any) => {
                          return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
                     },
                }
            },
            "mainmovement": {
                "exercise": {
                    "ui:widget": "exerciseList",
                    "ui:options": {
                        color: "yellow"
                    }
                },
                "text": {
                     "ui:widget": "textEditor"
                }, 
                "url": {
                    "ui:placeholder": "https://"
                },
                "upload": {
                     "ui:widget": (props: any) => {
                          return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
                     },
                }
           },
           "cooldown": {
                "exercise": {
                    "ui:widget": "exerciseList"
                },
                "text": {
                     "ui:widget": "textEditor"
                }, 
                "url": {
                    "ui:placeholder": "https://"
                },
                "upload": {
                     "ui:widget": (props: any) => {
                          return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
                     },
                }
           },
       }
    }