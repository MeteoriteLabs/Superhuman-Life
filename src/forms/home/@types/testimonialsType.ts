export type Data = {
    websiteSections: {
        data: {
            id: number;
            attributes: {
                sectionData: SectionData;
            };
        }[];
    };
};

export type SectionData = {
    title: string;
    testimonials: ServerTestimonials;
};

export type ServerTestimonials = {
    name: string;
    text: string;
    image: string;
    designation: string;
}[];

export type FormData = {
    sectionId: number;
    title: string;
    testimonials: ServerTestimonials;
};

export type InputProps = 'text' | 'image' | 'designation' | 'name';
