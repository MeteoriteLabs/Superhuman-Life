import TextEditor from 'components/customWidgets/textEditor';
import EquipmentSearch from 'components/customWidgets/equipmentListSelect';
import ExerciseList from 'components/customWidgets/exerciseList';
import FitnessMultiSelect from 'components/customWidgets/fitnessMultiSelect';
import Upload from 'components/upload/uploadPDF';
import Urls from './urls';

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
    pdfUpload: {
        'ui:widget': (props: any) => {
            return <Upload onChange={props.onChange} value={props.value} />;
        }
    },
    url: {
        'ui:widget': (props: any) => {
            return <Urls onChange={props.onChange} value={props.value} />;
            
        }
    }
};
