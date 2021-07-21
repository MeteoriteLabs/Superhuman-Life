import EquipmentSearch from '../../../components/customWidgets/equipmentList';
import FitnessMultiSelect from '../../../components/customWidgets/fitnessMultiSelect';

export const widgets = {
     fitnessSelect: FitnessMultiSelect,
     equipmentSearch: EquipmentSearch,
};

export const schema: any = {
     "level": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
     },
      "details": {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3
          }
     },
     "equipment": {
          "ui:widget": "equipmentSearch"
     },
     "discipline": {
          "ui:widget": "fitnessSelect"
     }
}