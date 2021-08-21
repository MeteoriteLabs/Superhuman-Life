import WorkoutList from '../../../../components/customWidgets/workoutList';
import TimeField from '../../../../components/customWidgets/timeField';
import DaysInput from '../daysInput';

export const widgets = {
     workoutList: WorkoutList,
     daysInput: DaysInput,
     timeField: TimeField
};

export const schema: any = {
     day: {
          "ui:widget": "daysInput"
     },
     workoutEvent: {
          "ui:widget": "workoutList"
     },
     startTime: {
          "ui:widget": (props) => {
               return <TimeField title="Start Time" onChange={props.onChange}/>
          }
     },
     endTime: {
          "ui:widget": (props) => {
               return <TimeField title="End Time" onChange={props.onChange}/>
          }
     }
}