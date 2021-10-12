import WorkoutList from '../../../../components/customWidgets/workoutList';
import TimeField from '../../../../components/customWidgets/multipleTimeFields';
import DaysInput from '../daysInput';

export const widgets = {
     workoutList: WorkoutList,
     daysInput: DaysInput,
     timeField: TimeField
};

export const schema: any = {
     day: {
          "ui:widget": (props) => {
               return <DaysInput id="newWorkout" onChange={props.onChange}/>
           }
     },
     workoutEvent: {
          "ui:widget": "workoutList"
     },
     time: {
          "ui:widget": (props) => {
               return <TimeField title="Start Time" onChange={props.onChange}/>
          }
     }
}