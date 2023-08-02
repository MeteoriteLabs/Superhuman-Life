import { UseFormReset } from 'react-hook-form';
import { ClientPlans, Data, FormData, SectionData, ServerPlans } from '../@types/pricingType';

export const FormatReceivedDataToState = (plans: ServerPlans): ClientPlans[] => {
    return plans.map((plan): ClientPlans => {
        return {
            actual: plan.actual,
            buttonLink: plan.button.link,
            buttonText: plan.button.text,
            discount: plan.discount,
            features: plan.features,
            price: plan.price,
            recurring: plan.recurring,
            title: plan.title
        };
    });
};

export const FormatStateToServerData = (plans: ClientPlans[]): ServerPlans => {
    return plans.map((plan: ClientPlans) => {
        return {
            actual: plan.actual,
            button: { link: plan.buttonLink, text: plan.buttonText },
            discount: plan.discount,
            features: plan.features,
            price: plan.price,
            recurring: plan.recurring,
            title: plan.title
        };
    });
};

export function SetReceivingDataAndReset({
    sectionData,
    data,
    initialValues,
    reset,
    setInitialValues
}: {
    sectionData: SectionData;
    data: Data;
    initialValues: FormData;
    reset: UseFormReset<FormData>;
    setInitialValues: React.Dispatch<React.SetStateAction<FormData>>;
}): void {
    if (!initialValues.plans.length) {
        setInitialValues({
            ...initialValues,
            sectionId: data.websiteSections.data[0].id,
            title: sectionData.title,
            plans: FormatReceivedDataToState(sectionData.plans),
            currency: sectionData.currency
        });

        reset({
            title: sectionData.title,
            plans: FormatReceivedDataToState(sectionData.plans),
            currency: sectionData.currency
        });
    }
}
