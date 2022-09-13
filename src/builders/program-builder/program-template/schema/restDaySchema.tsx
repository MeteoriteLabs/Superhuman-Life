import DaysInput from '../daysInput';

export const widgets = {
     daysInput: DaysInput
};

export const schema: any = {
     day: {
          "ui:widget": (props) => {
               console.log(props);
               return <DaysInput dayType={schema.type} startDate={schema.startDate} duration={schema.duration} onChange={props.onChange} val={props.value}/>
           }
     }
}