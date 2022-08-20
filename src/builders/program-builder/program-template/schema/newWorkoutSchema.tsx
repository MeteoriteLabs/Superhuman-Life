import TimeField from '../../../../components/customWidgets/timeField';
import FitnessMultiSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSearch from '../../../../components/customWidgets/equipmentList';
import MuscleGroupSearch from '../../../../components/customWidgets/muscleGroupList';
import TextEditor from '../../../../components/customWidgets/textEditor';
import BuildWorkout from '../../workout/buildWorkout';
import DaysInput from '../daysInput';
import ClassTypeSelect from '../../../../components/customWidgets/classTypeSelect';

export const widgets = {
     daysInput: DaysInput,
     timeField: TimeField,
     fitnessSelect: FitnessMultiSelect,
     equipmentSearch: EquipmentSearch,
     muscleGroupSearch: MuscleGroupSearch,
     textEditor: TextEditor,
     buildWorkout: BuildWorkout
};

export const schema: any = {
    tag: {
        "ui:widget": (props) => {
             return <ClassTypeSelect onChange={props.onChange} />
        }
    },
     day: {
          "ui:widget": (props) => {
              return <DaysInput dayType={schema.type} startDate={schema.startDate} duration={schema.duration} id="newWorkout" onChange={props.onChange}/>
          }
     },
     time: {
          "ui:widget": (props) => {
               return <TimeField onChange={props.onChange}/>
          }
     },
     level: {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
      },
      intensity: {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
      },
      about: {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3
          }
      },
      benefits: {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 1
          }
      },
      equipment: {
          "ui:widget": "equipmentSearch"
      },
      muscleGroup: {
          "ui:widget": "muscleGroupSearch"
      },
      discipline: {
          "ui:widget": "fitnessSelect"
      },
      addWorkout: {
          "AddText": {
              "ui:widget": "textEditor"
          },
          Upload: {
              "ui:options": {
                  "accept": ".mp4"
              }
          },
          build: {
              "ui:widget": "buildWorkout"
          }
     }
}