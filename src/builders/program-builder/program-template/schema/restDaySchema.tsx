import DaysInput from '../daysInput';

export const widgets = {
     daysInput: DaysInput
};

export const schema: any = {
     day: {
          "ui:widget": (props) => {
               return <DaysInput onChange={props.onChange}/>
           }
     }
}