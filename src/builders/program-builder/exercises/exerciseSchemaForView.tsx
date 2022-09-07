import TextEditor from "../../../components/customWidgets/textEditor";
import EquipmentSearch from "../../../components/customWidgets/equipmentListSelect";
import MuscleGroupSearch from "../../../components/customWidgets/muscleGroupMultiSelect";
import FitnessSelect from "../../../components/customWidgets/fitnessSelect";
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
        "ui:readonly": true
    },
    level: {
        "ui:widget": "radio",
        "ui:options": {
            inline: true,
        },
        "ui:readonly": true
    },
    description: {
        "ui:widget": "textarea",
        "ui:options": {
            rows: 3,
        },
        "ui:readonly": true
    },
    miniDescription: {
        "ui:widget": "textarea",
        "ui:options": {
            rows: 3,
        },
        "ui:readonly": true
    },
    equipment: {
        "ui:widget": "equipmentSearch",
        "ui:help": "it is required field",
        "ui:readonly": true
    },
    muscleGroup: {
        "ui:widget": "muscleGroupSearch",
        "ui:help": "it is required field",
        "ui:readonly": true
    },
    discipline: {
        "ui:widget": "fitnessSelect",
        "ui:readonly": true
    },
    addExercise: {
        AddText: {
            "ui:widget": "textEditor",
            "ui:readonly": true
        },
        Upload: {
            "ui:widget": (props: any) => {
                return <Upload allowImage={false} allowVideo={true} onChange={props.onChange} value={props.value} />;
            },
            "ui:readonly": true
        },
    },
};
