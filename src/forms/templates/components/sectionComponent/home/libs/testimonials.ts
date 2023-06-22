import { UseFormReset } from "react-hook-form";
import { DataTs, FormData, SectionDataTs } from "../@types/testimonialsType";

export  function SetReceivingDataAndReset({sectionData, data, initialValues, reset , setInitialValues }:{
    sectionData: SectionDataTs;
    data: DataTs;
    initialValues:FormData;
    reset: UseFormReset<FormData>;
    setInitialValues:  React.Dispatch<React.SetStateAction<FormData>>
  }): void {
    if (initialValues.testimonials.length === 0) {
      setInitialValues({
        ...initialValues,
        sectionId: data.websiteSections.data[0].id,
        title: sectionData.title,
        testimonials: sectionData.testimonials,
       
      });

      reset({
        title: sectionData.title,
        testimonials: sectionData.testimonials,
      });
    }
  }