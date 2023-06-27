import WorkoutList from '../../../../components/customWidgets/workoutList';

export const widgets = {
    workoutList: WorkoutList
};

export const schema: any = {
    workoutEvent: {
        'ui:widget': 'workoutList'
    }
};
