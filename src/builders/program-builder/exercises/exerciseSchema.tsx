import TextEditor from "../../../components/customWidgets/textEditor";
import EquipmentSearch from "../../../components/customWidgets/equipmentList";
import MuscleGroupSearch from "../../../components/customWidgets/muscleGroupList";
import FitnessSelect from "../../../components/customWidgets/fitnessSelect";
import Upload from '../../../components/upload/upload';

export const widgets = {
  fitnessSelect: FitnessSelect,
  equipmentSearch: EquipmentSearch,
  muscleGroupSearch: MuscleGroupSearch,
  textEditor: TextEditor,
  upload: Upload
};

export const schema: any = {
  level: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  description: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
  },
  miniDescription: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
  },
  equipment: {
    "ui:widget": "equipmentSearch",
  },
  muscleGroup: {
    "ui:widget": "muscleGroupSearch",
  },
  discipline: {
    "ui:widget": "fitnessSelect",
  },
  addExercise: {
    AddText: {
      "ui:widget": "textEditor",
    },
    Upload: {
      "ui:widget": (props: any) => {
        return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
      },
    },
  },
};
