import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';

export const widgets = {
    fitnessSelect: FitnessMultiSelect
};

export const schema: Record<string, unknown> = {
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
        'ui:placeholder': 'Write description'
    },
    details: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        },
        'ui:placeholder': 'Write summary of the program template'
    },

    discipline: {
        'ui:widget': 'fitnessSelect'
    }
};
