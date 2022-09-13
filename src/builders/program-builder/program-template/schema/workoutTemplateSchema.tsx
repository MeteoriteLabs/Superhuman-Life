import WorkoutList from '../../../../components/customWidgets/workoutList';
import TimeField from '../../../../components/customWidgets/timeField';
import DaysInput from '../daysInput';
import ClassTypeSelect from '../../../../components/customWidgets/classTypeSelect';

export const widgets = {
     workoutList: WorkoutList,
     daysInput: DaysInput,
     timeField: TimeField
};

export const schema: any = {
     effectiveDate: null,
     tag: {
          "ui:widget": (props) => {
               return <ClassTypeSelect onChange={props.onChange} value={props.value}/>
          }
     },
     day: {
          "ui:widget": (props) => {
               return <DaysInput dayType={schema.type} startDate={schema.startDate} duration={schema.duration} id="newWorkout" onChange={props.onChange} val={props.value}/>
           }
     },
     workoutEvent: {
          "ui:widget": "workoutList"
     },
     time: {
          "ui:widget": (props) => {
               return <TimeField onChange={props.onChange} value={props.value}/>
          }
     }
}