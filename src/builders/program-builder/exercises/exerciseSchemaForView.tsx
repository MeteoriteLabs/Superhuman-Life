import TextEditor from '../../../components/customWidgets/textEditor';
import EquipmentSearch from '../../../components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from '../../../components/customWidgets/muscleGroupMultiSelect';
import FitnessSelect from '../../../components/customWidgets/fitnessSelect';
import Upload from '../../../components/upload/upload';

export const widgetsView = {
    fitnessSelect: FitnessSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor,
    upload: Upload
};

export const schemaView: any = {
    exercise: {
        'ui:readonly': true
    },
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    description: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:readonly': true
    },
    miniDescription: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:readonly': true,
        'ui:help': 'Give a short and simple explanation for the user to understand the exercise.'
    },
    equipment: {
        'ui:widget': 'equipmentSearch',
        'ui:help':
            'Add all equipments required to perform the exercise. Example - Pullup you can add a pullup bar and resistance bands. It is required field',
        readonly: true
    },
    muscleGroup: {
        'ui:widget': 'muscleGroupSearch',
        'ui:help': 'Muscles targeted by this exercise.It is required field',
        readonly: true
    },
    discipline: {
        'ui:widget': 'fitnessSelect',
        readonly: true,
        'ui:help': 'Choose the relevant  discipline for the workout. It is required field'
    },
    addExercise: {
        AddURL: {
            'ui:readonly': true
        },
        AddText: {
            'ui:widget': 'textEditor',
            readonly: true
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
