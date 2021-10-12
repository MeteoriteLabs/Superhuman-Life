import TimeField from '../../../../components/customWidgets/multipleTimeFields';
import DaysInput from '../daysInput';
import NewActivity from '../../../../components/customWidgets/activityList';

export const widgets = {
     daysInput: DaysInput,
     timeField: TimeField,
     activityField: NewActivity
};

export const schema: any = {
     day: {
          "ui:widget": (props) => {
               return <DaysInput onChange={props.onChange}/>
          }
     },
     time: {
          "ui:widget": (props) => {
               return <TimeField onChange={props.onChange}/>
          }
     },
     newActivity: {
          "ui:widget": "activityField"
     }
}