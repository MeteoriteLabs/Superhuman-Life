import FitnessMultiSelect from '../../../components/customWidgets/fitnessMultiSelect';

export const widgetsView = {
    fitnessSelect: FitnessMultiSelect
};

export const schemaView: Record<string, unknown> = {
    programName: {
        'ui:readonly': true
    },
    duration: {
        'ui:readonly': true
    },
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        },
        'ui:readonly': true
    },
    details: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:readonly': true
    },
    discipline: {
        'ui:widget': 'fitnessSelect',
        readonly: true
    }
};
