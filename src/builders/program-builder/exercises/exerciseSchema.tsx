import TextEditor from '../search-builder/textEditor';
import EquipmentSearch from '../search-builder/equipmentList';
import MuscleGroupSearch from '../search-builder/muscleGroupList';
import FitnessSelect from '../search-builder/fitnessSelect';


export const widgets = {
    fitnessSelect: FitnessSelect,
    equipmentSearch: EquipmentSearch,
    muscleGroupSearch: MuscleGroupSearch,
    textEditor: TextEditor
};

export const schema: any = {
          "level": {
              "ui:widget": "radio",
              "ui:options": {
                  "inline": true
              }
          },
          "description": {
              "ui:widget": "textarea",
              "ui:options": {
                  "rows": 3
              }
          },
          "miniDescription": {
              "ui:widget": "textarea",
              "ui:options": {
                  "rows": 3
              }
          },
          "equipment": {
              "ui:widget": "equipmentSearch"
          },
          "muscleGroup": {
              "ui:widget": "muscleGroupSearch"
          },
          "discipline": {
            "ui:widget": "fitnessSelect"
          },
          "addExercise": {
              "AddText": {
                  "ui:widget": "textEditor"
              },
              "Upload": {
                  "ui:options": {
                      "accept": ".mp4"
                  }
              }
         }
      }