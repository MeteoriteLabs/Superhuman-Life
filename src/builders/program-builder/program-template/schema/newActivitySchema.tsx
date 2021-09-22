import TimeField from '../../../../components/customWidgets/timeField';
import DaysInput from '../daysInput';
import NewActivity from '../../../../components/customWidgets/activityList';

export const widgets = {
     daysInput: DaysInput,
     timeField: TimeField,
     activityField: NewActivity
};

export const schema: any = {
     day: {
          "ui:widget": "daysInput"
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
     },
     newActivity: {
          "ui:widget": "activityField"
     }
}