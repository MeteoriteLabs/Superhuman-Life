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
        'ui:widget': (props: { onChange: () => void; value: string }) => {
            return (
                <DaysInput
                    dayType={schema.type}
                    startDate={schema.startDate}
                    duration={schema.duration}
                    onChange={props.onChange}
                    val={props.value}
                />
            );
        }
    },
    time: {
        'ui:widget': (props: { onChange: () => void; value: string }) => {
            return <TimeField onChange={props.onChange} value={props.value} />;
        }
    },
    newActivity: {
        'ui:widget': 'activityField'
    }
};
