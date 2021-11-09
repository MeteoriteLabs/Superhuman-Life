import WorkoutList from '../../../../components/customWidgets/workoutList';
import TimeField from '../../../../components/customWidgets/timeField';
import DaysInput from '../daysInput';

export const widgets = {
     workoutList: WorkoutList,
     daysInput: DaysInput,
     timeField: TimeField
};

export const schema: any = {
     effectiveDate: null,
     day: {
          "ui:widget": (props) => {
               return <DaysInput startDate={schema.startDate} duration={schema.duration} id="newWorkout" onChange={props.onChange}/>
           }
     },
     workoutEvent: {
          "ui:widget": "workoutList"
     },
     time: {
          "ui:widget": (props) => {
               return <TimeField onChange={props.onChange}/>
          }
     }
}