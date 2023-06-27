import { UseFormReset } from 'react-hook-form'
import { Data, FormData, SectionData } from '../@types/testimonialsType'

export function SetReceivingDataAndReset({
    sectionData,
    data,
    initialValues,
    reset,
    setInitialValues
}: {
    sectionData: SectionData
    data: Data
    initialValues: FormData
    reset: UseFormReset<FormData>
    setInitialValues: React.Dispatch<React.SetStateAction<FormData>>
}): void {
    if (initialValues.testimonials.length === 0) {
        setInitialValues({
            ...initialValues,
            sectionId: data.websiteSections.data[0].id,
            title: sectionData.title,
            testimonials: sectionData.testimonials
        })

        reset({
            title: sectionData.title,
            testimonials: sectionData.testimonials
        })
    }
}
