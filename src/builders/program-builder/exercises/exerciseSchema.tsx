import TextEditor from 'components/customWidgets/textEditor';
import EquipmentSearch from 'components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from 'components/customWidgets/muscleGroupMultiSelect';
import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';
import Upload from 'components/upload/upload';

export const widgets = {
    fitnessSelect: FitnessMultiSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor,
    upload: Upload
};

export const schema: any = {
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    exercise: {
        'ui:placeholder': 'Enter exercise name'
    },
    description: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        }
    },

    miniDescription: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:help': 'Give a short and simple explanation for the user to understand the exercise.',
        'ui:placeholder': 'Write description'
    },
    equipment: {
        'ui:widget': 'equipmentSearch',
        'ui:help':
            'Add all equipments required to perform the exercise. Example - Pullup you can add a pullup bar and resistance bands. It is required field'
    },
    muscleGroup: {
        'ui:widget': 'muscleGroupSearch',
        'ui:help': 'Add muscles targeted by this exercise. It is required field'
    },
    discipline: {
        'ui:widget': 'fitnessSelect',
        'ui:help': 'Choose the relevant  discipline for the workout. It is required field'
    },
    addExercise: {
        AddURL: {
            'ui:placeholder': 'https://'
        },
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
        }
    }
};
