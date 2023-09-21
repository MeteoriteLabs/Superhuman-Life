import TextEditor from 'components/customWidgets/textEditor';
import EquipmentSearch from 'components/customWidgets/equipmentListSelect';
import MuscleGroupSearch from 'components/customWidgets/muscleGroupMultiSelect';
import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';
import BuildWorkout from './buildWorkout';
import Upload from 'components/upload/upload';

export const widgets = {
    fitnessSelect: FitnessMultiSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor,
    buildWorkout: BuildWorkout,
    upload: Upload
};

export const schemaView: any = {
    workout: {
        'ui:readonly': true,
        'ui:placeholder': 'Enter session title'
    },
    about: {
        'ui:widget': 'textEditor',
        'ui:readonly': true,
        'ui:placeholder': 'Explain in detail about the session'
    },
    equipment: {
        readonly: true,
        'ui:widget': 'equipmentSearch'
    },

    addWorkout: {
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
                        readonly={true}
                    />
                );
            }
        },
        AddURL: {
            'ui:readonly': true
        },
        build: {
            'ui:widget': 'buildWorkout'
        },
        warmup: {
            exercise: {
                'ui:widget': 'exerciseList',
                'ui:options': {
                    label: false
                },
                'ui:readonly': true
            },
            text: {
                'ui:widget': 'textEditor',
                readonly: true
            },
            url: {
                'ui:placeholder': 'https://',
                'ui:readonly': true
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                            readonly={true}
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
                },
                'ui:readonly': true
            },
            text: {
                'ui:widget': 'textEditor',
                readonly: true
            },
            url: {
                'ui:placeholder': 'https://',
                'ui:readonly': true
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                            readonly={true}
                        />
                    );
                }
            }
        },
        cooldown: {
            exercise: {
                'ui:widget': 'exerciseList',
                'ui:readonly': true
            },
            text: {
                'ui:widget': 'textEditor',
                readonly: true
            },
            url: {
                'ui:placeholder': 'https://',
                'ui:readonly': true
            },
            upload: {
                'ui:widget': (props: any) => {
                    return (
                        <Upload
                            allowImage={true}
                            allowVideo={true}
                            onChange={props.onChange}
                            value={props.value}
                            readonly={true}
                        />
                    );
                }
            }
        }
    }
};
