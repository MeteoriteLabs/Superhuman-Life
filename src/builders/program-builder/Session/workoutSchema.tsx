import TextEditor from 'components/customWidgets/textEditor';
import EquipmentSearch from 'components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from 'components/customWidgets/muscleGroupMultiSelect';
import ExerciseList from 'components/customWidgets/exerciseList';
import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';
import Upload from 'components/upload/upload';

export const widgets = {
    fitnessSelect: FitnessMultiSelect,
    equipmentSearch: EquipmentSearch,
    textEditor: TextEditor,
    upload: Upload,
    exerciseList: ExerciseList
};

export const schema: any = {
    workout: {
        'ui:placeholder': 'Enter session title'
    },
    
    about: {
        'ui:widget': 'textEditor',
        'ui:tile': 'About',
        'ui:placeholder': 'Explain in detail about the session'
    },
    agenda: {
        'ui:widget': 'textEditor',
        'ui:placeholder': 'Explain in detail about the session'
    },
    equipment: {
        'ui:widget': 'equipmentSearch',
        'ui:help':
            'Add all equipments required to perform the exercise. Example - Pullup you can add a pullup bar and resistance bands.It is required field'
    },
 
    // equipment: {
    //     'ui:widget': 'equipmentSearch'
    // },
   
    addWorkout: {
        AddText: {
            'ui:widget': 'textEditor'
        },
        Upload: {
            'ui:widget': (props: any) => {
                return (
                    <Upload
                        allowImage={false}
                        allowVideo={true}
                        onChange={props.onChange}
                        value={props.value}
                    />
                );
            }
        },
        build: {
            'ui:widget': 'buildWorkout'
        },
        warmup: {
            exercise: {
                'ui:widget': 'exerciseList',
                'ui:options': {
                    label: false
                }
            },
            text: {
                'ui:widget': 'textEditor'
            },
            url: {
                'ui:placeholder': 'https://'
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                        />
                    );
                }
            }
        },
        mainmovement: {
            exercise: {
                'ui:widget': 'exerciseList',
                'ui:options': {
                    color: 'yellow'
                }
            },
            text: {
                'ui:widget': 'textEditor'
            },
            url: {
                'ui:placeholder': 'https://'
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                        />
                    );
                }
            }
        },
        cooldown: {
            exercise: {
                'ui:widget': 'exerciseList'
            },
            text: {
                'ui:widget': 'textEditor'
            },
            url: {
                'ui:placeholder': 'https://'
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                        />
                    );
                }
            }
        }
    }
};
