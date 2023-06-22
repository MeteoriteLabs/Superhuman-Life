import { UseFormReset } from "react-hook-form";
import { ClientPlansTs, DataTs, FormData, SectionDataTs, ServerPlansTs, } from "../@types/pricingType";

export const FormatReceivedDataToState = (plans: ServerPlansTs): ClientPlansTs[]  => {
    return plans.map((plan): ClientPlansTs => {
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

  export const FormatStateToServerData = (plans: ClientPlansTs[]): ServerPlansTs  => {
    return plans.map((plan: ClientPlansTs) => {
      return {
        actual: plan.actual,
        button: {link:plan.buttonLink, text: plan.buttonText},
        discount: plan.discount,
        features: plan.features,
        price: plan.price,
        recurring: plan.recurring,
        title: plan.title
      };
    });
  };

 export  function SetReceivingDataAndReset({sectionData, data, initialValues, reset , setInitialValues }:{
    sectionData: SectionDataTs;
    data: DataTs;
    initialValues:FormData;
    reset: UseFormReset<FormData>;
    setInitialValues:  React.Dispatch<React.SetStateAction<FormData>>
  }): void {
    if (initialValues.plans.length === 0) {
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