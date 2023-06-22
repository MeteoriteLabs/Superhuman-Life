export type DataTs = {
    websiteSections: {
      data: {
        id: number;
        attributes: {
          sectionData: SectionDataTs;
        };
      }[];
    };
  };

export type SectionDataTs = {
        title: string;
        testimonials: ServerTestimonialsTs;
  }

export type ServerTestimonialsTs = {
    name: string;
    text: string;
    image: string;
    designation: string;
  }[];


  
export type FormData = {
    sectionId: number;
    title: string;
    testimonials:  ServerTestimonialsTs;
  };
  
 export type InputProps =
    | 'text'
    | 'image'
    | 'designation'
    | 'name';