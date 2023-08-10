import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';

export const widgetsView = {
    fitnessSelect: FitnessMultiSelect
};

export const schemaView: Record<string, unknown> = {
    programName: {
        'ui:readonly': true,
        'ui:placeholder': 'Enter program name'
    },
    duration: {
        'ui:readonly': true,
        'ui:placeholder': 'Define the number of days'
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
        'ui:readonly': true,
        'ui:placeholder': 'Write summary of the program template'
    },
    discipline: {
        'ui:widget': 'fitnessSelect',
        readonly: true
    }
};
