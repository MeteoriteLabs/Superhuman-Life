import FitnessMultiSelect from '../../../components/customWidget/fitnessMultiSelect'

export const widgets = {
    fitnessSelect: FitnessMultiSelect
}

export const schema: any = {
    level: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    details: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 3
        }
    },

    discipline: {
        'ui:widget': 'fitnessSelect'
    }
}
