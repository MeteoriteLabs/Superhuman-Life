import GoalSearch from './forms/GoalSearch';
export const widgets = {
    PackageSearch: GoalSearch
};

export const schema: any = {
    packagesearch: {
        'ui:widget': 'PackageSearch'
    }
};
